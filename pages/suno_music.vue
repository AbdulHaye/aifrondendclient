<template>
  <div class="music-show flex w-full">
    <div
      style="width: 340px"
      class="flex h-full flex-col border-r-blue-200 draw-list-left relative"
    >
      <a-tabs
        @change="changeMusic"
        type="capsule"
        size="large"
        class="h-full mt-2"
      >
        <a-tab-pane key="refuse" title="专业模式">
          <div>
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    歌词内容
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
                >
                  <a-textarea
                    v-model="input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    placeholder="请输入歌词内容"
                  />
                  <div
                    class="des_check z-10 z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      :unmount-on-close="false"
                    >
                      <div>
                        <icon-relation />
                        联想
                      </div>
                      <template #content>
                        <div
                          class="bg-white siwei_contact w-100 p-4 rounded-xl shadow-sm"
                        >
                          <h5>歌词联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出歌词想法内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="music_loading"
                            @click="send_ai_draw()"
                            >生成歌词联想
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                  </div>
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[0]"
                    >
                      月光下的协奏
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[1]"
                    >
                      大海的心碎
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                模型选择
                <a-tooltip
                  content="mv模型，chirp-v3-0、chirp-v3-5。不写默认 chirp-v3-0"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-row :gutter="10" class="flex justify-content-center mj_version">
              <a-col
                :span="12"
                class="version-item"
                @click="version = 1"
                :class="version == 1 ? 'active' : ''"
              >
                <button
                  class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                >
                  <div
                    class="absolute flex items-center justify-center w-full h-full"
                  >
                    <div class="model-card__title"><span>chirp-v3-5</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/music.jpg"
                  />
                </button>
              </a-col>
              <a-col
                :span="12"
                class="version-item"
                @click="version = 2"
                :class="version == 2 ? 'active' : ''"
              >
                <button
                  class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                >
                  <div
                    class="absolute flex items-center justify-center w-full h-full"
                  >
                    <div class="model-card__title"><span>chirp-v3-0</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/music-1.jpg"
                  />
                </button>
              </a-col>
            </a-row>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">歌曲名称</span>
              <div class="flex-1">
                <a-input
                  v-model="music_title"
                  :max-length="20"
                  show-word-limit
                  allow-clear
                  placeholder="请输入歌曲名称"
                />
              </div>
              <a-tooltip content="参数释义：自定义歌曲标题">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">是否轻音乐</span>
              <div class="flex items-center">
                <div class="flex-1">
                  <a-switch v-model="is_gray_music" />
                </div>
                <a-tooltip content="参数释义：纯音乐无歌词">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center w-full justify-between relative">
                <div
                  class="flex-center w-full justify-between items-center mb-3"
                >
                  <h5
                    class="mb-0 left-panel-setting-block__title font-14 text-gray-2 flex justify-between"
                  >
                    歌曲标签
                    <a-tooltip content="筛选歌曲标签">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                  <div class="music-tag-me">
                    自定义
                    <a-switch v-model="music_tag_open" default-checked />
                  </div>
                </div>
              </div>

              <div class="UXmDHLrm">
                <a-textarea
                  v-model="music_tag"
                  class="bg-white pb-10"
                  :auto-size="{ minRows: 3, maxRows: 3 }"
                  type="textarea"
                  :max-length="2000"
                  show-word-limit
                  allow-clear
                  v-if="music_tag_open"
                  placeholder="请输入歌曲标签"
                />
                <a-row :gutter="20" v-else>
                  <a-col
                    :span="8"
                    v-for="(i, i_index) in music_tag_list"
                    :key="i_index"
                  >
                    <span
                      class="w-full p-1 flex items-center justify-center cursor-pointer"
                      :class="music_tag == i.value ? 'OMJ2YPhL' : ''"
                      @click="change_i(i.value)"
                      >{{ i.name }}</span
                    >
                  </a-col>
                </a-row>
              </div>
            </section>

            <!--<section-->
            <!--    class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">-->
            <!--    <div class="flex-center justify-between relative">-->
            <!--        <div class="flex-center"><h5 class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between">-->
            <!--            图片数量</h5></div>-->

            <!--    </div>-->
            <!--    <div class="UXmDHLrm">-->
            <!--        <span v-for="(i,i_index) in images_list" :key="i_index"-->
            <!--              :class="image_select==i.value?'OMJ2YPhL':''"-->
            <!--              @click="change_i(i.value)">{{ i.name }}</span>-->
            <!--    </div>-->
            <!--</section>-->
          </div>
        </a-tab-pane>
        <a-tab-pane key="think" title="灵感模式">
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  歌曲意境
                </h5>
              </div>
            </div>
            <div class="mt-2 fade-box draw_des_clip">
              <section
                class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
              >
                <a-textarea
                  v-model="input_ling"
                  class="bg-white pb-10"
                  :auto-size="{ minRows: 7, maxRows: 7 }"
                  type="textarea"
                  :max-length="2000"
                  show-word-limit
                  allow-clear
                  placeholder="请输入歌曲的想法风格"
                />
              </section>
              <div class="w-full flex align-items-center">
                <p class="flex-none text-gray-3 text-12">示范:</p>
                <ul
                  class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                >
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="input_ling = all_prompt_ling[0]"
                  >
                    哀伤
                  </li>
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="input_ling = all_prompt_ling[1]"
                  >
                    爱情
                  </li>
                </ul>
                <icon-refresh
                  class="cursor-pointer"
                  @click="change_prompt_ling()"
                />
              </div>
            </div>
          </section>
          <div class="left-panel-setting-block__header">
            <div class="left-panel-setting-block__title mt-2 fs-5">
              模型选择
              <a-tooltip
                content="mv模型，chirp-v3-0、chirp-v3-5。不写默认 chirp-v3-0"
              >
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
          </div>
          <a-row :gutter="10" class="flex justify-content-center mj_version">
            <a-col
              :span="12"
              class="version-item"
              @click="version = 1"
              :class="version == 1 ? 'active' : ''"
            >
              <button
                class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
              >
                <div
                  class="absolute flex items-center justify-center w-full h-full"
                >
                  <div class="model-card__title"><span>chirp-v3-5</span></div>
                </div>
                <img
                  class="object-cover w-full h-full rounded-xl"
                  src="@/assets/images/music.jpg"
                />
              </button>
            </a-col>
            <a-col
              :span="12"
              class="version-item"
              @click="version = 2"
              :class="version == 2 ? 'active' : ''"
            >
              <button
                class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
              >
                <div
                  class="absolute flex items-center justify-center w-full h-full"
                >
                  <div class="model-card__title"><span>chirp-v3-0</span></div>
                </div>
                <img
                  class="object-cover w-full h-full rounded-xl"
                  src="@/assets/images/music-1.jpg"
                />
              </button>
            </a-col>
          </a-row>
          <div class="flex items-center justify-between space-x-2 mt-2">
            <span class="w-[70px]">是否轻音乐</span>
            <div class="flex items-center">
              <div class="flex-1">
                <a-switch v-model="is_gray_music" />
              </div>
              <a-tooltip content="参数释义：纯音乐无歌词">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div
        class="absolute bottom-0 bg-white z-10 w-full h-110 p-4 bg-white-1 border-t border-r border-gray-5"
      >
        <div class="flex mb-2">
          <svg
            t="1690301472439"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6949"
            width="24"
            height="24"
          >
            <path
              d="M366 174h292a10 10 0 0 1 10 10v322a10 10 0 0 1-10 10H366a10 10 0 0 1-10-10V184a10 10 0 0 1 10-10z"
              fill="#4988FD"
              p-id="6950"
            ></path>
            <path
              d="M658 546H366c-22.056 0-40-17.944-40-40V184c0-22.056 17.944-40 40-40h292c22.056 0 40 17.944 40 40v322c0 22.056-17.944 40-40 40z m-272-60h252V204H386v282z"
              fill="#4988FD"
              p-id="6951"
            ></path>
            <path
              d="M507.582 304.244a4 4 0 0 1 7.188 0l86.972 178.018c0.586 1.2 1.734 2.03 201.152 28.936a4.002 4.002 0 0 1 2.216 6.87l-144.304 136.648a4.006 4.006 0 0 0-1.184 3.622l35.488 194.43a3.998 3.998 0 0 1-5.798 4.252l-176.244-93.506a4 4 0 0 0-3.75 0l-176.252 93.508a4 4 0 0 1-5.802-4.252l35.478-194.43a4.006 4.006 0 0 0-1.184-3.622l-144.304-136.648a4.002 4.002 0 0 1 2.216-6.868c199.416-26.912 200.564-27.736 201.152-28.938l86.96-178.02z"
              fill="#DFECFD"
              p-id="6952"
            ></path>
            <path
              d="M331.204 887.48a33.92 33.92 0 0 1-30.082-18.148 34.15 34.15 0 0 1-3.376-21.91l32.956-180.61-134.074-126.96c-13.616-12.902-14.196-34.464-1.302-48.074a34.1 34.1 0 0 1 20.136-10.308c104.136-14.054 161.49-21.976 184.632-25.53l80.534-164.864c5.66-11.588 17.654-19.078 30.552-19.078 5.146 0 10.31 1.196 14.936 3.458a34.138 34.138 0 0 1 15.618 15.634l80.54 164.848c23.146 3.554 80.498 11.476 184.634 25.528 18.572 2.502 31.652 19.656 29.15 38.234a34.138 34.138 0 0 1-10.318 20.146l-134.074 126.962 32.958 180.568a33.782 33.782 0 0 1-5.506 25.47 33.778 33.778 0 0 1-21.896 14.086c-7.242 1.318-15.208 0.138-21.874-3.368l-164.154-87.09-164.068 87.042a34.19 34.19 0 0 1-15.922 3.964z m-53.87-353.836l104.852 99.29a33.896 33.896 0 0 1 10.072 30.78l-25.848 141.656 128.848-68.36c9.79-5.19 22.078-5.184 31.85-0.01l128.854 68.364-25.852-141.64a33.904 33.904 0 0 1 10.052-30.778l104.868-99.302c-61.762-8.382-100.142-13.708-121.64-16.872-12.33-1.814-19.714-3.004-23.946-3.858-4.89-0.986-17.88-3.608-24.658-17.488l-63.608-130.192-63.6 130.196c-6.788 13.88-19.772 16.498-24.66 17.484-4.228 0.854-11.612 2.042-23.946 3.856-21.464 3.158-59.842 8.484-121.638 16.874z"
              fill="#DFECFD"
              p-id="6953"
            ></path>
            <path
              d="M418 651a29.9 29.9 0 0 1-21.212-8.788l-66-66c-11.716-11.714-11.716-30.71 0-42.426 11.714-11.714 30.71-11.714 42.426 0l66 66c11.716 11.714 11.716 30.71 0 42.426A29.908 29.908 0 0 1 418 651z"
              fill="#4988FD"
              p-id="6954"
            ></path>
          </svg>
          消耗{{ counter.setting.ai_music_cost
          }}{{ counter.setting.money_name_set }}/会员{{
            counter.setting.ai_music_limit
          }}次
        </div>
        <a-button
          :loading="draw_loading"
          @click="ai_music()"
          class="w-100"
          type="primary"
          size="large"
        >
          <icon-image class="up_images" />
          开始创作
        </a-button>
      </div>
    </div>
    <div class="music-content main relative">
      <div
        class="music-header justify-between p-3 flex items-center border shadow-sm border-b"
      >
        <h2 class="font-18 font-bold mb-0 flex items-center">
          <svg
            width="20"
            height="20"
            class="mobile_show mr-2"
            @click="openM = true"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              data-v-d9eddb53=""
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.5 5L5 5L5 2.5L2.5 2.5L2.5 5ZM5 11.25L2.5 11.25L2.5 8.75L5 8.75L5 11.25ZM17.5 11.25L15 11.25L15 8.75L17.5 8.75L17.5 11.25ZM8.75 11.25L11.25 11.25L11.25 8.75L8.75 8.75L8.75 11.25ZM5 17.5L2.5 17.5L2.5 15L5 15L5 17.5ZM15 17.5L17.5 17.5L17.5 15L15 15L15 17.5ZM11.25 17.5L8.75 17.5L8.75 15L11.25 15L11.25 17.5ZM17.5 5L15 5L15 2.5L17.5 2.5L17.5 5ZM8.75 5L11.25 5L11.25 2.5L8.75 2.5L8.75 5Z"
              fill="currentColor"
            ></path>
          </svg>
          AI音乐厅
        </h2>
        <a-button
          type="primary"
          :loading="refresh_loading"
          @click="get_all_music()"
        >
          <template #icon>
            <icon-refresh />
          </template>

          刷新音乐台
        </a-button>
      </div>
      <div
        class="mb-5 overflow-auto"
        :class="data.length > 0 ? 'music-content-list' : 'music-not-video'"
        v-if="music_list.length > 0"
      >
        <a-list :bordered="false" class="border">
          <a-list-item v-for="(item, idx) in music_list" :key="idx">
            <a-list-item-meta :title="item.title ? item.title : '未命名'">
              <template #description>
                <a-trigger trigger="hover" show-arrow>
                  <div class="truncate w-40">
                    {{ item.prompt }}
                  </div>
                  <template #content>
                    <div
                      class="bg-white rounded-xl p-3 shadow-xl h-80 overflow-auto"
                    >
                      <div
                        class="text-white"
                        v-html="renderMarkdown(item.prompt)"
                      ></div>
                    </div>
                  </template>
                </a-trigger>
                <div class="flex items-center">
                  <a-tag color="blue" class="mt-2 mr-2">{{ item.tags }}</a-tag>
                  <a-tag
                    color="red"
                    class="mt-2 mr-2"
                    v-if="item.status == 'failed'"
                  >
                    生成失败
                  </a-tag>
                  <a-tag
                    :color="item.progress == 100 ? 'green' : 'orange'"
                    class="mt-2"
                    v-else
                  >
                    {{
                      item.progress == 100 ? `已完成` : `进度${item.progress}%`
                    }}
                  </a-tag>
                </div>
              </template>
              <template #avatar>
                <img
                  @click="checkDetail(item.id)"
                  alt="avatar"
                  :src="item.image_url"
                  v-if="item.image_url"
                  class="w-20 rounded-full cursor-pointer"
                />
                <img
                  class="w-20 rounded-full"
                  src="@/assets/images/music.gif"
                  alt=""
                  v-else
                />
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button
                type="primary"
                round
                class="button"
                @click="handleThumbsUp(item.id)"
              >
                <template #icon>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017
                c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095
                c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2
                M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </template>
              </a-button>
              <a-button
                type="primary"
                round
                class="button"
                @click="handleThumbsDown(item.id)"
              >
                <template #icon>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <g transform="rotate(180 12 12)">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017
                  c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095
                  c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2
                  M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </g>
                  </svg>
                </template>
              </a-button>
              <a-button type="primary" @click="start_audio(item)">
                <template #icon>
                  <icon-play-circle />
                </template>
                试听
              </a-button>
              <a-button @click="download(item.audio_url, item.title)">
                <template #icon>
                  <icon-download />
                </template>
                下载
              </a-button>
              <a-popconfirm
                content="确定删除吗？"
                type="warning"
                position="lt"
                @ok="deleteMusic(item.id)"
              >
                <a-button type="primary" status="danger">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-list-item>
        </a-list>
        <a-pagination
          :current="page"
          :page-size="limit"
          class="mr-4 ml-4 mt-2"
          background
          :total="count"
          @change="get_more"
        />
      </div>
      <div
        class="absolute bottom-0 w-full shadow-sm border border-t-blueGray"
        v-if="data.length > 0"
      >
        <Music
          ref="musicComponent"
          :key="componentKey"
          :list="data"
          class="w-full"
        />
      </div>
      <div class="music-content-list" v-else>
        <div class="flex-center h-full items-center mt-40">
          <a-result
            :status="null"
            title="暂无音乐库"
            subtitle="从左侧创作你的AI音乐吧~"
          >
            <template #icon>
              <img src="@/assets/images/no_music.png" alt="" class="w-80" />
            </template>
          </a-result>
        </div>
      </div>
    </div>
    <a-drawer
      :width="340"
      :visible="visible"
      :footer="false"
      @ok="visible = false"
      @cancel="visible = false"
      unmountOnClose
    >
      <template #title>
        {{ music_detail?.title }}
      </template>
      <div class="flex flex-col">
        <div>
          <Video
            theme="#fd4c5c"
            :title="music_detail.title"
            :poster="music_detail.image_url"
            :src="music_detail.video_url"
            :current-time="15"
          />
        </div>
        <h2 class="truncate font-16 mt-2 font-bold">
          歌曲名称：<a-tag color="arcoblue">{{ music_detail?.title }}</a-tag>
        </h2>
        <span>{{ music_detail?.created_at }}</span>

        <h2 class="font-16 mt-4 font-bold">歌词大意：</h2>
        <div
          class="mt-2"
          v-html="
            music_detail.prompt ? renderMarkdown(music_detail?.prompt) : ''
          "
        ></div>
      </div>
    </a-drawer>

    <a-drawer
      width="80%"
      placement="left"
      :header="false"
      class="draw_music_mobile overflow-hidden"
      :visible="openM"
      @ok="openM = false"
      @cancel="openM = false"
      unmountOnClose
    >
      <div class="h-full overflow-hidden">
        <a-tabs
          @change="changeMusic"
          type="capsule"
          size="large"
          class="overflow-auto h-full mt-2"
        >
          <a-tab-pane key="refuse" title="专业模式">
            <div>
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                    >
                      歌词内容
                    </h5>
                  </div>
                </div>
                <div class="mt-2 fade-box draw_des_clip">
                  <section
                    class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
                  >
                    <a-textarea
                      v-model="input2"
                      class="bg-white pb-10"
                      :auto-size="{ minRows: 7, maxRows: 7 }"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="请输入歌词内容"
                    />
                    <div
                      class="des_check z-10 z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        :unmount-on-close="false"
                      >
                        <div>
                          <icon-relation />
                          联想
                        </div>
                        <template #content>
                          <div
                            class="bg-white siwei_contact w-100 p-4 rounded-xl shadow-sm"
                          >
                            <h5>歌词联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出歌词想法内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="music_loading"
                              @click="send_ai_draw()"
                              >生成歌词联想
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                    </div>
                  </section>
                  <div class="w-full flex align-items-center">
                    <p class="flex-none text-gray-3 text-12">示范:</p>
                    <ul
                      class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                    >
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[0]"
                      >
                        月光下的协奏
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        大海的心碎
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  模型选择
                  <a-tooltip
                    content="mv模型，chirp-v3-0、chirp-v3-5。不写默认 chirp-v3-0"
                  >
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <a-row
                :gutter="10"
                class="flex justify-content-center mj_version"
              >
                <a-col
                  :span="12"
                  class="version-item"
                  @click="version = 1"
                  :class="version == 1 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title">
                        <span>chirp-v3-5</span>
                      </div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/music.jpg"
                    />
                  </button>
                </a-col>
                <a-col
                  :span="12"
                  class="version-item"
                  @click="version = 2"
                  :class="version == 2 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title">
                        <span>chirp-v3-0</span>
                      </div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/music-1.jpg"
                    />
                  </button>
                </a-col>
              </a-row>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">歌曲名称</span>
                <div class="flex-1">
                  <a-input
                    v-model="music_title"
                    :max-length="20"
                    show-word-limit
                    allow-clear
                    placeholder="请输入歌曲名称"
                  />
                </div>
                <a-tooltip content="参数释义：自定义歌曲标题">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">是否轻音乐</span>
                <div class="flex items-center">
                  <div class="flex-1">
                    <a-switch v-model="is_gray_music" />
                  </div>
                  <a-tooltip content="参数释义：纯音乐无歌词">
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center w-full justify-between relative">
                  <div
                    class="flex-center w-full justify-between items-center mb-3"
                  >
                    <h5
                      class="mb-0 left-panel-setting-block__title font-14 text-gray-2 flex justify-between"
                    >
                      歌曲标签
                      <a-tooltip content="筛选歌曲标签">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                    <div class="music-tag-me">
                      自定义
                      <a-switch v-model="music_tag_open" default-checked />
                    </div>
                  </div>
                </div>

                <div class="UXmDHLrm">
                  <a-textarea
                    v-model="music_tag"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 3, maxRows: 3 }"
                    type="textarea"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    v-if="music_tag_open"
                    placeholder="请输入歌曲标签"
                  />
                  <a-row :gutter="20" v-else>
                    <a-col
                      :span="8"
                      v-for="(i, i_index) in music_tag_list"
                      :key="i_index"
                    >
                      <span
                        class="w-full p-1 flex items-center justify-center cursor-pointer"
                        :class="music_tag == i.value ? 'OMJ2YPhL' : ''"
                        @click="change_i(i.value)"
                        >{{ i.name }}</span
                      >
                    </a-col>
                  </a-row>
                </div>
              </section>

              <!--<section-->
              <!--    class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">-->
              <!--    <div class="flex-center justify-between relative">-->
              <!--        <div class="flex-center"><h5 class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between">-->
              <!--            图片数量</h5></div>-->

              <!--    </div>-->
              <!--    <div class="UXmDHLrm">-->
              <!--        <span v-for="(i,i_index) in images_list" :key="i_index"-->
              <!--              :class="image_select==i.value?'OMJ2YPhL':''"-->
              <!--              @click="change_i(i.value)">{{ i.name }}</span>-->
              <!--    </div>-->
              <!--</section>-->
            </div>
          </a-tab-pane>
          <a-tab-pane key="think" title="灵感模式">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    歌曲意境
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
                >
                  <a-textarea
                    v-model="input_ling"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    type="textarea"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    placeholder="请输入歌曲的想法风格"
                  />
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input_ling = all_prompt_ling[0]"
                    >
                      哀伤
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input_ling = all_prompt_ling[1]"
                    >
                      爱情
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt_ling()"
                  />
                </div>
              </div>
            </section>
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                模型选择
                <a-tooltip
                  content="mv模型，chirp-v3-0、chirp-v3-5。不写默认 chirp-v3-0"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-row :gutter="10" class="flex justify-content-center mj_version">
              <a-col
                :span="12"
                class="version-item"
                @click="version = 1"
                :class="version == 1 ? 'active' : ''"
              >
                <button
                  class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                >
                  <div
                    class="absolute flex items-center justify-center w-full h-full"
                  >
                    <div class="model-card__title"><span>chirp-v3-5</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/music.jpg"
                  />
                </button>
              </a-col>
              <a-col
                :span="12"
                class="version-item"
                @click="version = 2"
                :class="version == 2 ? 'active' : ''"
              >
                <button
                  class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                >
                  <div
                    class="absolute flex items-center justify-center w-full h-full"
                  >
                    <div class="model-card__title"><span>chirp-v3-0</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/music-1.jpg"
                  />
                </button>
              </a-col>
            </a-row>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">是否轻音乐</span>
              <div class="flex items-center">
                <div class="flex-1">
                  <a-switch v-model="is_gray_music" />
                </div>
                <a-tooltip content="参数释义：纯音乐无歌词">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <template #footer>
        <div class="bg-white z-10 w-full bg-white-1">
          <div class="flex mb-2">
            <svg
              t="1690301472439"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6949"
              width="24"
              height="24"
            >
              <path
                d="M366 174h292a10 10 0 0 1 10 10v322a10 10 0 0 1-10 10H366a10 10 0 0 1-10-10V184a10 10 0 0 1 10-10z"
                fill="#4988FD"
                p-id="6950"
              ></path>
              <path
                d="M658 546H366c-22.056 0-40-17.944-40-40V184c0-22.056 17.944-40 40-40h292c22.056 0 40 17.944 40 40v322c0 22.056-17.944 40-40 40z m-272-60h252V204H386v282z"
                fill="#4988FD"
                p-id="6951"
              ></path>
              <path
                d="M507.582 304.244a4 4 0 0 1 7.188 0l86.972 178.018c0.586 1.2 1.734 2.03 201.152 28.936a4.002 4.002 0 0 1 2.216 6.87l-144.304 136.648a4.006 4.006 0 0 0-1.184 3.622l35.488 194.43a3.998 3.998 0 0 1-5.798 4.252l-176.244-93.506a4 4 0 0 0-3.75 0l-176.252 93.508a4 4 0 0 1-5.802-4.252l35.478-194.43a4.006 4.006 0 0 0-1.184-3.622l-144.304-136.648a4.002 4.002 0 0 1 2.216-6.868c199.416-26.912 200.564-27.736 201.152-28.938l86.96-178.02z"
                fill="#DFECFD"
                p-id="6952"
              ></path>
              <path
                d="M331.204 887.48a33.92 33.92 0 0 1-30.082-18.148 34.15 34.15 0 0 1-3.376-21.91l32.956-180.61-134.074-126.96c-13.616-12.902-14.196-34.464-1.302-48.074a34.1 34.1 0 0 1 20.136-10.308c104.136-14.054 161.49-21.976 184.632-25.53l80.534-164.864c5.66-11.588 17.654-19.078 30.552-19.078 5.146 0 10.31 1.196 14.936 3.458a34.138 34.138 0 0 1 15.618 15.634l80.54 164.848c23.146 3.554 80.498 11.476 184.634 25.528 18.572 2.502 31.652 19.656 29.15 38.234a34.138 34.138 0 0 1-10.318 20.146l-134.074 126.962 32.958 180.568a33.782 33.782 0 0 1-5.506 25.47 33.778 33.778 0 0 1-21.896 14.086c-7.242 1.318-15.208 0.138-21.874-3.368l-164.154-87.09-164.068 87.042a34.19 34.19 0 0 1-15.922 3.964z m-53.87-353.836l104.852 99.29a33.896 33.896 0 0 1 10.072 30.78l-25.848 141.656 128.848-68.36c9.79-5.19 22.078-5.184 31.85-0.01l128.854 68.364-25.852-141.64a33.904 33.904 0 0 1 10.052-30.778l104.868-99.302c-61.762-8.382-100.142-13.708-121.64-16.872-12.33-1.814-19.714-3.004-23.946-3.858-4.89-0.986-17.88-3.608-24.658-17.488l-63.608-130.192-63.6 130.196c-6.788 13.88-19.772 16.498-24.66 17.484-4.228 0.854-11.612 2.042-23.946 3.856-21.464 3.158-59.842 8.484-121.638 16.874z"
                fill="#DFECFD"
                p-id="6953"
              ></path>
              <path
                d="M418 651a29.9 29.9 0 0 1-21.212-8.788l-66-66c-11.716-11.714-11.716-30.71 0-42.426 11.714-11.714 30.71-11.714 42.426 0l66 66c11.716 11.714 11.716 30.71 0 42.426A29.908 29.908 0 0 1 418 651z"
                fill="#4988FD"
                p-id="6954"
              ></path>
            </svg>
            消耗{{ counter.setting.ai_music_cost
            }}{{ counter.setting.money_name_set }}/会员{{
              counter.setting.ai_music_limit
            }}次
          </div>
          <a-button
            :loading="draw_loading"
            @click="ai_music()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始创作
          </a-button>
        </div>
      </template>
    </a-drawer>

    <FeedbackModal
      :is-open="isFeedbackModalOpen"
      :feedback-type="feedbackType"
      :reportable-id="selectedReportableId"
      :model-key="modelKey"
      @close="closeFeedbackModal"
      @submit="handleFeedbackSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { Music } from "@usuuu/music";
import { Video } from "@usuuu/video";

import {
  IconExclamationCircle,
  IconImage,
  IconLanguage,
  IconRefresh,
  IconRelation,
  IconSkin,
} from "@arco-design/web-vue/es/icon";
import { useCounter } from "~/store/counter";
import { get_music_list, music_delete, music_describe } from "~/utils/api";
import { Message } from "@arco-design/web-vue";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItMatch from "markdown-it-math";
import mermaid from "mermaid";
import { useCookie } from "nuxt/app";
import FeedbackModal from "~/components/chat/FeedbackModal.vue";
import { submitMessageReport } from "~/api/api";

const renderMarkdown = (markdown: any) => {
  const md = markdownIt({
    linkify: true,
    highlight: (str, lang) => {
      if (lang === "mermaid") {
        return `<pre class="mermaid">${markdownIt().utils.escapeHtml(
          str
        )}</pre>`;
      }

      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${
            hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true,
            }).value
          }</code></pre>`;
        } catch (__) {}
      }

      return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${markdownIt().utils.escapeHtml(
        str
      )}</code></pre>`;
    },
    breaks: true,
  }).use(markdownItMatch, {
    inlineOpen: "$",
    inlineClose: "$",
    blockOpen: "$$$",
    blockClose: "$$$",
    renderingOptions: {},
  });

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const aIndex = tokens[idx].attrIndex("href");
    const url = tokens[idx].attrs[aIndex][1];
    // 检查链接是否以图像扩展名结尾
    if (/\.(png|jpg|jpeg|gif|svg)$/i.test(url)) {
      // 如果是图像链接，则跳过链接文本和链接关闭标签
      let nextIndex = idx + 1;
      while (
        nextIndex < tokens.length &&
        tokens[nextIndex].type !== "link_close"
      ) {
        if (tokens[nextIndex].type === "text") {
          // 跳过文本
          tokens[nextIndex].content = "";
        }
        nextIndex++;
      }
      // 返回图像标签
      return `<img src="${url}" alt=""/>`;
    }
    // 否则，使用默认渲染器
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
    const openToken = tokens[idx - 2];
    const aIndex = openToken.attrIndex("href");
    const url = openToken.attrs[aIndex][1];
    // 如果是图像链接，则不渲染链接关闭标签
    if (/\.(png|jpg|jpeg|gif|svg)$/i.test(url)) {
      return "";
    }
    // 否则，使用默认渲染器
    return self.renderToken(tokens, idx, options);
  };

  const renderedMarkdown = md.render(markdown);

  return renderedMarkdown;
};
const token = useCookie("token");
const draw_loading = ref(false);
const counter = useCounter();
const music_loading = ref(false);
const draw_ai = ref("");
const input2 = ref("");

const modelKey = ref("ai_ppt");
const isFeedbackModalOpen = ref(false);
const feedbackType = ref("");
const selectedReportableId = ref(null);
const userid2 = useCookie("user_info");
const userId = userid2.value?.id || null;
// // Handle Thumbs Up
// const handleThumbsUp = (id) => {
//   selectedMessageId.value = id;
//   feedbackType.value = "positive";
//   isFeedbackModalOpen.value = true;
// }
const handleThumbsUp = (id) => {
  // if (!item?.id) {
  //   console.error('No ID found for feedback item');
  //   return;
  // }
  selectedReportableId.value = id;
  feedbackType.value = "positive";
  isFeedbackModalOpen.value = true;
};
// Handle Thumbs Down
const handleThumbsDown = (id) => {
  selectedReportableId.value = id;
  feedbackType.value = "negative";
  isFeedbackModalOpen.value = true;
};
// Close Feedback Modal
const closeFeedbackModal = () => {
  isFeedbackModalOpen.value = false;
  selectedReportableId.value = null;
  feedbackType.value = "";
};

const handleFeedbackSubmit = async (data) => {
  try {
    const reportData = {
      reportable_id: selectedReportableId.value,
      reportable_type: "pptGeneration",
      ai_function: "ppt_generate",
      user_id: userId || null,
      report_type: data.type,
      issue_category: data.issueType || null,
      reason: data.text || "No reason provided",
    };
    console.log(
      "Submitting feedback with payload:",
      JSON.stringify(reportData, null, 2)
    );
    const response = await submitMessageReport(reportData);
    if (response.success) {
      alert("Feedback submitted successfully");
      console.log("Feedback response:", response);
      // emit('feedback', reportData);
    } else {
      throw new Error(response.error || "Failed to submit feedback");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Failed to submit feedback: " + error.message);
  }
  closeFeedbackModal();
};
const all_prompt = ref([
  "[Verse]\n" +
    "夜晚降临 月光洒下\n" +
    "照亮街道 照亮心房\n" +
    "\n" +
    "[Verse 2]\n" +
    "树影摇曳 微风轻抚\n" +
    "耳边细语 梦里人\n" +
    "\n" +
    "[Chorus]\n" +
    "啊 月光 你在守护\n" +
    "每一个孤独的心灵\n" +
    "\n" +
    "[Bridge]\n" +
    "街灯闪烁 星光飞舞\n" +
    "光和影 跳跃在心间\n" +
    "\n" +
    "[Verse 3]\n" +
    "寂静的夜 守候的你\n" +
    "带来温暖 带来安宁\n" +
    "\n" +
    "[Chorus]\n" +
    "啊 月光 你在守护\n" +
    "每一个孤独的心灵",
  "[Verse]\n" +
    "海风轻轻吹\n" +
    "沙滩在微笑\n" +
    "浪花扑向岸\n" +
    "心停在这里\n" +
    "\n" +
    "[Verse 2]\n" +
    "阳光洒满天\n" +
    "海水映蓝天\n" +
    "脚印留在沙\n" +
    "幸福就在眼前\n" +
    "\n" +
    "[Chorus]\n" +
    "海边海边\n" +
    "心与心相连\n" +
    "海边海边\n" +
    "我们手牵手走远\n" +
    "\n" +
    "[Bridge]\n" +
    "星空照亮夜\n" +
    "微风轻轻吹\n" +
    "我们笑着说\n" +
    "爱没尽头\n" +
    "\n" +
    "[Verse 3]\n" +
    "暖阳斜西下\n" +
    "月光也亮起\n" +
    "海浪轻轻拍\n" +
    "爱停在这里\n" +
    "\n" +
    "[Chorus]\n" +
    "海边海边\n" +
    "心与心相连\n" +
    "海边海边\n" +
    "我们手牵手走远",
]);
const all_prompt_ling = ref([
  "一首关于大海哀伤的苦情调",
  "一首关于月光下的爱情故事",
]);
const change_prompt = () => {
  input2.value =
    all_prompt.value[Math.floor(Math.random() * all_prompt.value.length)];
};
const change_prompt_ling = () => {
  input_ling.value =
    all_prompt_ling.value[
      Math.floor(Math.random() * all_prompt_ling.value.length)
    ];
};
const send_ai_draw = () => {
  if (!token.value) {
    Message.error("请先登录");
    return;
  }
  music_loading.value = true;
  music_describe({
    prompt: draw_ai.value,
  })
    .then((res: any) => {
      music_loading.value = false;
      input2.value = res._rawValue.data;
    })
    .catch((e: any) => {
      music_loading.value = false;
    });
};

const version = ref(1);
const data = ref([]) as any;
const componentKey = ref(0);

const start_audio = (item: any) => {
  data.value.splice(0, data.value.length);
  data.value.push({
    song: item.title,
    artist: "歌曲" + item.title,
    url: item.audio_url,
    cover: item.image_url,
  });
  componentKey.value += 1;
};

const {
  public: { baseUrl },
} = useRuntimeConfig();
const download = async (urls: any, title: any) => {
  console.log(urls);
  try {
    const response = await fetch(
      `${window.APP_CONFIG.baseUrl}proxy_file?url=${urls}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = title + ".mp3";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载文件失败:", error);
  }
};
const music_tag = ref("Rock");
const music_tag_list = ref([
  {
    name: "摇滚",
    value: "Rock",
  },
  {
    name: "民谣",
    value: "Folk songs",
  },
  {
    name: "电子",
    value: "Electronics",
  },
  {
    name: "纯音乐",
    value: "Pure music",
  },
  {
    name: "欧美风",
    value: "European and American style",
  },
  {
    name: "日系",
    value: "Japanese system",
  },
  {
    name: "港台",
    value: "Hong Kong and Taiwan",
  },
  {
    name: "大陆",
    value: "Mainland China",
  },
  {
    name: "流行",
    value: "Popular",
  },
  {
    name: "古风",
    value: "Ancient style",
  },
  {
    name: "轻音乐",
    value: "Light music",
  },
  {
    name: "爵士",
    value: "Jazz",
  },
]);

const page = ref(1);
const limit = ref(8);
const count = ref(0);
const music_list = ref([]);

const get_more = (e: any) => {
  page.value = e;
  get_all_music();
};

const change_i = (i: any) => {
  music_tag.value = i;
};
const is_gray_music = ref(false);

const music_tag_open = ref(false);
const music_title = ref("");
const input_ling = ref("");
const timer = ref(null) as any;
const ai_music = () => {
  if (!token.value) {
    Message.error("请先登录");
    return;
  }

  if (types.value == "refuse") {
    if (!input2.value) {
      Message.error("请输入歌词内容");
      return;
    }
    if (!music_title.value) {
      Message.error("请输入歌曲名称");
      return;
    }
  } else {
    if (!input_ling.value) {
      Message.error("请输入歌曲意境");
      return;
    }
  }
  clearInterval(timer.value);
  draw_loading.value = true;
  music_create({
    prompt: input2.value,
    mv: version.value == 1 ? "chirp-v3-5" : "chirp-v3-0",
    tags: music_tag.value,
    title: music_title.value,
    make_instrumental: is_gray_music.value,
    gpt_description_prompt: input_ling.value,
    types: types.value,
  })
    .then((res: any) => {
      draw_loading.value = false;
      Message.success("提交任务成功");
      get_all_music();
      timer.value = setInterval(() => {
        get_all_music();
      }, 6000);
    })
    .catch((e: any) => {
      draw_loading.value = false;
    });
};

const check_progress = () => {
  clearInterval(timer.value);

  let flag = false;
  music_list.value.forEach((item: any) => {
    if (item.progress != 100 && item.status != "failed") {
      flag = true;
      // 退出循环
      return;
    }
  });
  if (!flag) {
    clearInterval(timer.value);
  } else {
    // 启动定时器
    timer.value = setInterval(() => {
      get_all_music();
    }, 6000);
  }
};

const refresh_loading = ref(false);

const get_all_music = () => {
  refresh_loading.value = true;
  clearInterval(timer.value);
  get_music_list({
    page: page.value,
    limit: limit.value,
  })
    .then((res: any) => {
      music_list.value = res._rawValue.data;
      count.value = res._rawValue.count;
      refresh_loading.value = false;
      check_progress();
    })
    .catch((e: any) => {
      refresh_loading.value = false;
      console.log(e);
    });
};
if (token.value) {
  get_all_music();
}
const types = ref("refuse");
const changeMusic = (e: any) => {
  types.value = e;
};

const deleteMusic = (ids: any) => {
  music_delete({
    id: ids,
  })
    .then((res: any) => {
      Message.success("删除成功");
      get_all_music();
    })
    .catch((e: any) => {
      console.log(e);
    });
};

const music_detail = ref({}) as any;
const visible = ref(false);
const checkDetail = (id: any) => {
  visible.value = true;
  music_detail.value = music_list.value.find((item: any) => item.id == id);
};

const openM = ref(false);
</script>

<style scoped></style>
