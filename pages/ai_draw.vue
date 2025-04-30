<template>
  <div class="draw-mains flex w-full">
    <client-only>
      <div
        style="width: 340px"
        class="flex h-full flex-col border-r-blue-200 draw-list-left relative"
      >
        <a-tabs
          @tab-click="handleClick"
          v-model="activeDraw"
          type="capsule"
          size="large"
          class="justify-content-center mt-2"
        >
          <a-tab-pane
            title="普通绘画"
            key="gpt"
            v-if="counter.setting.is_open_normal_draw == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                    >
                      绘画描述
                      <a-tooltip content="翻译为英文">
                        <a-button
                          size="small"
                          @click="translate()"
                          :loading="draw_loading"
                          type="primary"
                          status="success"
                          shape="round"
                        >
                          <template #icon>
                            <icon-language />
                          </template>
                        </a-button>
                      </a-tooltip>
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
                      type="textarea"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        花海女孩
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        办公室男人
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>

              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片尺寸<a-tooltip content="图片固定高度和宽度生成">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="flex items-center justify-between space-x-1 aspect">
                  <button
                    v-for="(s, s_index) in all_size"
                    :class="size == s.value ? 'active' : ''"
                    @click="change_size(s.value)"
                    class="flex-1 border-2 rounded aspect-item dark:border-neutral-700"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${s.width}%;height:${s.height}%`"
                      ></div>
                    </div>
                    <p class="mb-1 text-sm text-center">
                      {{ s.label }}
                    </p>
                  </button>
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
          <a-tab-pane
            title="专业绘画"
            key="midj"
            v-if="counter.setting.midjourney_is_open == 1"
          >
            <div class="w-full flex justify-center">
              <a-radio-group
                class="mb-2"
                type="button"
                v-model="midj_check_radio"
              >
                <a-radio value="basic_do">基本操作</a-radio>
                <a-radio value="text_to_img">图生文</a-radio>
              </a-radio-group>
            </div>

            <section
              class="draw_infomation pb-32"
              v-if="midj_check_radio == 'basic_do'"
            >
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                    >
                      绘画描述
                      <a-tooltip content="翻译为英文">
                        <a-button
                          size="small"
                          @click="translate()"
                          :loading="draw_loading"
                          type="primary"
                          status="success"
                          shape="round"
                        >
                          <template #icon>
                            <icon-language />
                          </template>
                        </a-button>
                      </a-tooltip>
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
                      type="textarea"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                    />
                    <div
                      class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        position="bottom"
                        auto-fit-position
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        花海女孩
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        办公室男人
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>
              <a-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :headers="{ Authorization: 'Bearer ' + token }"
                @before-upload="beforeUpload"
                @success="picSuccess"
                draggable
              >
                <template #upload-button>
                  <div>
                    <div
                      class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                      v-if="imageUrl"
                    >
                      <div
                        class="edui-left-panel__reference-img-container mt-0 rounded-10"
                      >
                        <span class="left-panel-setting-block__title"
                          >参考图</span
                        >
                        <div class="upload-file">
                          <div
                            class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                            style="width: 56px; height: 56px"
                          >
                            <img class="w-auto rounded-10" :src="imageUrl" />
                          </div>
                        </div>
                      </div>

                      <div class="arco-upload-list-picture-mask rounded-10">
                        <IconPlus />
                      </div>
                    </div>
                    <div
                      v-else
                      class="edui-left-panel__reference-img-container rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <svg
                            role="img"
                            aria-label="cloud-upload"
                            focusable="false"
                            data-icon="cloud-upload"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-cloud-upload"
                          >
                            <path
                              d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <a-button
                type="primary"
                status="danger"
                @click="deletePic"
                class="w-100"
                shape="round"
                v-if="imageUrl"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除图片
              </a-button>

              <!--model select-->
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  模型选择
                  <a-tooltip
                    content="MJ：通用模型
                        NIJI：动漫风格模型"
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
                      <div class="model-card__title"><span>MJ</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/mj.jpg"
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
                      <div class="model-card__title"><span>NIJI</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/niji.jpg"
                    />
                  </button>
                </a-col>
              </a-row>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">版本</span>
                <div class="flex-1" v-if="version == 1">
                  <a-select v-model="version_me" placeholder="选择版本">
                    <a-option
                      v-for="item of mj_version"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select>
                </div>
                <div class="flex-1" v-else>
                  <a-select v-model="version_nj" placeholder="选择版本">
                    <a-option
                      v-for="item of nj_version"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select>
                </div>
              </div>
              <div
                class="flex items-center justify-between space-x-2 mt-2"
                v-if="version == 1"
              >
                <span class="w-[70px]">RAW</span>
                <div class="flex-1">
                  <a-switch v-model="mj_row" />
                </div>
                <a-tooltip
                  content="呈现的人物写实感更加逼真,人物细节、光源、流畅度也更加接近原始作品"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
              <div class="mt-2" v-if="version == 2">
                <div class="left-panel-setting-block__header">
                  <div class="left-panel-setting-block__title mt-2 fs-5">
                    风格选择
                    <a-tooltip
                      content="根据你想生成的图片选择对应的风格，效果更佳哦"
                    >
                      <icon-exclamation-circle class="font-18 ml-1" />
                    </a-tooltip>
                  </div>
                </div>
                <a-row :gutter="10" class="mj_version style_choose">
                  <a-col
                    :span="12"
                    class="version-item mb-2"
                    @click="niji_style = 1"
                    :class="niji_style == 1 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title"><span>动漫</span></div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/normal_niji.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="niji_style = 2"
                    :class="niji_style == 2 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title"><span>可爱</span></div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/cute_niji.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="niji_style = 3"
                    :class="niji_style == 3 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title"><span>丰富</span></div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/dr_niji.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="niji_style = 4"
                    :class="niji_style == 4 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title"><span>风景</span></div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/scene_niji.png"
                      />
                    </button>
                  </a-col>
                </a-row>
              </div>

              <!--model select end-->
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  图片比例
                  <a-tooltip content="参数释义：生成图片尺寸比例">
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <a-dropdown :popup-max-height="false" class="bili_main">
                <section
                  class="w-full p-1 flex-center justify-between bg-white-1 rounded-8 cursor-pointer border hover:border-primary-base transition-border border-transparent"
                >
                  <div class="flex-center space-x-20">
                    <div class="flex-center bg-gray-6 w-20 rounded-6 pr-6">
                      <div
                        class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                      >
                        <div
                          class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                          :style="`width:${
                            bili[choose_bili - 1].width
                          }%;height:${bili[choose_bili - 1].height}%`"
                        ></div>
                      </div>
                      <span class="text-gray-2 text-12 font-600">{{
                        bili[choose_bili - 1].name
                      }}</span>
                    </div>
                    <span class="text-gray-2 text-14 font-600">{{
                      bili[choose_bili - 1].title
                    }}</span>
                  </div>
                </section>
                <template #content>
                  <a-doption
                    v-for="(b, b_index) in bili"
                    @click="choose_bili = b.value"
                  >
                    <div class="w-100 flex justify-content-between p-1">
                      <div
                        class="flex-center rounded-6 w-20 bg-gray-6 mr-6 pl-2"
                      >
                        <div
                          class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                        >
                          <div
                            class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                            :style="`width:${b.width}%;height:${b.height}%`"
                          ></div>
                        </div>
                        <span
                          class="text-14 ml-1 mr-3 text-gray-2 font-600 large:text-12 large:mr-0"
                          >{{ b.name }}</span
                        >
                      </div>
                      <span class="text-gray-2 text-14 font-600 left-83">{{
                        b.title
                      }}</span>
                    </div>
                  </a-doption>
                </template>
              </a-dropdown>

              <!--model can -->
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  参数
                </div>
              </div>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">画质</span>
                <div class="flex-1">
                  <a-select v-model="pic_select" placeholder="画质选择">
                    <a-option
                      v-for="item of pic_quality"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select>
                </div>
                <a-tooltip
                  content="参数释义：更高质量需要更长的时间处理更多细节"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">混乱</span>
                <div class="flex-1">
                  <a-input-number v-model="chaos" :min="0" :max="100" />
                </div>
                <a-tooltip
                  content="参数释义：较高值将产生意想不到的结果和成分 较低值具有更可靠、可重复的结果"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>

              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">种子</span>
                <div class="flex-1">
                  <a-input-number v-model="seed" :min="0" :max="100" />
                </div>
                <a-tooltip content="参数释义：指定的种子数对图片定位有意义">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
              <div
                v-if="version == 1 && (version_me == 6.0 || version_me == 6.1)"
              >
                <div class="left-panel-setting-block__header">
                  <div class="left-panel-setting-block__title fs-5">
                    角色一致性
                    <a-tooltip
                      content="参数释义：--cref请上传1张具有人脸的图片,图片大小上限为20M"
                    >
                      <icon-exclamation-circle class="font-18 ml-1" />
                    </a-tooltip>
                  </div>
                </div>

                <a-upload
                  class="avatar-uploader"
                  :action="actions"
                  :show-file-list="false"
                  :headers="{ Authorization: 'Bearer ' + token }"
                  @before-upload="beforeUpload"
                  @success="picSuccessCref"
                  draggable
                >
                  <template #upload-button>
                    <div>
                      <div
                        class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                        v-if="cref_image"
                      >
                        <div
                          class="edui-left-panel__reference-img-container mt-0 rounded-10"
                        >
                          <span class="left-panel-setting-block__title"
                            >参考图</span
                          >
                          <div class="upload-file">
                            <div
                              class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                              style="width: 56px; height: 56px"
                            >
                              <img
                                class="w-auto rounded-10"
                                :src="cref_image"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="arco-upload-list-picture-mask rounded-10">
                          <IconPlus />
                        </div>
                      </div>
                      <div
                        v-else
                        class="edui-left-panel__reference-img-container rounded-10"
                      >
                        <span class="left-panel-setting-block__title"
                          >参考图</span
                        >
                        <div class="upload-file">
                          <div
                            class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                            style="width: 56px; height: 56px"
                          >
                            <svg
                              role="img"
                              aria-label="cloud-upload"
                              focusable="false"
                              data-icon="cloud-upload"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              class="gd_design_icon gd_design_icon-cloud-upload"
                            >
                              <path
                                d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-upload>
                <a-button
                  type="primary"
                  status="danger"
                  @click="deletePicCref"
                  class="w-100"
                  shape="round"
                  v-if="cref_image"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除图片
                </a-button>
                <div class="flex items-center justify-between space-x-2 mt-2">
                  <span class="w-[70px]">角色强度</span>
                  <div class="flex-1">
                    <a-slider v-model="cw" :min="0" :max="100" />
                  </div>
                  <a-tooltip
                    content="参数释义：强度为0时会专注面部一致，强度为100时会同时参考面部、头发和衣服。"
                  >
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>

              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title fs-5">
                  风格化
                  <a-tooltip
                    content="参数释义：数值越高，画面表现也会更具丰富性和艺术性"
                  >
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <div class="filters-container">
                <div class="filters-wrapper filter-tabst">
                  <ul class="filter-tabs">
                    <li>
                      <button class="filter-button" @click="change_s(50, 0)">
                        低
                      </button>
                    </li>
                    <li>
                      <button class="filter-button" @click="change_s(100, 100)">
                        中
                      </button>
                    </li>
                    <li>
                      <button class="filter-button" @click="change_s(250, 200)">
                        高
                      </button>
                    </li>
                    <li>
                      <button class="filter-button" @click="change_s(750, 300)">
                        强烈
                      </button>
                    </li>
                  </ul>
                  <div class="filter-slider" aria-hidden="true">
                    <div
                      class="filter-slider-rect"
                      :style="{ transform: 'translateX(' + xPos + '%)' }"
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
              </div>
              <!--<a-input-number class="mt-2" v-model="style" :min="0" :max="750"/>-->
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  设定信息
                </div>
              </div>

              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">携带参数</span>
                <div class="flex-1">
                  <a-switch v-model="is_pic" />
                </div>
              </div>
            </section>
            <section class="draw_infomation pb-32" v-else>
              <a-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :headers="{ Authorization: 'Bearer ' + token }"
                @before-upload="beforeUpload"
                @success="TextSuccess"
                draggable
              >
                <template #upload-button>
                  <div>
                    <div
                      class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                      v-if="text_imageUrl"
                    >
                      <div
                        class="edui-left-panel__reference-img-container mt-0 rounded-10"
                      >
                        <span class="left-panel-setting-block__title"
                          >参考图</span
                        >
                        <div class="upload-file">
                          <div
                            class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                            style="width: 56px; height: 56px"
                          >
                            <img
                              class="w-auto rounded-10"
                              :src="text_imageUrl"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="arco-upload-list-picture-mask rounded-10">
                        <IconPlus />
                      </div>
                    </div>
                    <div
                      v-else
                      class="edui-left-panel__reference-img-container rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <svg
                            role="img"
                            aria-label="cloud-upload"
                            focusable="false"
                            data-icon="cloud-upload"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-cloud-upload"
                          >
                            <path
                              d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <a-button
                type="primary"
                status="danger"
                @click="text_imageUrl = ''"
                class="w-100"
                shape="round"
                v-if="imageUrl"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除图片
              </a-button>
              <a-button
                type="primary"
                size="large"
                class="w-full my-3 rounded"
                @click="midj_ai_describe()"
              >
                <template #icon>
                  <icon-command />
                </template>
                生成图生文
              </a-button>
            </section>
          </a-tab-pane>
          <a-tab-pane
            title="Flux绘画"
            key="flux"
            v-if="counter.setting.is_open_flux_draw == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                    >
                      绘画描述
                      <a-tooltip content="翻译为英文">
                        <a-button
                          size="small"
                          @click="translate()"
                          :loading="draw_loading"
                          type="primary"
                          status="success"
                          shape="round"
                        >
                          <template #icon>
                            <icon-language />
                          </template>
                        </a-button>
                      </a-tooltip>
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
                      type="textarea"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        草丛里的猫
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        金色背景
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>

              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片尺寸<a-tooltip content="图片固定高度和宽度生成">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div
                  class="flex items-center flex-wrap justify-between space-x-1 aspect"
                >
                  <button
                    v-for="(s, s_index) in flux_all_size"
                    :class="flux_size == s.value ? 'active' : ''"
                    @click="change_flux_size(s.value)"
                    class="flex-1 border-2 mt-2 rounded aspect-item dark:border-neutral-700"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${s.width}%;height:${s.height}%`"
                      ></div>
                    </div>
                    <p class="mb-1 text-sm text-center">
                      {{ s.label }}
                    </p>
                  </button>
                </div>
              </section>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片参数
                      <a-tooltip
                        content="降噪步骤数，越高质量越高、引导强度，越小越接近提示词的内容"
                      >
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="slider-demo-block flex-wrap">
                  <span class="demonstration">降噪步骤数：</span>

                  <a-slider
                    class="ml-1.5 mr-1.5"
                    :min="1"
                    :max="100"
                    v-model="flux_num_inference_steps"
                    :step="1"
                    show-ticks
                  />
                </div>
              </section>
            </div>
          </a-tab-pane>
          <a-tab-pane
            title="百度绘画"
            key="baidu"
            v-if="counter.setting.is_draw_baidu_open == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                    >
                      绘画描述
                      <a-tooltip content="百度绘画仅支持中文关键词">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="mt-2 fade-box draw_des_clip">
                  <section
                    class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                  >
                    <a-textarea
                      v-model="input2"
                      class="bg-white pb-10"
                      :auto-size="{ minRows: 7, maxRows: 7 }"
                      type="textarea"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                    />
                    <div
                      class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        position="bottom"
                        auto-fit-position
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        花海女孩
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        办公室男人
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片尺寸
                      <a-tooltip content="图片固定高度和宽度生成">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between space-x-1 flex-wrap aspect"
                >
                  <button
                    v-for="(s, s_index) in baidu_all_size"
                    :class="baidu_size == s.value ? 'active' : ''"
                    @click="change_baidu_size(s.value)"
                    class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${s.width}%;height:${s.height}%`"
                      ></div>
                    </div>
                    <p class="mb-1 text-sm text-center">
                      {{ s.label }}
                    </p>
                  </button>
                </div>
              </section>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片数量
                    </h5>
                  </div>
                </div>
                <div class="UXmDHLrm">
                  <span
                    v-for="(i, i_index) in images_list"
                    :key="i_index"
                    :class="image_select == i.value ? 'OMJ2YPhL' : ''"
                    @click="change_i(i.value)"
                    >{{ i.name }}</span
                  >
                </div>
              </section>
              <a-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :headers="{ Authorization: 'Bearer ' + token }"
                @before-upload="beforeUpload"
                @success="BaiduSuccess"
                draggable
              >
                <template #upload-button>
                  <div>
                    <div
                      class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                      v-if="baidu_imageUrl"
                    >
                      <div
                        class="edui-left-panel__reference-img-container mt-0 rounded-10"
                      >
                        <span class="left-panel-setting-block__title"
                          >参考图</span
                        >
                        <div class="upload-file">
                          <div
                            class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                            style="width: 56px; height: 56px"
                          >
                            <img
                              class="w-auto rounded-10"
                              :src="baidu_imageUrl"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="arco-upload-list-picture-mask rounded-10">
                        <IconPlus />
                      </div>
                    </div>
                    <div
                      v-else
                      class="edui-left-panel__reference-img-container rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <svg
                            role="img"
                            aria-label="cloud-upload"
                            focusable="false"
                            data-icon="cloud-upload"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-cloud-upload"
                          >
                            <path
                              d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <a-button
                type="primary"
                status="danger"
                @click="baidu_imageUrl = ''"
                class="w-100"
                shape="round"
                v-if="imageUrl"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除图片
              </a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane
            title="意间绘画"
            key="yijian"
            v-if="counter.setting.is_draw_yijian_open == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                    >
                      绘画描述
                      <a-tooltip content="意间绘画仅支持中文关键词">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="mt-2 fade-box draw_des_clip">
                  <section
                    class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                  >
                    <a-textarea
                      v-model="input2"
                      class="bg-white pb-10"
                      :auto-size="{ minRows: 7, maxRows: 7 }"
                      type="textarea"
                      :max-length="2000"
                      show-word-limit
                      allow-clear
                      placeholder="关键词的分割用英文逗号，不要用+ & 等号。，参考形式：画面主体，细节描述，修饰词"
                    />
                    <div
                      class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        position="bottom"
                        auto-fit-position
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
                    </div>
                  </section>
                  <div class="w-full flex align-items-center">
                    <p class="flex-none text-gray-3 text-12">示范:</p>
                    <ul
                      class="flex align-items-center overflow-auto flex-grow whitespace-nowrap scrollbar-none"
                    >
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        v-for="(yj, yj_index) in systemPrompts"
                        :key="yj_index"
                        @click="input2 = yj.value"
                      >
                        {{ yj.text }}
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
                  图片比例
                  <a-tooltip content="参数释义：生成图片尺寸比例">
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <a-dropdown :popup-max-height="false" class="bili_main">
                <section
                  class="w-full p-1 flex-center justify-between bg-white-1 rounded-8 cursor-pointer border hover:border-primary-base transition-border border-transparent"
                >
                  <div class="flex-center space-x-20">
                    <div class="flex-center bg-gray-6 w-20 rounded-6 pr-6">
                      <div
                        class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                      >
                        <div
                          class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                          :style="`width:${imageSizes[yijian_bili]?.width}%;height:${imageSizes[yijian_bili]?.height}%`"
                        ></div>
                      </div>
                      <span class="text-gray-2 text-12 font-600">{{
                        imageSizes[yijian_bili]?.text
                      }}</span>
                    </div>
                    <span class="text-gray-2 text-14 font-600">{{
                      imageSizes[yijian_bili]?.title
                    }}</span>
                  </div>
                </section>
                <template #content>
                  <a-doption
                    v-for="(b, b_index) in imageSizes"
                    @click="yijian_bili = b.value"
                  >
                    <div class="w-100 flex justify-content-between p-1">
                      <div
                        class="flex-center rounded-6 w-20 bg-gray-6 mr-6 pl-2"
                      >
                        <div
                          class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                        >
                          <div
                            class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                            :style="`width:${b.width}%;height:${b.height}%`"
                          ></div>
                        </div>
                        <span
                          class="text-14 ml-1 mr-3 text-gray-2 font-600 large:text-12 large:mr-0"
                          >{{ b.text }}</span
                        >
                      </div>
                      <span class="text-gray-2 text-14 font-600 left-83">{{
                        b.title
                      }}</span>
                    </div>
                  </a-doption>
                </template>
              </a-dropdown>
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  模型选择
                  <a-tooltip content="多种模型分类">
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <a-tabs type="capsule">
                <a-tab-pane title="通用模型" key="normal_model">
                  <a-row
                    :gutter="10"
                    class="flex justify-content-center mj_version"
                  >
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="yijian_choose(s1.id, 'one')"
                      :class="yijian_id == s1.id ? 'active' : ''"
                      v-for="(s1, s1_index) in styleDetails[0]"
                      :key="s1_index"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>{{ s1.text }}</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          :src="s1.poster"
                        />
                      </button>
                    </a-col>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane title="动漫模型" key="animate_model">
                  <a-row
                    :gutter="10"
                    class="flex justify-content-center mj_version"
                  >
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="yijian_choose(s2.id, 'two')"
                      :class="yijian_id == s2.id ? 'active' : ''"
                      v-for="(s2, s2_index) in styleDetails[1]"
                      :key="s2_index"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>{{ s2.text }}</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          :src="s2.poster"
                        />
                      </button>
                    </a-col>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane title="现实设计" key="life_model">
                  <a-row
                    :gutter="10"
                    class="flex justify-content-center mj_version"
                  >
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="yijian_choose(s3.id, 'three')"
                      :class="yijian_id == s3.id ? 'active' : ''"
                      v-for="(s3, s3_index) in styleDetails[2]"
                      :key="s3_index"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>{{ s3.text }}</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          :src="s3.poster"
                        />
                      </button>
                    </a-col>
                  </a-row>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-tab-pane>
          <a-tab-pane
            title="通义万象"
            key="ali"
            v-if="counter.setting.is_draw_ali == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                    >
                      绘画描述
                      <a-tooltip content="通义万象绘画支持中英文">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="mt-2 fade-box draw_des_clip">
                  <section
                    class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                  >
                    <a-textarea
                      v-model="input2"
                      class="bg-white pb-10"
                      :auto-size="{ minRows: 7, maxRows: 7 }"
                      type="textarea"
                      :max-length="75"
                      show-word-limit
                      allow-clear
                      placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                    />
                    <div
                      class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        position="bottom"
                        auto-fit-position
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        花海女孩
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        办公室男人
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片尺寸
                      <a-tooltip content="图片固定高度和宽度生成">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between space-x-1 flex-wrap aspect"
                >
                  <button
                    v-for="(s, s_index) in ali_all_size"
                    :class="ali_size == s.value ? 'active' : ''"
                    @click="change_ali_size(s.value)"
                    class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${s.width}%;height:${s.height}%`"
                      ></div>
                    </div>
                    <p class="mb-1 text-sm text-center">
                      {{ s.label }}
                    </p>
                  </button>
                </div>
              </section>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片数量
                    </h5>
                  </div>
                </div>
                <div class="UXmDHLrm">
                  <span
                    v-for="(i, i_index) in ali_images_list"
                    :key="i_index"
                    :class="ali_select == i.value ? 'OMJ2YPhL' : ''"
                    @click="change_i_ali(i.value)"
                    >{{ i.name }}</span
                  >
                </div>
              </section>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">风格</span>
                <div class="flex-1">
                  <a-select
                    v-model="ali_style"
                    class="w-100"
                    @change="ali_style_change"
                  >
                    <a-option
                      v-for="(s, s_index) in ali_style_config"
                      :key="s_index"
                      :value="s.value"
                    >
                      {{ s.label }}
                    </a-option>
                  </a-select>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane
            title="混元绘画"
            key="tencent"
            v-if="counter.setting.tencent_draw_open == 1"
          >
            <div class="pb-32">
              <section
                class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7"
              >
                <div class="relative">
                  <div>
                    <h5
                      class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                    >
                      绘画描述
                      <a-tooltip content="腾讯混元绘画支持中英文">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div class="mt-2 fade-box draw_des_clip">
                  <section
                    class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                  >
                    <a-textarea
                      v-model="input2"
                      class="bg-white pb-10"
                      :auto-size="{ minRows: 7, maxRows: 7 }"
                      type="textarea"
                      :max-length="75"
                      show-word-limit
                      allow-clear
                      placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                    />
                    <div
                      class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                    >
                      <a-trigger
                        :popup-translate="[100, 0]"
                        trigger="click"
                        position="bottom"
                        auto-fit-position
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
                            <h5>绘画联想</h5>
                            <a-textarea
                              v-model="draw_ai"
                              :auto-size="{ minRows: 3, maxRows: 5 }"
                              type="textarea"
                              allow-clear
                              placeholder="请输入简单的描述，AI将智能输出绘图内容"
                            />
                            <a-button
                              type="primary"
                              class="w-100 mt-2 mb-2"
                              :loading="draw_loading"
                              @click="send_ai_draw()"
                              >生成绘图描述
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <div class="cursor-pointer ml-1.5" @click="des_send()">
                        <icon-skin />
                        描述咒语
                      </div>
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
                        花海女孩
                      </li>
                      <li
                        class="cursor-pointer text-gray-2 text-12 ml-1"
                        @click="input2 = all_prompt[1]"
                      >
                        办公室男人
                      </li>
                    </ul>
                    <icon-refresh
                      class="cursor-pointer"
                      @click="change_prompt()"
                    />
                  </div>
                </div>
              </section>
              <section class="flex flex-col rounded-10 mt-1">
                <div class="mt-2">
                  <div class="left-panel-setting-block__header">
                    <div class="left-panel-setting-block__title mt-2 fs-5">
                      风格选择
                      <a-tooltip
                        content="根据你想生成的图片选择对应的风格，效果更佳哦"
                      >
                        <icon-exclamation-circle class="font-18 ml-1" />
                      </a-tooltip>
                    </div>
                  </div>
                  <a-row :gutter="10" class="mj_version style_choose">
                    <a-col
                      :span="12"
                      class="version-item mb-2"
                      @click="tencent_style_set(1)"
                      :class="tencent_style == 1 ? 'active' : ''"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>不限定</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          src="@/assets/images/tencent-style-1.png"
                        />
                      </button>
                    </a-col>
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="tencent_style_set(2)"
                      :class="tencent_style == 2 ? 'active' : ''"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>艺术绘画</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          src="@/assets/images/tencent-style-2.png"
                        />
                      </button>
                    </a-col>
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="tencent_style_set(3)"
                      :class="tencent_style == 3 ? 'active' : ''"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>游戏动漫</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          src="@/assets/images/tencent-style-3.png"
                        />
                      </button>
                    </a-col>
                    <a-col
                      :span="12"
                      class="version-item"
                      @click="tencent_style_set(4)"
                      :class="tencent_style == 4 ? 'active' : ''"
                    >
                      <button
                        class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                      >
                        <div
                          class="absolute flex items-center justify-center w-full h-full"
                        >
                          <div class="model-card__title">
                            <span>专业写实</span>
                          </div>
                        </div>
                        <img
                          class="object-cover w-full h-full rounded-xl"
                          src="@/assets/images/tencent-style-4.png"
                        />
                      </button>
                    </a-col>
                  </a-row>
                </div>
              </section>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">风格</span>
                <div class="flex-1">
                  <a-select
                    v-model="tencent_style_choose"
                    class="w-100"
                    @change="tencent_style_choose_change"
                  >
                    <a-option
                      v-for="(s, s_index) in tencent_categories[
                        tencent_style - 1
                      ].styles"
                      :key="s_index"
                      :value="s.code"
                    >
                      {{ s.name }}
                    </a-option>
                  </a-select>
                </div>
              </div>
              <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
                <div class="flex-center justify-between relative">
                  <div class="flex-center">
                    <h5
                      class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                    >
                      图片尺寸
                      <a-tooltip content="图片固定高度和宽度生成">
                        <icon-exclamation-circle />
                      </a-tooltip>
                    </h5>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between space-x-1 flex-wrap aspect"
                >
                  <button
                    v-for="(s, s_index) in tencent_all_size"
                    :class="tencent_size == s.value ? 'active' : ''"
                    @click="change_tencent_size(s.value)"
                    class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${s.width}%;height:${s.height}%`"
                      ></div>
                    </div>
                    <p class="mb-1 text-sm text-center">
                      {{ s.label }}
                    </p>
                  </button>
                </div>
              </section>
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
            消耗{{ counter.setting.money_name_set }}：{{
              activeDraw == "midj" ? mj_midj : ai_draw_pay
            }}/次
          </div>
          <a-button
            :loading="draw_loading"
            v-if="activeDraw == 'gpt'"
            @click="ai_draw()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'dream'"
            @click="ai_draw_dreams()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'midj'"
            @click="midj_ai_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'flux'"
            @click="ai_draw_flux()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'baidu'"
            @click="baidu_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'yijian'"
            @click="yijian_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'ali'"
            @click="ali_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-if="activeDraw == 'tencent'"
            @click="ai_draw_tencent()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
        </div>
      </div>
    </client-only>

    <a-spin class="main draw_main_content" :loading="infoLoading">
      <template #icon>
        <div class="flex justify-center">
          <svg
            class="arco-icon-loading"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z"
              fill="url(#svg_2fc1cd5fdf__paint0_linear_118545_226288)"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z"
              fill="url(#svg_2fc1cd5fdf__paint1_linear_118545_226288)"
            ></path>
            <defs>
              <linearGradient
                id="svg_2fc1cd5fdf__paint0_linear_118545_226288"
                x1="13.215"
                y1="6.907"
                x2="10.715"
                y2="16.282"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1765FF"></stop>
                <stop
                  offset=".031"
                  stop-color="#1765FF"
                  stop-opacity=".969"
                ></stop>
                <stop offset="1" stop-color="#1765FF" stop-opacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="svg_2fc1cd5fdf__paint1_linear_118545_226288"
                x1="-.574"
                y1="9.566"
                x2="18.802"
                y2="13.316"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#ADC9FF"></stop>
                <stop offset="1" stop-color="#8AB1FF" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </template>
      <div class="editor-panel bg-ai">
        <div class="editor-panel__right-panel">
          <div class="ai-header relative" style="top: 0px; height: 60px">
            <div
              class="sc-gfbthv jFmMKE"
              v-if="!is_sc && !is_finish && !now_draw"
              style="position: absolute; top: 100%"
            >
              <img
                width="28"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAACACAYAAABeH6oGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUhSURBVHhe7ZxNThsxFMeTVkLqx6JIbRdVpZJ1dxygkFyBAxTKNaoCVa9BCxfgCAn0Aqy6DtmwaLvIoh8LKtH+g02Hhz2x/Z49nsg/aRRPSIL/fl8ej5NOoVAoFBh01WNUng52d1Wz83X4v52CaAK1qCeDnZ3ZE4pvw729lCLFBULYvd6rtYe9/rp66hZf3naTeA64qx5ZPOitry+vbm6ubI9GaC8t91bUn4x0O93uz/HxsTqNCmskXaxlI5UVvS3oY62f45OTpeUV499TWdF5FG1Jw4ROJC+2h6OmY9HpH0DcPGEQhUedIWFdWBltGykyqpPAlx8uL1XzFrZOUuv9GI+Of48/n9CBim3FO+qxFnRONWdAFA50ziQO1qOu+X343jgQ2vVj4Tx66DQOF5cyWW+yP+ijbXL3mFYU/2BT7J3t9/vVjEldPmYsOrmoD48H725YB9aj5QCCVHOGS2YORVygKfZU85qUsSgqEO6pmtfYinkqK4oKNLmnat4ilRXFBNpKg2oaoVaMgXgMakzJhUKtGGNuKnK5BJ5tfPxUnXifH73ZupienalTK7/+TcgvppMJHqenBwfqaTHE6iCtbbT2NYWIi9Ls6eKeqRARSLNnTogI9M2eKWEL9CnuTcAW6FPcm0DERavk5J6AJdA0e8nJPYGoBXNzT8C2oGrOwJqLamYDSyAWfVVzRm7uCcSTTG6w5qJ0/plqOd6HYAua5p+qmRUL76JiFswxg4JiQRttKBGgWLDtLLzA4MLchiIPGheIcqNLDhIXyg0SllTSakyg621x7m214IXf+721GzssrhZw5y/0QpjeoaGesoLX4P/8mU4mLp9tIlmSgTBY3fcuElYMXAfERBKBde6ISTpcEQdWw22T9lCR0QXWiYMo3LtHnOFAYsE54tl05ylEYHAMPlp9vVmNwenp4SGNE5s4ba26TIm/YTdUVRTavjukxCxIRxfnNnGumRGvo5b0jeFggfMuj0z3K3zEaUyvh2eo5lyixCA6QNdLQ8RpOFYUE6gvn0yuyREHOO8NFmgLdNO9Ck4HNdSKrm4qJhAuCevlditNNAbpFi5Yzyel10E/h64o2IiSZDR6A54EJo9RzVpYAmlcVImxTko/k9ZeE9EsGCP2qNVc3J8l0JYdJWOPSxQLLtQmBFMcxrAejTfXGGcLdE3XXFwSiokoLuozGXaFDqRrGLCX+ujik0ZyrxqsRycRrotcLAvWuQ3tEAfOXpxoAgG+XqCawZguvXyyNEsgjQs6sugYXDg0JvE+06WXj+uzNsQ+37i5gfVqE+xkQi2Lc9/1TZM4DOD50daWOnWClWRsq9umzmnQSe1i1BIYCBym9+J9IZP3YIHoSF1mqxNZBR13uTIIzcpidZDGH+apdQu5mnniEHMYuNCSEyyQxpkJdApu5SKUgtdDHHe5I9hF6TfMXDqjB0XXNWo9iNLLkRLrOCwgEElGHy4WNRH6PlfEYjCU0NhypXGBsSkCbbjUrhwoFmw7RWDbKQJt+M4tm6JYsO0EC6SbEGJPmkMpFmw7wQLpZU6qexS+LLwFoywb5oSoBXPMpCyBdDazcAJz/b5SlYVPMiyBbSgV7KyXeyZlu2juiYYtMPdJd0ky86CJxuWeYErEBeaGyI9W0e8xpfwN33mIxGDOM5ooSSangi9WlHMt+NHKRC71UOyX8egXqbAhKIdEE82CuSAmMNcrC9FEkGOiEXXR6v7tttyc8QaJJnT7ZKFQKBQKBUk6nb8TLTAqguCwsgAAAABJRU5ErkJggg=="
                alt=""
              />
              <span>点击配置输入描述，开始绘图</span>
            </div>
            <div class="ai-header__left" @click="change_drawer()">
              <svg
                t="1690384155875"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="9016"
                id="mx_n_1690384155876"
                width="24"
                height="24"
              >
                <path
                  d="M288 64a128 128 0 0 1 123.968 96H960v64l-548.032 0.064a128 128 0 0 1-247.936 0L64 224v-64h100.032A128 128 0 0 1 288 64z m0 64a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m448 256a128 128 0 0 1 123.968 96H960v64l-100.032 0.064a128 128 0 0 1-247.936 0L64 544v-64h548.032A128 128 0 0 1 736 384z m0 64a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m-448 256a128 128 0 0 1 123.968 96H960v64l-548.032 0.064a128 128 0 0 1-247.936 0L64 864v-64h100.032A128 128 0 0 1 288 704z m0 64a64 64 0 1 0 0 128 64 64 0 0 0 0-128z"
                  fill="#333333"
                  p-id="9017"
                ></path>
              </svg>
            </div>
            <div class="ai-header__logo ai-header__logo--mobile">
              <span
                ><a class="ai-header__link"
                  ><img :src="counter.setting.logo" style="width: 40px" /></a
              ></span>
            </div>
            <div class="ai-header__right">
              <div class="ai-page__right">
                <div placement="bottomRight">
                  <div>
                    <div>
                      <a-tooltip
                        class="item"
                        effect="dark"
                        :content="
                          counter.setting.money_name_set + '：' + user_balance
                        "
                        placement="bottom"
                      >
                        <div class="creation">
                          <img
                            src="@/assets/images/header_jifen.png"
                            class="creation-count__icon"
                          />
                        </div>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ai-generate-area flex">
            <div class="generate-result-area flex-1 p-3">
              <div class="generate-result-area__container">
                <div class="check_now_draw h-100" v-if="now_draw">
                  <!--first load-->
                  <div
                    class="generate-card__generating mb-2"
                    v-if="now_draw.progress != 100 && !now_draw.no_img"
                  >
                    <div class="loading__progress--container pt-20 pb-20">
                      <div class="loader">
                        <ul class="hexagon-container">
                          <li class="hexagon hex_1"></li>
                          <li class="hexagon hex_2"></li>
                          <li class="hexagon hex_3"></li>
                          <li class="hexagon hex_4"></li>
                          <li class="hexagon hex_5"></li>
                          <li class="hexagon hex_6"></li>
                          <li class="hexagon hex_7"></li>
                        </ul>
                      </div>
                      <p class="mt-4 loading__progress--loading text-center">
                        生成中...
                      </p>
                    </div>
                  </div>
                  <!--have image-->
                  <div
                    class="generate-area-pc__content-wrap"
                    v-else-if="now_draw.progress != 0 && !now_draw.image"
                  >
                    <div class="generate-area-pc__content-outer">
                      <div class="generate-area-pc__content">
                        <div class="generate-card generate-card--generated">
                          <a-image
                            fit="contain"
                            :src="
                              now_draw.image ? now_draw.image : now_draw.no_img
                            "
                            class="generate-card__result-img"
                          >
                            <template #loader>
                              <div
                                class="loading__progress--container text-center pt-20 pb-20"
                              >
                                <div class="loader text-center m-auto">
                                  <ul class="hexagon-container">
                                    <li class="hexagon hex_1"></li>
                                    <li class="hexagon hex_2"></li>
                                    <li class="hexagon hex_3"></li>
                                    <li class="hexagon hex_4"></li>
                                    <li class="hexagon hex_5"></li>
                                    <li class="hexagon hex_6"></li>
                                    <li class="hexagon hex_7"></li>
                                  </ul>
                                </div>
                                <p
                                  class="mt-4 loading__progress--loading text-center"
                                >
                                  生成中...
                                </p>
                              </div>
                            </template>
                          </a-image>

                          <a-statistic
                            v-if="now_draw.progress != 100"
                            class="left-0 absolute bottom-1 p-2"
                            :value="now_draw.progress ? now_draw.progress : 0"
                            :value-from="0"
                            :start="true"
                            animation
                          >
                            <template #suffix>%</template>
                          </a-statistic>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--image done-->
                  <div class="generate-area-pc__content-wrap" v-else>
                    <div class="generate-area-pc__content-outer">
                      <div class="generate-area-pc__content">
                        <div
                          class="generate-card generate-card--generated flex-column overflow-hidden"
                        >
                          <a-image
                            fit="contain"
                            :src="now_draw.image"
                            class="generate-card__result-img rounded-xl"
                          >
                            <template #extra>
                              <div
                                class="round_bottom"
                                v-if="
                                  now_draw.type == 'midjourney' ||
                                  now_draw.type == 'midjourney_up' ||
                                  now_draw.type == 'midjourney_redo'
                                "
                              >
                                <div
                                  class="pl-2"
                                  v-if="now_draw.type == 'midjourney'"
                                >
                                  <div class="flex">
                                    <span>
                                      <svg
                                        t="1690372485007"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="6462"
                                        width="24"
                                        height="24"
                                      >
                                        <path
                                          d="M428.309333 149.333333c154.048 0 278.954667 124.885333 278.954667 278.954667a277.76 277.76 0 0 1-60.245333 173.184l175.68 175.722667a32 32 0 0 1 2.197333 42.816l-2.197333 2.432-0.256 0.256a32 32 0 0 1-45.248 0l-175.722667-175.68a277.781333 277.781333 0 0 1-173.162667 60.224C274.24 707.242667 149.333333 582.357333 149.333333 428.288S274.24 149.333333 428.309333 149.333333z m0 64.384c-118.528 0-214.613333 96.064-214.613333 214.570667s96.085333 214.592 214.613333 214.592c57.749333 0 110.165333-22.826667 148.736-59.925333 0.768-1.066667 1.664-2.069333 2.602667-3.029334l0.277333-0.256c0.981333-0.981333 1.984-1.877333 3.050667-2.688a213.674667 213.674667 0 0 0 59.904-148.693333c0-118.506667-96.064-214.570667-214.570667-214.570667z"
                                          fill="#ffffff"
                                          p-id="6463"
                                        ></path>
                                      </svg>
                                    </span>
                                    <a-button
                                      type="text"
                                      size="mini"
                                      v-for="(u, u_index) in 4"
                                      :key="u_index"
                                      @click="
                                        up_image_midj(
                                          u_index,
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 w-10 cursor-pointer mb-2"
                                    >
                                      {{ "U" + (u_index + 1) }}
                                    </a-button>
                                  </div>
                                  <div class="flex">
                                    <span>
                                      <svg
                                        t="1690372501528"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="6818"
                                        width="24"
                                        height="24"
                                      >
                                        <path
                                          d="M885.824 597.333333c17.408 0 31.509333 14.336 31.509333 32 0 16.64-12.501333 30.293333-28.458666 31.850667L184.533333 661.333333l135.317334 137.365334c11.52 11.712 12.266667 30.250667 2.176 42.816l-2.154667 2.432a31.146667 31.146667 0 0 1-42.154667 2.218666l-2.410666-2.197333-153.258667-155.584a53.930667 53.930667 0 0 1 0-75.413333 52.16 52.16 0 0 1 32.96-15.466667L159.168 597.333333h726.656zM745.6 177.834667l2.389333 2.197333 153.898667 155.584a53.76 53.76 0 0 1 0 75.413333 52.458667 52.458667 0 0 1-33.088 15.466667l-4.181333 0.170667-729.386667-0.149334c-17.450667 0-28.565333-14.314667-28.565333-32C106.666667 377.877333 119.36 362.666667 135.253333 362.666667h703.893334l-135.872-137.365334a32.277333 32.277333 0 0 1-2.176-42.816l2.154666-2.432a31.36 31.36 0 0 1 42.346667-2.218666z"
                                          fill="#ffffff"
                                          p-id="6819"
                                        ></path>
                                      </svg>
                                    </span>
                                    <a-button
                                      type="text"
                                      size="mini"
                                      v-for="(v, v_index) in 4"
                                      :key="v_index"
                                      @click="
                                        vp_image_midj(
                                          v_index,
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 w-10 cursor-pointer"
                                    >
                                      {{ "V" + (v_index + 1) }}
                                    </a-button>
                                  </div>
                                </div>
                                <div
                                  class="pl-2"
                                  v-if="now_draw.type == 'midjourney_up'"
                                >
                                  <div class="flex">
                                    <span>
                                      <Icon
                                        name="tdesign:upscale"
                                        class="ml-1"
                                        size="18"
                                      ></Icon>
                                    </span>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '0'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 ml-1 cursor-pointer mb-2 w-30"
                                    >
                                      U(Subtle)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '1'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer mb-2 w-30"
                                    >
                                      U(Creative)
                                    </a-button>
                                  </div>
                                  <div class="flex">
                                    <span>
                                      <svg
                                        t="1690373826628"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="7380"
                                        width="22"
                                        height="22"
                                      >
                                        <path
                                          d="M882.688 395.690667l42.133333-11.306667a10.986667 10.986667 0 0 1 13.056 14.762667l-36.864 92.096a32.96 32.96 0 0 1-50.986666 13.696l-77.824-61.290667a11.050667 11.050667 0 0 1 3.946666-19.306667l46.336-12.458666c-49.706667-161.664-223.552-256.533333-392.746666-212.608-172.16 44.693333-274.325333 216.170667-228.181334 382.997333 46.122667 166.826667 223.082667 265.813333 395.221334 221.12 16.661333-4.330667 33.792 5.248 38.250666 21.397333 4.48 16.149333-5.418667 32.746667-22.08 37.077334C407.466667 915.2 196.266667 797.056 141.226667 597.930667 86.165333 398.826667 208.106667 194.154667 413.568 140.8c202.346667-52.522667 410.24 61.269333 469.12 254.890667z"
                                          fill="#ffffff"
                                          p-id="7381"
                                        ></path>
                                      </svg>
                                    </span>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '3'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 ml-1 cursor-pointer mb-2 w-30"
                                    >
                                      V(Strong)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '2'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer mb-2 w-30"
                                    >
                                      V(Subtle)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      v-if="
                                        counter.setting
                                          .midjourney_model_choose == 'plus'
                                      "
                                      @click="
                                        region_dialog_up(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '2'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer mb-2 w-30"
                                    >
                                      V(Region)
                                    </a-button>
                                  </div>
                                  <div class="flex flex-nowrap">
                                    <span>
                                      <svg
                                        t="1690373606319"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="7124"
                                        width="24"
                                        height="24"
                                      >
                                        <path
                                          d="M428.309333 149.333333c154.048 0 278.954667 124.885333 278.954667 278.954667a277.76 277.76 0 0 1-60.245333 173.184l175.68 175.722667a32 32 0 0 1 2.197333 42.816l-2.197333 2.432-0.256 0.256a32 32 0 0 1-45.248 0l-175.722667-175.68a277.781333 277.781333 0 0 1-173.162667 60.224C274.24 707.242667 149.333333 582.357333 149.333333 428.288S274.24 149.333333 428.309333 149.333333z m0 64.384c-118.528 0-214.613333 96.064-214.613333 214.570667s96.085333 214.592 214.613333 214.592c57.749333 0 110.165333-22.826667 148.736-59.925333 0.768-1.066667 1.664-2.069333 2.602667-3.029334l0.277333-0.256c0.981333-0.981333 1.984-1.877333 3.050667-2.688a213.674667 213.674667 0 0 0 59.904-148.693333c0-118.506667-96.064-214.570667-214.570667-214.570667z"
                                          fill="#ffffff"
                                          p-id="7125"
                                        ></path>
                                      </svg>
                                    </span>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        zoom_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '0'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 ml-1 cursor-pointer w-30"
                                    >
                                      Zoom(2.0x)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        zoom_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '1'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer w-30"
                                    >
                                      Zoom(1.5x)
                                    </a-button>
                                  </div>
                                  <!--<div class="flex">-->
                                  <!--    <span>-->
                                  <!--      <Icon name="ph:square-logo" size="24"></Icon>-->
                                  <!--    </span>-->
                                  <!--  <a-button size="mini"-->
                                  <!--            type="text"-->
                                  <!--            @click="vary_image_midj(now_draw.title,now_draw.prompt_id,now_draw.message_id,'8')"-->
                                  <!--            :disabled="up_loading"-->
                                  <!--            class="mr-4 ml-1 cursor-pointer mb-2 w-30">-->
                                  <!--    ←-->
                                  <!--  </a-button>-->
                                  <!--  <a-button size="mini"-->
                                  <!--            type="text"-->
                                  <!--            @click="vary_image_midj(now_draw.title,now_draw.prompt_id,now_draw.message_id,'9')"-->
                                  <!--            :disabled="up_loading"-->
                                  <!--            class="mr-4  cursor-pointer mb-2 w-30">-->
                                  <!--    →-->
                                  <!--  </a-button>-->
                                  <!--  <a-button size="mini"-->
                                  <!--            type="text"-->
                                  <!--            @click="vary_image_midj(now_draw.title,now_draw.prompt_id,now_draw.message_id,'10')"-->
                                  <!--            :disabled="up_loading"-->
                                  <!--            class="mr-4  cursor-pointer mb-2 w-30">-->
                                  <!--    ↑-->
                                  <!--  </a-button>-->
                                  <!--  <a-button size="mini"-->
                                  <!--            type="text"-->
                                  <!--            @click="vary_image_midj(now_draw.title,now_draw.prompt_id,now_draw.message_id,'11')"-->
                                  <!--            :disabled="up_loading"-->
                                  <!--            class="mr-4  cursor-pointer mb-2 w-30">-->
                                  <!--    ↓-->
                                  <!--  </a-button>-->
                                  <!--</div>-->
                                </div>
                                <div
                                  class="pl-2"
                                  v-if="now_draw.type == 'midjourney_redo'"
                                >
                                  <div class="flex">
                                    <span>
                                      <Icon
                                        name="tdesign:upscale"
                                        class="ml-1"
                                        size="18"
                                      ></Icon>
                                    </span>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '0'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 ml-1 cursor-pointer mb-2 w-30"
                                    >
                                      U(Subtle)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '1'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer mb-2 w-30"
                                    >
                                      U(Creative)
                                    </a-button>
                                  </div>
                                  <div class="flex">
                                    <span>
                                      <svg
                                        t="1690373826628"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="7380"
                                        width="22"
                                        height="22"
                                      >
                                        <path
                                          d="M882.688 395.690667l42.133333-11.306667a10.986667 10.986667 0 0 1 13.056 14.762667l-36.864 92.096a32.96 32.96 0 0 1-50.986666 13.696l-77.824-61.290667a11.050667 11.050667 0 0 1 3.946666-19.306667l46.336-12.458666c-49.706667-161.664-223.552-256.533333-392.746666-212.608-172.16 44.693333-274.325333 216.170667-228.181334 382.997333 46.122667 166.826667 223.082667 265.813333 395.221334 221.12 16.661333-4.330667 33.792 5.248 38.250666 21.397333 4.48 16.149333-5.418667 32.746667-22.08 37.077334C407.466667 915.2 196.266667 797.056 141.226667 597.930667 86.165333 398.826667 208.106667 194.154667 413.568 140.8c202.346667-52.522667 410.24 61.269333 469.12 254.890667z"
                                          fill="#ffffff"
                                          p-id="7381"
                                        ></path>
                                      </svg>
                                    </span>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '3'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 ml-1 cursor-pointer mb-2 w-30"
                                    >
                                      V(Strong)
                                    </a-button>
                                    <a-button
                                      size="mini"
                                      type="text"
                                      @click="
                                        vary_image_midj(
                                          now_draw.title,
                                          now_draw.prompt_id,
                                          now_draw.message_id,
                                          '2'
                                        )
                                      "
                                      :disabled="up_loading"
                                      class="mr-4 cursor-pointer mb-2 w-30"
                                    >
                                      V(Subtle)
                                    </a-button>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </a-image>

                          <!-- ai-draw-feedback -->
                          <div
                            class="generate_result flex justify-content-between w-100 mt-4"
                          >
                            <!-- Left side: description popover and reference‑image button -->
                            <div class="generate_result_left">
                              <a-space class="mb-2">
                                <a-popover position="top">
                                  <template #reference>
                                    <a-button
                                      type="primary"
                                      v-if="
                                        now_draw.type === 'midjourney_text_img'
                                      "
                                    >
                                      <template #icon
                                        ><icon-select-all
                                      /></template>
                                      描述词语
                                    </a-button>
                                  </template>
                                  <template #content>
                                    <div
                                      class="flex flex-col h-80 overflow-auto w-60"
                                    >
                                      <div
                                        class="mb-4"
                                        v-for="(
                                          tip, tip_index
                                        ) in now_draw_title_arr"
                                        :key="tip_index"
                                      >
                                        <p>{{ tip }}</p>
                                        <a-button
                                          size="mini"
                                          type="primary"
                                          @click="input2 = tip"
                                        >
                                          添加到描述
                                        </a-button>
                                      </div>
                                    </div>
                                  </template>
                                </a-popover>

                                <a-button
                                  class="bg-white"
                                  v-if="
                                    now_draw.type === 'midjourney' ||
                                    now_draw.type === 'midjourney_up'
                                  "
                                  @click="imageUrl = now_draw.image"
                                >
                                  <template #icon><icon-image /></template>
                                  转为参考图
                                </a-button>
                              </a-space>
                            </div>

                            <!-- Right side: download, privacy toggle, delete, thumbs up/down -->
                            <div class="generate_result_right">
                              <a-space>
                                <!-- Download -->
                                <a-button
                                  class="bg-white"
                                  @click="download_draw(now_draw.image)"
                                >
                                  <template #icon><icon-download /></template>
                                  下载
                                </a-button>

                                <!-- Privacy lock/unlock -->
                                <a-button
                                  v-if="now_draw.is_public === 0"
                                  type="primary"
                                  status="danger"
                                  :loading="draw_bottom"
                                  round
                                  class="button"
                                  @click="send_pub(0, now_draw.id)"
                                >
                                  <template #icon><icon-lock /></template>
                                  私密
                                </a-button>
                                <a-button
                                  v-else
                                  type="primary"
                                  :loading="draw_bottom"
                                  round
                                  class="button"
                                  @click="send_pub(1, now_draw.id)"
                                >
                                  <template #icon><icon-unlock /></template>
                                  公开
                                </a-button>

                                <!-- Delete -->
                                <a-button
                                  type="primary"
                                  status="danger"
                                  :loading="draw_bottom"
                                  round
                                  class="button"
                                  @click="del_me_draw(now_draw.id)"
                                >
                                  <template #icon><icon-delete /></template>
                                  删除
                                </a-button>

                                <!-- Thumbs Up -->
                                <a-button
                                  type="primary"
                                  status="danger"
                                  round
                                  class="button"
                                  @click="handleThumbsUp(now_draw.id)"
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

                                <!-- Thumbs Down -->
                                <a-button
                                  type="primary"
                                  status="danger"
                                  round
                                  class="button"
                                  @click="handleThumbsDown(now_draw.id)"
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
                              </a-space>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="generate_now_all" v-if="is_sc || is_finish">
                  <a-row :gutter="20" v-if="is_sc">
                    <a-col
                      :span="image_select > 1 ? 12 : 24"
                      v-for="(item, item_index) in image_select"
                      :key="item_index"
                    >
                      <div class="generate-card__generating mb-2">
                        <div class="loading__progress--container pt-20 pb-20">
                          <div class="loader">
                            <ul class="hexagon-container">
                              <li class="hexagon hex_1"></li>
                              <li class="hexagon hex_2"></li>
                              <li class="hexagon hex_3"></li>
                              <li class="hexagon hex_4"></li>
                              <li class="hexagon hex_5"></li>
                              <li class="hexagon hex_6"></li>
                              <li class="hexagon hex_7"></li>
                            </ul>
                          </div>
                          <p
                            class="mt-4 loading__progress--loading text-center"
                          >
                            生成中...
                          </p>
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                  <a-row :gutter="20" v-if="is_finish">
                    <a-col
                      :span="12"
                      v-for="(image, fi_index) in r_images"
                      :key="fi_index"
                    >
                      <div
                        class="generate-card__generating_finish overflow-hidden mb-2"
                      >
                        <a-image
                          class="ernie-vilg-image-item-img rounded-xl"
                          :src="image.url"
                        >
                        </a-image>
                      </div>
                    </a-col>
                  </a-row>
                </div>

                <div
                  class="generate-empty"
                  v-if="now_draw == '' && !is_sc && !is_finish"
                >
                  <svg
                    t="1690307617217"
                    class="icon"
                    viewBox="0 0 1528 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9607"
                    width="128"
                    height="128"
                  >
                    <path
                      d="M907.462919 1018.1932h-11.859124L938.162809 325.921456h21.149392zM1056.386012 1018.1932h-11.859124L1087.08962 325.921456h21.149392z"
                      fill="#0F264C"
                      p-id="9608"
                    ></path>
                    <path
                      d="M1180.54993 1018.1932h11.859125L1116.655644 325.921456h-21.145674z"
                      fill="#0F264C"
                      p-id="9609"
                    ></path>
                    <path
                      d="M854.078271 558.482976h322.969686l15.353663-451.814055h-322.965969z"
                      fill="#0F264C"
                      p-id="9610"
                    ></path>
                    <path
                      d="M943.590496 304.11405h152.068178l6.234405-183.359166c0.546486-16.060006-12.357282-29.380144-28.469334-29.380144h-95.066311c-15.35738 0-27.952588 12.145379-28.469334 27.458148l-6.297604 185.284879z"
                      fill="#0F264C"
                      p-id="9611"
                    ></path>
                    <path
                      d="M1008.86401 157.570217h32.696238a20.000655 20.000655 0 0 0 20.015525-19.301748l1.628307-47.789669c0.643144-18.978317-14.606426-34.714892-33.644225-34.714892h-5.412817c-18.149293 0-33.027104 14.349912-33.644224 32.439724l-1.65433 48.711633c-0.382912 11.290333 8.688017 20.654952 20.015526 20.654952"
                      fill="#0F264C"
                      p-id="9612"
                    ></path>
                    <path
                      d="M843.512869 558.482976H1166.478838l15.35738-451.814055h-322.969686z"
                      fill="#C7E3FF"
                      p-id="9613"
                    ></path>
                    <path
                      d="M960.988836 145.922995c97.252256-44.127839 208.635086 4.290103 258.737099 95.527292 42.55158 77.485809 10.561684 220.274873-89.660929 181.292184-63.793911-24.814939-56.083621-117.884902-119.226954-141.242545-30.707325-11.360967-63.199096 12.156532-92.553217-11.130476C865.253358 228.29744 917.511575 165.648548 960.988836 145.922995"
                      fill="#0053CC"
                      p-id="9614"
                    ></path>
                    <path
                      d="M1025.61177 263.785591C962.04835 200.415486 873.194139 63.366388 779.428986 181.128609 691.742099 291.251175 839.040604 423.497142 932.13659 468.721672c88.069799 42.774635 275.243216 65.604379 298.340626-73.106484 23.287008-139.863317-146.73343-73.879743-204.865446-131.829597"
                      fill="#318FFF"
                      p-id="9615"
                    ></path>
                    <path
                      d="M733.427479 320.07368c46.719002-3.483385 75.392804 53.693208 120.542982 44.722655 27.815037-5.520627 45.354645-30.134816 68.942778-42.904751 20.811091-11.271745 44.376918-7.345966 62.674916 3.245459C1023.425825 347.037389 1053.31528 403.819918 1022.827292 449.222892c-28.852246 42.960515-84.716529 19.130738-115.472183 63.444457-27.744403 39.979005-14.227232 97.244821-76.917017 99.572035-47.458803 1.762139-84.493474-37.603462-76.259004-88.077235 4.386761-26.863333 11.044971-44.17245-4.55777-68.236435-13.435384-20.718151-36.655476-26.038028-53.299143-42.648237-33.023386-32.967623-12.030134-89.549401 37.105304-93.203797"
                      fill="#71B8FF"
                      p-id="9616"
                    ></path>
                    <path
                      d="M514.933334 246.48391a1353.947692 1353.947692 0 0 0-18.353761 39.034735 843.622427 843.622427 0 0 0-16.587904 39.852607c-1.312311 3.334682-2.490788 6.699104-3.751052 10.048656-0.594815 1.423838-0.713778 2.130181-0.550204 3.717594 0.338301 3.085603 3.717594 8.104355 8.171271 12.413046 9.067211 8.773522 21.536021 16.580469 33.666531 23.227526l-4.769673 13.074778a125.353548 125.353548 0 0 1-11.17137-3.38301c-3.643242-1.263982-7.264178-2.635774-10.825633-4.230622-7.141498-3.15252-14.175185-6.877549-20.95236-11.937194-3.36814-2.561422-6.72141-5.423969-9.814447-9.033753-3.048427-3.606066-5.981609-7.992827-7.747466-13.598959-1.851362-5.490886-1.858797-12.465092-0.096657-18.026612 1.09669-3.620936 2.126464-7.275331 3.282635-10.870245a496.923339 496.923339 0 0 1 15.613894-42.335959c5.754835-13.918671 11.918606-27.354056 19.034081-40.930709l24.848397 12.978121z"
                      fill="#FF8B7B"
                      p-id="9617"
                    ></path>
                    <path
                      d="M522.959619 259.748284c-6.152618 11.524541-13.34988 21.402188-13.349879 21.402188l-3.468516-3.513126-28.725847-29.079019s12.171402-41.090565 23.554674-43.585071c13.450255-2.955487 24.246147 10.372087 29.904326 25.142088 2.617186 6.825502-2.223121 18.933706-7.918475 29.63294"
                      fill="#006CFF"
                      p-id="9618"
                    ></path>
                    <path
                      d="M522.959619 259.748284c-6.152618 11.524541-13.34988 21.402188-13.349879 21.402188l-3.468516-3.513126c3.304941-14.375936 10.435286-45.16133 8.996578-55.366125 5.985326 7.777206 7.621067 24.023092 7.821817 37.477063"
                      fill="#004DAA"
                      p-id="9619"
                    ></path>
                    <path
                      d="M521.468864 386.823079L509.617175 411.909402l-9.39436-21.220026s8.32741-18.376067 19.59172-16.691996l1.650611 12.821981z"
                      fill="#FF8B7B"
                      p-id="9620"
                    ></path>
                    <path
                      d="M490.82102 411.91312l-9.405512-15.472626 18.811025-5.743683 9.394359 21.216309z"
                      fill="#FF8B7B"
                      p-id="9621"
                    ></path>
                    <path
                      d="M548.986494 990.255482c3.394163-2.059547 8.20473-4.394196 9.873929-3.624654 0.211903 0.100375 0.464699 0.275102 0.542769 0.825306 0.141269 1.018621-0.074352 1.77701-0.669167 2.319779-1.39038 1.263982-4.981576 1.431274-9.747531 0.479569zM551.968004 980.054405c0.09294 0 0.189597 0.007435 0.29369 0.022305 0.825306 0.096657 1.00375 0.464699 1.06695 0.776977 0.371759 1.888538-2.732432 6.342215-5.338465 8.431503 0.148704-2.635774 0.762107-7.082016 2.539116-8.658276a2.107876 2.107876 0 0 1 1.438709-0.572509zM736.922017 970.210216l0.074352 0.007435c0.301125 0.029741 0.50931 0.18588 0.66545 0.483287 0.408935 0.780695 0.446111 1.505626 0.10781 2.211969-0.962857 2.022371-5.026187 4.003849-11.022666 5.405381 3.241742-3.635807 7.951933-8.11179 10.100703-8.11179 0.052046 0 0.100375 0 0.148703 0.011153zM728.141061 966.89784c0.498158 0 0.646861 0.237926 0.706343 0.334583 0.996315 1.609718-1.275135 7.606197-3.576326 10.751282-0.524181-2.111593-1.382945-6.554118-0.01487-9.175022a3.401598 3.401598 0 0 1 2.111593-1.77701 2.691538 2.691538 0 0 1 0.77326-0.133833z"
                      fill="#0053CC"
                      p-id="9622"
                    ></path>
                    <path
                      d="M585.039719 171.678485c2.899723 0.557639 7.918475 2.847677 6.163771 6.279016-1.754704 3.427622-6.695387 5.892386-7.966804 4.212034-1.271417-1.672917-3.085603-11.416731 1.803033-10.487332"
                      fill="#9FC6FF"
                      p-id="9623"
                    ></path>
                    <path
                      d="M585.099201 178.124793c2.553987 1.494473 6.513224 5.338465 3.717594 7.981674-2.795631 2.643209-8.275364 3.304941-8.91479 1.293723-0.643144-2.003783 0.907093-11.792208 5.197196-9.275397"
                      fill="#9FC6FF"
                      p-id="9624"
                    ></path>
                    <path
                      d="M585.820414 179.098803c2.553987-1.066949 6.338498-0.620838 9.550499 2.438741 3.208284 3.063297 5.56152 6.252993 8.319975 7.100605 0 0-3.557737 1.959172-7.055993 2.029806-3.56889 0.074352-8.829285-10.654624-11.636069-9.182457l0.817871-2.386695z"
                      fill="#9FC6FF"
                      p-id="9625"
                    ></path>
                    <path
                      d="M585.876178 178.585775c1.565107-2.293755 4.981576-3.981543 9.334878-3.16739 4.35702 0.817871 8.059744 2.211968 10.836786 1.412686 0 0-1.925714 3.591196-4.818001 5.56152-2.95177 2.003783-13.190023-4.126529-14.747695-1.356922l-0.605968-2.449894z"
                      fill="#9FC6FF"
                      p-id="9626"
                    ></path>
                    <path
                      d="M549.22442 138.480372c3.193413 16.309084 10.394392 49.351059-0.981445 60.236174 0 0 4.442525 16.54701 34.659128 16.54701 33.224137 0 15.877843-16.543293 15.877843-16.543293-18.130705-4.345867-17.666006-17.840733-14.506051-30.51401l-35.049475-29.725881z"
                      fill="#FF8B7B"
                      p-id="9627"
                    ></path>
                    <path
                      d="M583.701386 184.875944c2.446177 0.546486 1.788163-8.041156 0.914528-8.963119-2.007501-2.130181-32.142317-6.260428-32.789178-1.416403-0.241644 2.081853-0.20075 6.174923 0.899657 7.609914 1.09669 1.434991 9.699202-2.412718 30.974993 2.769608"
                      fill="#9FC6FF"
                      p-id="9628"
                    ></path>
                    <path
                      d="M604.638874 97.460441a1.304875 1.304875 0 0 1-1.159889-1.88482c3.219436-6.44259 9.163869-7.189827 9.416665-7.212132a1.301158 1.301158 0 0 1 0.297408 2.583728c-0.193315 0.022306-4.821719 0.654297-7.390577 5.799446a1.301158 1.301158 0 0 1-1.163607 0.713778"
                      fill="#0F264C"
                      p-id="9629"
                    ></path>
                    <path
                      d="M614.546262 111.717414s4.892354 9.011448 9.554216 13.074777c-2.56514 3.070733-7.639655 2.442459-7.639655 2.44246l-1.914561-15.517237z"
                      fill="#FF5652"
                      p-id="9630"
                    ></path>
                    <path
                      d="M612.118673 108.181982c0.271384 2.200816 1.654329 3.840274 3.085603 3.66183 1.434991-0.178445 2.37926-2.107876 2.104158-4.304974-0.271384-2.204533-1.650612-3.840274-3.085603-3.665547-1.434991 0.178445-2.37926 2.104158-2.104158 4.308691"
                      fill="#0F264C"
                      p-id="9631"
                    ></path>
                    <path
                      d="M613.605711 104.074041l5.078233-2.17851s-2.19338 4.46483-5.078233 2.17851"
                      fill="#0F264C"
                      p-id="9632"
                    ></path>
                    <path
                      d="M695.950415 990.35214l26.69976-6.193512-12.517139-62.440707-26.699759 6.193512zM515.431492 990.55289h27.406102l-2.14877-63.667513h-27.406102z"
                      fill="#FF8B7B"
                      p-id="9633"
                    ></path>
                    <path
                      d="M545.008668 987.366912h-30.789112a2.171075 2.171075 0 0 0-2.185945 1.877385l-3.509409 24.435744c-0.360607 2.535399 1.810468 4.933247 4.394196 4.888636 10.736411-0.18588 15.911302-0.817871 29.443344-0.817871 8.334845 0 28.92288 0.869917 40.425116 0.869917 11.253157 0 12.115638-11.413013 7.323659-12.446504-21.472822-4.632122-33.287336-11.022666-40.521773-17.11952a7.141498 7.141498 0 0 0-4.580076-1.687787M722.114841 977.113788l-28.439593 11.836819a2.182228 2.182228 0 0 0-1.301158 2.576292l6.096854 23.922717c0.631991 2.475918 3.557737 3.858862 5.925845 2.825371 9.844189-4.301256 14.379653-6.873831 26.881921-12.08218 7.695419-3.197131 23.941305-9.026318 34.566188-13.446537 10.390675-4.327279 6.82922-15.197524 2.007501-14.312736-21.602938 3.977825-31.852344 1.330899-40.863792-1.520496a7.13778 7.13778 0 0 0-4.877484 0.20075"
                      fill="#14365B"
                      p-id="9634"
                    ></path>
                    <path
                      d="M710.129318 921.732792l6.710257 33.450909-26.963708 4.933248-6.457461-32.186928zM513.279005 926.903965h27.417255l1.092972 32.815201h-27.417255z"
                      fill="#EA7063"
                      p-id="9635"
                    ></path>
                    <path
                      d="M646.796389 259.78546a906.386564 906.386564 0 0 1-4.126529 38.592342v0.037176c-2.453612 19.851951-5.922127 43.979136-10.665777 73.284929h-111.304761c0.427523-10.372087 0.754672-19.79247 0.754672-29.309511 0-17.000557-1.048361-34.231604-4.483419-57.206334a689.591359 689.591359 0 0 0-2.583727-15.985654c-3.107908-17.554478-7.427753-38.39531-13.413079-64.225152 0 0 23.294443-5.085668 47.243183-6.267863 18.747826-0.888505 34.090336-1.475885 50.548124 0l2.026089 0.197032c2.490788 0.230491 4.974141 0.524181 7.461211 0.817871a517.165638 517.165638 0 0 1 24.342804 3.680418c7.490952 1.308593 12.498551 2.360672 12.498551 2.360672s6.018784 2.133899 1.69894 54.020357"
                      fill="#006CFF"
                      p-id="9636"
                    ></path>
                    <path
                      d="M646.796389 259.78546a906.386564 906.386564 0 0 1-4.126529 38.592342c-6.379391-13.651005-18.613993-41.023648-20.08616-52.674587l24.208971 14.078528z"
                      fill="#004DAA"
                      p-id="9637"
                    ></path>
                    <path
                      d="M660.216903 232.73253a1150.54326 1150.54326 0 0 0 18.773849 41.97907c6.654493 13.740227 13.624982 27.394949 21.506281 39.387907l3.018686 4.252927 0.516745 0.728649c0.063199 0.115245 0.111528 0.18588 0.130116 0.219338 0.055764 0.130116 0.018588 0.074352-0.096657 0.089222-0.223056-0.096657-0.776977-0.100375-0.706343 0.022306 0.055764 0.085505 0.658014 0.111528 1.561389-0.148704 1.858797-0.516746 4.516877-2.022371 7.119193-3.888603 2.635774-1.877385 5.312442-4.133964 7.918475-6.598729 5.264113-4.884918 10.405545-10.409263 15.27931-16.219863a435.739179 435.739179 0 0 0 14.342478-17.814709l11.970652 7.055993c-7.037405 14.810894-15.182653 28.539968-25.959958 41.767167a98.163066 98.163066 0 0 1-9.156434 9.561652c-3.464797 3.070733-7.342248 6.074548-12.769935 8.479831-2.743584 1.163607-5.992761 2.156204-9.859059 2.342084a23.119716 23.119716 0 0 1-11.970652-2.762172 25.346555 25.346555 0 0 1-4.795696-3.416469 21.431929 21.431929 0 0 1-1.914561-1.895973l-0.825306-0.914528-0.516746-0.639426-4.122811-5.093103c-10.245689-13.65844-18.179034-27.762991-25.521282-42.112904a485.294705 485.294705 0 0 1-19.922586-43.897349l25.997134-10.483614z"
                      fill="#FF8B7B"
                      p-id="9638"
                    ></path>
                    <path
                      d="M645.104884 205.761386c13.621264 3.330964 34.201864 47.499697 34.201863 47.499697l-29.521413 35.008582S609.575839 240.736509 614.044387 226.215588c4.661863-15.130607 14.532074-24.495226 31.056779-20.450484"
                      fill="#006CFF"
                      p-id="9639"
                    ></path>
                    <path
                      d="M757.91527 285.871817l22.301846-13.361033-18.01546-15.238417s-15.911302 13.037602-16.491247 24.450615l12.204861 4.148835z"
                      fill="#FF8B7B"
                      p-id="9640"
                    ></path>
                    <path
                      d="M798.823673 278.585333c-3.301223-1.858797-6.357086-4.067048-9.342313-6.375674-1.49819-1.152454-2.95177-2.356955-4.423937-3.546584-1.464732-1.18963-2.933182-2.37926-4.383043-3.591196a525.173335 525.173335 0 0 1-8.676864-7.32366 303.322202 303.322202 0 0 1-8.502138-7.565304 2.609751 2.609751 0 1 1 2.988946-4.238057c3.356987 1.780727 6.661928 3.635807 9.940846 5.528062 3.278918 1.892255 6.53553 3.817969 9.769837 5.773424 1.620871 0.966574 3.226871 1.966607 4.832872 2.955487 1.609718 0.992598 3.226871 1.970325 4.806849 3.000098 3.159955 2.059547 6.252993 4.215751 9.100669 6.72141a5.353335 5.353335 0 0 1 0.490723 7.531845 5.316159 5.316159 0 0 1-6.602447 1.130149"
                      fill="#9FC6FF"
                      p-id="9641"
                    ></path>
                    <path
                      d="M820.828111 283.845728c-2.037241-1.487038-3.836557-2.617186-4.981575-6.505789-1.048361-3.583761-7.494669-3.739899-9.368337 0.453546-1.736116 3.881168 0.951704 6.899854 5.03734 8.49842 1.97776 0.776977 4.364455 1.018621 6.409131 0.921963a25.729467 25.729467 0 0 1-1.42012-1.115278c-1.323463-1.126431 1.089255-2.119029 4.323561-2.252862"
                      fill="#0053CC"
                      p-id="9642"
                    ></path>
                    <path
                      d="M822.229644 284.927548a23.153175 23.153175 0 0 0-1.401533-1.078102c-3.234307 0.126398-5.647025 1.122713-4.323561 2.252862 0.483287 0.408935 0.959139 0.769542 1.42012 1.11156 3.234307-0.148704 5.628437-1.167324 4.304974-2.28632M817.515735 283.548321c-0.542769 0.096657-1.022338-0.066917-1.074384-0.364325-0.052046-0.297408 0.345736-0.609685 0.888504-0.706343 0.542769-0.09294 1.022338 0.070634 1.078103 0.364325 0.044611 0.297408-0.349454 0.613403-0.892223 0.706343"
                      fill="#71B8FF"
                      p-id="9643"
                    ></path>
                    <path
                      d="M795.217607 259.885835l-11.07843-9.041188-21.937521 6.42772 18.011742 15.238417zM537.424777 109.780547c4.992729 26.82244 6.528095 38.280064 21.848299 50.46262 23.041647 18.327738 54.789899 6.316192 57.89409-21.457952 2.788195-25.004536-5.836622-64.663828-33.532697-72.147345-27.287139-7.371989-51.198703 16.320237-46.209692 43.142677"
                      fill="#FF8B7B"
                      p-id="9644"
                    ></path>
                    <path
                      d="M600.378512 109.672737c8.903637-13.308986 17.286812-38.291217-2.724997-49.916133-19.089845-11.089583-56.232325-23.636462-77.980249 3.241742-20.357544 25.160675-22.353892 73.117636 35.625702 73.660405 57.983312 0.550204 45.079543-26.986014 45.079544-26.986014"
                      fill="#0F264C"
                      p-id="9645"
                    ></path>
                    <path
                      d="M572.567192 58.987062c7.996544-10.21223 20.721868-53.789866-23.446865-55.247163-44.168733-1.461014-37.990092 52.511014-9.632285 64.362703 21.446799-2.736149 33.07915-9.11554 33.07915-9.11554"
                      fill="#0F264C"
                      p-id="9646"
                    ></path>
                    <path
                      d="M572.069034 60.578192a0.817871 0.817871 0 0 1-0.587379-0.245361 0.829023 0.829023 0 0 1 0.01487-1.163607c5.316159-5.212067 15.993089-24.796351 9.636003-40.105403a0.825306 0.825306 0 0 1 0.446112-1.078102 0.829023 0.829023 0 0 1 1.066949 0.446111c6.219535 14.981903-3.208284 35.246508-10.004045 41.912154a0.810435 0.810435 0 0 1-0.57251 0.234208M509.31605 65.095069a0.817871 0.817871 0 0 1-0.776977-1.08182c1.141301-3.394163 4.57264-5.780858 9.665744-6.73628 7.870146-1.475885 17.454103 0.821588 20.930053 5.015034a0.817871 0.817871 0 0 1-1.256547 1.052079c-3.089321-3.728747-12.145379-5.806882-19.372381-4.457395-2.598598 0.490722-7.145215 1.86995-8.416633 5.650743a0.817871 0.817871 0 0 1-0.773259 0.557639M544.859965 173.808667a0.817871 0.817871 0 0 1-0.743519-1.15989c4.509441-9.929693 16.167816-14.15288 24.220124-11.866559a0.817871 0.817871 0 0 1-0.446111 1.57626c-7.253026-2.063265-18.186469 1.944302-22.286975 10.974337a0.810435 0.810435 0 0 1-0.743519 0.475852"
                      fill="#0F264C"
                      p-id="9647"
                    ></path>
                    <path
                      d="M538.510314 168.711846a0.821588 0.821588 0 0 1-0.669167-1.297441c6.710257-9.498452 22.944989-9.212198 29.551154-5.892386a0.825306 0.825306 0 0 1 0.360607 1.100408 0.817871 0.817871 0 0 1-1.092973 0.364324c-6.003914-3.014969-21.376165-3.271483-27.484171 5.379358a0.821588 0.821588 0 0 1-0.669167 0.345737"
                      fill="#0F264C"
                      p-id="9648"
                    ></path>
                    <path
                      d="M544.863682 67.515222c-0.044611 0-0.081787 0-0.126398-0.011152C528.223732 65.020717 514.208403 50.838096 512.156291 34.514142 510.278906 19.680942 518.736433 7.12291 535.35036 0.066917a0.810435 0.810435 0 0 1 1.070667 0.434958 0.817871 0.817871 0 0 1-0.431241 1.078102C520.100789 8.319975 512.000152 20.253451 513.773445 34.305956c1.974042 15.621329 15.390839 29.194265 31.2092 31.573525a0.817871 0.817871 0 0 1-0.118963 1.635741"
                      fill="#0F264C"
                      p-id="9649"
                    ></path>
                    <path
                      d="M536.763045 119.502055c-6.639623 10.561684-12.212296 43.64827 26.774111 43.730057 38.990125 0.085505 37.93061-34.595929 33.569873-40.246671-4.364455-5.650743-60.343984-3.483385-60.343984-3.483386"
                      fill="#0F264C"
                      p-id="9650"
                    ></path>
                    <path
                      d="M586.578803 116.509392c1.241676 5.520627 4.907224 9.948281 8.862744 12.368435 5.94815 3.643242 10.807045-1.241676 10.736411-7.862711-0.066917-5.963021-3.241742-15.045102-9.974304-15.996806-6.632187-0.944269-11.041254 5.186043-9.624851 11.491082"
                      fill="#FF8B7B"
                      p-id="9651"
                    ></path>
                    <path
                      d="M554.053574 340.323414c-3.501973 14.208644-20.119618 9.550499-32.588428 2.066982 0-17.000557-1.044644-34.231604-4.4797-57.206334 6.052243 2.988945 7.948216 13.717921 13.152847 21.628961 10.372087 15.818362 28.004635 17.000557 23.915281 33.510391"
                      fill="#318FFF"
                      p-id="9652"
                    ></path>
                    <path
                      d="M602.623938 371.699907s-5.234372 62.094971-12.825698 135.153125c-3.36814 32.521511-7.227003 67.247556-11.286615 99.609211-2.713844 21.595503-5.494604 42.105468-8.308823 60.254761-13.316421 85.891289-23.818624 286.652511-23.818624 286.652512H508.985184s-17.796122-193.902262-11.022666-278.841847c17.112085-214.969866-12.922356-253.008287 22.736804-302.827762h81.924616z"
                      fill="#9FC6FF"
                      p-id="9653"
                    ></path>
                    <path
                      d="M589.801957 506.853032c-3.371858 32.525229-7.23072 67.247556-11.290332 99.609211-9.684332-58.158039-15.375968-155.960499-11.189958-177.329229l22.48029 77.720018z"
                      fill="#77B3FC"
                      p-id="9654"
                    ></path>
                    <path
                      d="M718.032923 946.90462l-36.644323 5.613567s-57.90896-184.91312-74.0396-269.094316c-17.602807-91.731629-56.830858-311.723965-56.830857-311.723964h81.50081l4.055895 28.060398c3.338399 22.840897 8.342281 57.466566 13.710486 95.14438 8.866461 61.671165 18.714368 131.5768 23.94874 171.615287 11.286615 86.482386 44.298849 280.380931 44.298849 280.38093"
                      fill="#9FC6FF"
                      p-id="9655"
                    ></path>
                    <path
                      d="M649.785334 494.904685a28.737001 28.737001 0 0 1-4.122811-3.38301c-14.004176-13.717921-1.568825-37.31349-15.539543-50.574147-6.773456-6.431437-17.963414-3.870015-23.06767-13.323857-9.227068-17.000557 11.517106-27.632875 25.130935-27.930282 1.304875-0.033458 2.613468 0 3.888603 0.066916 3.338399 22.840897 8.345998 57.466566 13.710486 95.14438M621.583667 464.751281c2.449894 6.959336 1.382945 13.680745-2.386695 15.01908-3.76964 1.338334-8.810697-3.223154-11.264309-10.178772-2.446177-6.963053-1.379227-13.680745 2.390412-15.01908 3.765923-1.338334 8.810697 3.223154 11.260592 10.178772"
                      fill="#0053CC"
                      p-id="9656"
                    ></path>
                    <path
                      d="M626.520632 207.962202c-0.193315 4.985293 4.550335 9.186174-1.241676 12.862875-4.349585 2.788195-10.271712 1.475885-12.565468-3.345835-1.208218-2.56514-1.635741-4.397914-4.580075-5.613567-2.550269-1.052079-5.03734-0.197032-7.654526-0.721213-5.104256-1.018621-6.576424-7.026252-2.156205-10.074679 2.877418-1.970325 6.639623-1.085537 9.944564-1.349487 7.457493 0.921963 14.788588 2.0707 20.937489 3.085603-1.40525 1.345769-2.583728 2.88857-2.684103 5.152585"
                      fill="#71B8FF"
                      p-id="9657"
                    ></path>
                    <path
                      d="M723.427152 947.057041l-46.92347 7.992827-5.327312-17.762663 50.217258-8.613666zM551.484717 954.105599H503.884645l-2.501941-16.751478 50.373397-1.710093z"
                      fill="#0053CC"
                      p-id="9658"
                    ></path>
                    <path
                      d="M519.041275 365.130918l-5.018752 9.992893c-0.390347 0.77326 0.524181 1.565107 1.810469 1.565107h116.725012c1.00375 0 1.832774-0.490722 1.895973-1.126431l1.007468-9.992893c0.066917-0.691472-0.803-1.275135-1.895973-1.275134H520.851743c-0.829023 0-1.561389 0.334583-1.810468 0.836458"
                      fill="#14365B"
                      p-id="9659"
                    ></path>
                    <path
                      d="M534.1756 377.774455h-3.018686c-0.598533 0-1.055797-0.312278-1.018621-0.69519l1.416403-12.981838c0.044611-0.382912 0.568792-0.691472 1.171042-0.691472h3.018687c0.598533 0 1.055797 0.30856 1.01862 0.691472l-1.416403 12.981838c-0.044611 0.382912-0.568792 0.69519-1.171042 0.69519M607.345283 377.774455h-3.018687c-0.598533 0-1.055797-0.312278-1.01862-0.69519l1.416403-12.981838c0.044611-0.382912 0.565074-0.691472 1.167324-0.691472h3.022404c0.60225 0 1.059514 0.30856 1.014903 0.691472l-1.412685 12.981838c-0.044611 0.382912-0.568792 0.69519-1.171042 0.69519"
                      fill="#9FC6FF"
                      p-id="9660"
                    ></path>
                    <path
                      d="M305.502683 1019.022224c-0.100375 0.211903 6.970489-38.677847 10.643471-52.555625 9.360901-35.387776 23.275855-57.161724 45.179918-61.533614 19.372382-3.866298 30.737066 5.003881 42.637085 26.186731 0.892223 1.587413 5.260395 9.639721 6.453743 11.725291 7.959368 13.87406 13.506019 16.889029 23.3911 9.576522 25.889324-19.145608 42.98282-14.773718 62.459295 6.037373 0.765824 0.817871 7.130345 7.83297 8.862744 9.606262 3.044709 3.115344 5.43884 5.078233 7.650808 6.171206 1.955454 0.962857 3.713876 1.2045 5.457428 0.724931 39.161134-10.766152 77.957944-1.948019 113.892206 19.279442a202.014052 202.014052 0 0 1 23.66992 16.338825 157.59624 157.59624 0 0 1 6.390544 5.401664c1.100408 0.981445 1.855079 1.691505 2.249145 2.081852l3.256612 3.182261H305.000808l0.50931-2.245427-0.011153 0.022306z m95.218732-86.080887c-11.20111-19.937456-21.305531-27.829908-38.666694-24.36511-20.052701 4.003849-33.283618 24.710847-42.317371 58.842076-1.345769 5.085668-3.159955 13.621264-4.910942 22.342739l-0.453546 2.278885a1639.503513 1639.503513 0 0 0-4.762238 25.067736l-0.074352 0.420088h348.784658l-0.487005-0.423806a159.261722 159.261722 0 0 0-3.197131-2.680385l-1.163606-0.944269a198.315046 198.315046 0 0 0-23.234962-16.0377c-35.146133-20.762762-72.961498-29.357839-111.014789-18.89653-2.676668 0.736084-5.357053 0.371759-8.085766-0.977727-2.676668-1.316028-5.353335-3.513126-8.665712-6.907289-1.79188-1.829056-8.193577-8.885049-8.918507-9.662027-18.320303-19.576849-33.402581-23.431994-57.533483-5.587543-12.193708 9.018883-19.918868 4.818002-28.826223-10.714106-1.226806-2.133899-5.602414-10.204795-6.468614-11.755032z"
                      fill="#0B29B9"
                      p-id="9661"
                    ></path>
                    <path
                      d="M328.875195 1020.683988s7.074581-75.084244-27.677486-75.325887c-27.677486-0.189597-41.521806 57.198899-41.521806 57.198899s-22.141989-15.677093-43.176135-7.453775c-20.833396 8.141531-23.25355 25.580763-23.25355 25.580763h135.628977z"
                      fill="#FFFFFF"
                      p-id="9662"
                    ></path>
                    <path
                      d="M301.208862 943.499304c16.431765 0.115245 25.346555 15.004209 28.688672 39.268944 1.535366 11.145346 1.724964 22.956142 1.130148 33.755752a152.618382 152.618382 0 0 1-0.297407 4.334715l-0.163574 1.68407H191.112319l0.297407-2.111593c0.144986-1.063232 0.572509-2.825371 1.427557-5.048493a35.822735 35.822735 0 0 1 6.53553-10.762434c4.119094-4.702756 9.554216-8.554184 16.450353-11.249439 1.040926-0.408935 2.100441-0.765824 3.174825-1.070667 10.50592-3.011251 21.654984-1.18963 32.458312 3.643242 2.475918 1.104125 4.739932 2.290038 6.743715 3.47595l0.323431 0.193315c0.446111-1.59113 0.951704-3.319811 1.524213-5.16002l0.446112-1.401533a156.187272 156.187272 0 0 1 7.855275-19.90028c8.940813-18.535923 19.785035-29.740751 32.86353-29.651529z m-0.022306 3.717594c-11.178805-0.074352-21.115933 10.193642-29.487954 27.54737a152.547747 152.547747 0 0 0-7.665679 19.424428c-0.743519 2.319779-1.386663 4.472265-1.918278 6.405415-0.315995 1.152454-0.527898 1.970325-0.631991 2.397848l-0.643144 2.665515-2.237992-1.583695a36.952883 36.952883 0 0 0-2.297473-1.457297 62.790161 62.790161 0 0 0-6.36452-3.282636c-10.078397-4.505724-20.391002-6.186076-29.919196-3.457362-0.962857 0.271384-1.910843 0.594815-2.843959 0.959139-6.33478 2.4722-11.275462 5.974173-15.004209 10.234536a32.127446 32.127446 0 0 0-5.862646 9.643439c-0.219338 0.572509-0.408935 1.118996-0.576227 1.643176l-0.141268 0.4647h131.565647l0.007435-0.100376c0.037176-0.483287 0.070634-1.00375 0.104093-1.550236l0.048329-0.847612c0.583662-10.58399 0.397783-22.17173-1.100408-33.049409-3.119061-22.632712-11.097018-35.960286-25.03056-36.056943z"
                      fill="#0B29B9"
                      p-id="9663"
                    ></path>
                    <path
                      d="M300.517389 962.176496l3.572608 1.022338-16.606492 57.998182-3.572608-1.022338z"
                      fill="#0B29B9"
                      p-id="9664"
                    ></path>
                    <path
                      d="M463.545034 1019.07427l-43.347145-177.700988c-2.96664-12.17512-14.424264-20.234863-26.766676-18.829613-13.033884 1.487038-22.647582 12.992991-21.896628 26.22019l10.178772 170.626406 81.831677-0.315995z"
                      fill="#FFFFFF"
                      p-id="9665"
                    ></path>
                    <path
                      d="M393.223028 820.696025c13.27181-1.509343 25.591916 7.156368 28.781612 20.234864l43.347144 177.700987 0.557639 2.293756-2.356954 0.007435-81.831677 0.315995-1.758421 0.007436-0.104093-1.754705-10.178772-170.637559c-0.806718-14.201209 9.524476-26.569643 23.543522-28.164491z m25.16811 21.115933c-2.743584-11.264309-13.338727-18.718085-24.748022-17.420644-12.052439 1.37551-20.948642 12.022699-20.253451 24.261017l10.074679 168.871702 77.7163-0.301125-42.789506-175.41095z"
                      fill="#0B29B9"
                      p-id="9666"
                    ></path>
                    <path
                      d="M397.420191 840.194805l29.606918 178.723326-3.669265 0.605968-29.606918-178.719608z"
                      fill="#0B29B9"
                      p-id="9667"
                    ></path>
                    <path
                      d="M416.852055 876.709012l3.717594 0.122681c-0.01487 0.334583-0.048329 0.933116-0.126399 1.754704-0.126398 1.353204-0.323431 2.855112-0.605967 4.472266a55.789931 55.789931 0 0 1-4.119095 13.58037c-2.022371 4.420219-4.617252 8.290234-7.858993 11.450189l-2.594881-2.665515c2.88857-2.814219 5.230655-6.305039 7.070864-10.327475 1.840209-4.022437 3.085603-8.345998 3.840275-12.676996 0.260232-1.516778 0.446111-2.922029 0.565074-4.178575 0.070634-0.743519 0.104093-1.2677 0.111528-1.531649zM386.300868 930.238647a53.827042 53.827042 0 0 0 7.026253 9.676896c6.003914 6.542965 12.550597 10.119291 19.338923 9.353467l0.412653 3.695288c-8.20473 0.921963-15.762598-3.204566-22.491443-10.535661a57.500025 57.500025 0 0 1-7.569021-10.442721l3.282635-1.747269zM439.484766 966.778877l3.635807 0.758389a22.402221 22.402221 0 0 1-0.356889 1.40525 45.956896 45.956896 0 0 1-6.918442 14.182621c-3.695288 5.078233-8.372021 9.178739-14.13801 11.922324l-1.598565-3.360705c5.174891-2.45733 9.383207-6.145183 12.732759-10.747564a42.276478 42.276478 0 0 0 6.345933-13.007861c0.159857-0.565074 0.256514-0.959139 0.297407-1.152454zM383.226418 854.637657a24.796351 24.796351 0 0 0 2.78076 6.13403c3.040992 4.784543 6.92216 6.884984 12.05244 5.226937l1.141301 3.53915c-7.000229 2.264015-12.476245-0.706343-16.33139-6.773456a28.458181 28.458181 0 0 1-3.234307-7.163804l3.591196-0.962857z"
                      fill="#0B29B9"
                      p-id="9668"
                    ></path>
                    <path
                      d="M780.867695 1020.683988l22.874355-177.801363c1.565107-12.178838 11.840537-21.294378 24.004504-21.294377 12.85544 0 23.46917 10.137879 24.175513 23.093693l9.62485 176.002047h-80.679222z"
                      fill="#FFFFFF"
                      p-id="9669"
                    ></path>
                    <path
                      d="M827.746554 819.729451c13.84432 0 25.268486 10.914856 26.030592 24.852115l9.62485 176.002047 0.107811 1.959172h-84.753706l0.267667-2.096723 22.874355-177.801363c1.68407-13.104518 12.747629-22.915249 25.848431-22.915248z m0 3.717594c-11.227134 0-20.714433 8.416633-22.160578 19.673506l-22.60297 175.70464h76.597304l-9.51704-174.039157c-0.635709-11.691833-9.989175-20.892878-21.472823-21.324119l-0.843893-0.01487z"
                      fill="#0B29B9"
                      p-id="9670"
                    ></path>
                    <path
                      d="M827.609003 839.302583l-9.602545 181.381405"
                      fill="#FFFFFF"
                      p-id="9671"
                    ></path>
                    <path
                      d="M825.753923 839.209643l3.710159 0.193315-9.602545 181.381405-3.713876-0.197032z"
                      fill="#0B29B9"
                      p-id="9672"
                    ></path>
                    <path
                      d="M809.039621 877.181147s2.643209 18.193904 15.089714 27.844778"
                      fill="#FFFFFF"
                      p-id="9673"
                    ></path>
                    <path
                      d="M810.87983 876.91348c0.037176 0.226773 0.111528 0.687755 0.245361 1.342051 0.226773 1.107843 0.527898 2.345802 0.903376 3.680418 1.078102 3.821687 2.58001 7.639655 4.561487 11.18624 2.353237 4.215751 5.230655 7.762336 8.676864 10.431569l-2.278885 2.936899c-3.870015-3.000098-7.063428-6.929595-9.643438-11.558a55.801084 55.801084 0 0 1-4.892354-11.981805 55.094741 55.094741 0 0 1-0.966574-3.951802 29.89689 29.89689 0 0 1-0.282537-1.550237l3.680418-0.535333z"
                      fill="#0B29B9"
                      p-id="9674"
                    ></path>
                    <path
                      d="M848.10038 926.30915s-8.966836 22.576948-25.290791 22.602971"
                      fill="#FFFFFF"
                      p-id="9675"
                    ></path>
                    <path
                      d="M846.371699 925.621395l3.457362 1.37551a53.113264 53.113264 0 0 1-1.736116 3.699006 55.726732 55.726732 0 0 1-5.044775 8.037438c-5.665613 7.472364-12.405611 12.026416-20.238581 12.037569l-0.003718-3.717594c6.446308-0.011153 12.245754-3.929497 17.283094-10.56912 1.803033-2.37926 3.375575-4.940682 4.702756-7.498387 0.791847-1.531649 1.319746-2.713844 1.579978-3.364422z"
                      fill="#0B29B9"
                      p-id="9676"
                    ></path>
                    <path
                      d="M796.875654 967.678534s5.713942 17.416927 22.707063 23.249833"
                      fill="#FFFFFF"
                      p-id="9677"
                    ></path>
                    <path
                      d="M798.641511 967.09859c0.230491 0.706343 0.750954 1.99263 1.59113 3.672983 1.412686 2.821654 3.219436 5.63959 5.449993 8.267928 3.925779 4.632122 8.732628 8.148966 14.502334 10.130444l-1.208218 3.516844c-6.446308-2.211968-11.795925-6.126595-16.134358-11.242004a45.399256 45.399256 0 0 1-7.286484-11.992958c-0.223056-0.553921-0.371759-0.959139-0.446111-1.193348l3.531714-1.159889z"
                      fill="#0B29B9"
                      p-id="9678"
                    ></path>
                    <path
                      d="M842.973818 851.968425s-2.557705 16.803524-15.364815 14.219797"
                      fill="#FFFFFF"
                      p-id="9679"
                    ></path>
                    <path
                      d="M841.137327 851.689605l3.6767 0.557639c-0.078069 0.520463-0.256514 1.382945-0.557639 2.475918a27.465584 27.465584 0 0 1-2.055829 5.3459c-3.126496 6.052243-8.085767 9.331161-14.959598 7.940781l0.736083-3.643242c5.007599 1.011186 8.483549-1.286287 10.922291-6.007632 0.754672-1.457297 1.338334-3.037274 1.773292-4.617252 0.260232-0.944269 0.408935-1.665482 0.4647-2.052112z"
                      fill="#0B29B9"
                      p-id="9680"
                    ></path>
                    <path
                      d="M160.869693 1020.888456h1368.074548"
                      fill="#FFFFFF"
                      p-id="9681"
                    ></path>
                    <path
                      d="M160.869693 1022.747253h1368.074548v-3.717594H160.869693z"
                      fill="#0B29B9"
                      p-id="9682"
                    ></path>
                    <path
                      d="M1054.326465 904.453415c9.784707-8.911073 21.799971-12.933509 37.276314-11.513388 19.725553 1.810468 38.149948 13.624982 61.674883 36.781874 4.115376 4.052177 8.401762 8.446373 13.591523 13.911236 2.988945 3.141367 13.383338 14.197491 13.703051 14.535792 36.439855 38.59606 58.291872 55.801084 86.13665 62.206499l-0.832741 3.624654c-28.811353-6.62847-51.072305-24.156925-88.0066-63.280883l-0.063199-0.066917-0.315995-0.334583c-1.011186-1.078102-3.829122-4.074483-6.691669-7.104322l-1.219371-1.297441c-2.223121-2.360672-4.312409-4.57264-5.405382-5.725094a576.178723 576.178723 0 0 0-13.506018-13.822014c-22.95986-22.602971-40.759699-34.015984-59.40715-35.726077-26.071486-2.390413-38.491967 8.922225-54.03151 39.61468l-1.925713 3.829122-0.49444 0.981444-0.379195 0.750954-0.20075 0.401501c-11.784773 23.368795-19.487627 32.714826-33.83754 35.387776-14.978186 2.788195-24.491508 10.468744-29.714728 21.588067-2.059547 4.383043-3.334682 9.082082-3.97039 13.862908-0.431241 3.264047-0.520463 6.137747-0.408935 8.383174 0.011153 0.29369 0.026023 0.490722 0.037176 0.579945l-3.706441 0.334583a19.149326 19.149326 0 0 1-0.044611-0.736083 51.116916 51.116916 0 0 1 0.438676-9.048624 50.797203 50.797203 0 0 1 4.290103-14.959598c5.721377-12.17512 16.216145-20.647516 32.398831-23.662485 12.77737-2.37926 19.926303-11.052407 31.198048-33.406298l0.20075-0.397783 2.803065-5.568955c7.598762-15.007926 12.892616-23.275855 20.409591-30.123664zM1451.707511 943.499304c16.431765 0.115245 25.346555 15.004209 28.688672 39.268944 1.535366 11.145346 1.724964 22.956142 1.130148 33.755752a152.614664 152.614664 0 0 1-0.301125 4.334715l-0.159857 1.68407H1341.614685l0.297408-2.111593c0.144986-1.063232 0.572509-2.825371 1.427556-5.048493a35.822735 35.822735 0 0 1 6.53553-10.762434c4.119094-4.702756 9.554216-8.554184 16.446635-11.249439 1.044644-0.408935 2.104158-0.765824 3.178543-1.070667 10.50592-3.011251 21.654984-1.18963 32.458312 3.643242 2.475918 1.104125 4.736215 2.290038 6.743716 3.47595l0.32343 0.193315c0.446111-1.59113 0.947986-3.319811 1.524214-5.16002l0.446111-1.401533a156.161249 156.161249 0 0 1 7.855276-19.90028c8.937096-18.535923 19.785035-29.740751 32.86353-29.651529z m-0.026024 3.717594c-11.175087-0.074352-21.115933 10.193642-29.487954 27.54737a152.525442 152.525442 0 0 0-7.661961 19.424428c-0.743519 2.319779-1.386663 4.472265-1.918279 6.405415-0.315995 1.152454-0.527898 1.970325-0.631991 2.397848l-0.643143 2.665515-2.237992-1.583695a36.952883 36.952883 0 0 0-2.297473-1.457297 62.790161 62.790161 0 0 0-6.364521-3.282636c-10.078397-4.505724-20.391002-6.186076-29.919195-3.457362-0.962857 0.271384-1.910843 0.594815-2.847677 0.959139-6.331062 2.4722-11.271745 5.974173-15.000491 10.234536a32.127446 32.127446 0 0 0-5.862646 9.643439c-0.223056 0.572509-0.408935 1.118996-0.576227 1.643176l-0.141269 0.4647h131.565648l0.007435-0.100376c0.037176-0.483287 0.070634-1.00375 0.104093-1.550236l0.048328-0.847612c0.579945-10.58399 0.394065-22.17173-1.100407-33.049409-3.119061-22.632712-11.097018-35.960286-25.034278-36.056943z"
                      fill="#0B29B9"
                      p-id="9683"
                    ></path>
                  </svg>
                  <div class="generate-empty__title font-18">添加绘画任务</div>
                  <div class="generate-empty__desc">
                    快去左侧输入你的绘画灵感吧~
                  </div>
                </div>

                <div
                  class="generate-result-area__text-input-area generate-result-area__text-input-area--result"
                  style="display: none"
                >
                  <textarea readonly="readonly"></textarea>
                </div>
              </div>
            </div>
            <div class="bg-F8F8FB flex-center">
              <div class="task_me flex">
                <div
                  class="left_btn flex align-items-center mr-3"
                  @click="right_sout = !right_sout"
                >
                  <a-button class="bg-white w-auto" shape="round">
                    <icon-caret-left v-if="right_sout" />
                    <icon-caret-right v-else />
                  </a-button>
                </div>
                <div
                  class="right_content w-40 mr-3"
                  :class="right_sout ? 'w-0 mr-0' : ''"
                >
                  <div class="me_draws p-2 bg-white shadow-sm">
                    <div class="top_info flex justify-content-between">
                      <span class="font-bold">{{ me_draw_count }}个作品</span>
                      <a-popconfirm
                        content="此操作将永久删除未完成的绘画,确定要删除吗?"
                        @ok="delete_draw_nofinish()"
                        type="warning"
                      >
                        <icon-select-all size="20" class="cursor-pointer" />
                      </a-popconfirm>
                    </div>

                    <div
                      class="mt-2 work_content"
                      v-if="me_draw.length > 0 && !ske_loading"
                    >
                      <div
                        class="img_work relative cursor-pointer"
                        v-for="(m, m_index) in me_draw"
                        :key="m_index"
                      >
                        <a-image
                          fit="cover"
                          @click="get_choose_index(m.id)"
                          :initial-index="m_index"
                          :style="{
                            minHeight: '140px',
                            minWidth: '100%',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                          }"
                          :preview-visible="visible1"
                          @preview-visible-change="
                            () => {
                              visible1 = false;
                            }
                          "
                          :src="m.image ? m.image : m.no_img"
                          class="mb-1 overflow-hidden rounded-xl"
                        >
                          <template #loader>
                            <img
                              class="h-full p-3"
                              src="@/assets/images/loading.gif"
                            />
                          </template>
                        </a-image>
                        <a-statistic
                          v-if="m.progress != 100"
                          class="left-0 absolute bottom-1 p-2"
                          :value="m.progress ? m.progress : 0"
                          :value-from="0"
                          :start="true"
                          animation
                        >
                          <template #suffix>%</template>
                        </a-statistic>
                        <div
                          v-if="m.type == 'midjourney_text_img'"
                          class="right-1 bg-boli absolute top-3 p-1"
                          :value="m.progress ? m.progress : 0"
                          :value-from="0"
                          :start="true"
                          animation
                        >
                          图生文
                        </div>
                      </div>
                    </div>
                    <a-empty description="暂无数据哦~" v-else />
                    <div class="mt-2 mb-2" v-if="token">
                      <NuxtLink :to="'/member/' + user_id">
                        <a-button class="w-100" type="primary">
                          <template #icon>
                            <icon-user />
                          </template>
                          进入个人空间
                        </a-button>
                      </NuxtLink>
                    </div>
                    <div class="flex justify-center">
                      <a-pagination
                        simple
                        size="mini"
                        :current="me_page"
                        :page-size="me_page_size"
                        class="mr-4 ml-4"
                        hide-on-single-page
                        background
                        :total="me_draw_count"
                        @change="me_change"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <a-drawer
      v-model:visible="drawer"
      title="配置"
      placement="left"
      class="left_ai_draw"
      width="80%"
    >
      <a-tabs
        @tab-click="handleClick"
        v-model="activeDraw"
        type="capsule"
        size="large"
        class="justify-content-center mt-2"
      >
        <a-tab-pane
          title="普通绘画"
          key="gpt"
          v-if="counter.setting.is_open_normal_draw == 1"
        >
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  绘画描述
                  <a-tooltip content="翻译为英文">
                    <a-button
                      size="small"
                      @click="translate()"
                      :loading="draw_loading"
                      type="primary"
                      status="success"
                      shape="round"
                    >
                      <template #icon>
                        <icon-language />
                      </template>
                    </a-button>
                  </a-tooltip>
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
                  type="textarea"
                  :max-length="2000"
                  show-word-limit
                  allow-clear
                  placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                />
                <div
                  class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                >
                  <a-trigger
                    :popup-translate="[100, 0]"
                    trigger="click"
                    position="bottom"
                    auto-fit-position
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
                        <h5>绘画联想</h5>
                        <a-textarea
                          v-model="draw_ai"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          type="textarea"
                          allow-clear
                          placeholder="请输入简单的描述，AI将智能输出绘图内容"
                        />
                        <a-button
                          type="primary"
                          class="w-100 mt-2 mb-2"
                          :loading="draw_loading"
                          @click="send_ai_draw()"
                          >生成绘图描述
                        </a-button>
                      </div>
                    </template>
                  </a-trigger>
                  <div class="cursor-pointer ml-1.5" @click="des_send()">
                    <icon-skin />
                    描述咒语
                  </div>
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
                    花海女孩
                  </li>
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="input2 = all_prompt[1]"
                  >
                    办公室男人
                  </li>
                </ul>
                <icon-refresh class="cursor-pointer" @click="change_prompt()" />
              </div>
            </div>
          </section>

          <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
            <div class="flex-center justify-between relative">
              <div class="flex-center">
                <h5
                  class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                >
                  图片尺寸<a-tooltip content="图片固定高度和宽度生成">
                    <icon-exclamation-circle />
                  </a-tooltip>
                </h5>
              </div>
            </div>
            <div class="flex items-center justify-between space-x-1 aspect">
              <button
                v-for="(s, s_index) in all_size"
                :class="size == s.value ? 'active' : ''"
                @click="change_size(s.value)"
                class="flex-1 border-2 rounded aspect-item dark:border-neutral-700"
              >
                <div
                  class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                >
                  <div
                    class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                    :style="`width:${s.width}%;height:${s.height}%`"
                  ></div>
                </div>
                <p class="mb-1 text-sm text-center">
                  {{ s.label }}
                </p>
              </button>
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
        </a-tab-pane>
        <a-tab-pane
          title="专业绘画"
          key="midj"
          v-if="counter.setting.midjourney_is_open == 1"
        >
          <div class="w-full flex justify-center">
            <a-radio-group
              class="mb-2"
              type="button"
              v-model="midj_check_radio"
            >
              <a-radio value="basic_do">基本操作</a-radio>
              <a-radio value="text_to_img">图生文</a-radio>
            </a-radio-group>
          </div>

          <section
            class="draw_infomation pb-32"
            v-if="midj_check_radio == 'basic_do'"
          >
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    绘画描述
                    <a-tooltip content="翻译为英文">
                      <a-button
                        size="small"
                        @click="translate()"
                        :loading="draw_loading"
                        type="primary"
                        status="success"
                        shape="round"
                      >
                        <template #icon>
                          <icon-language />
                        </template>
                      </a-button>
                    </a-tooltip>
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
                    type="textarea"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                  />
                  <div
                    class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      position="bottom"
                      auto-fit-position
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
                          <h5>绘画联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出绘图内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="draw_loading"
                            @click="send_ai_draw()"
                            >生成绘图描述
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                    <div class="cursor-pointer ml-1.5" @click="des_send()">
                      <icon-skin />
                      描述咒语
                    </div>
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
                      花海女孩
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[1]"
                    >
                      办公室男人
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <a-upload
              class="avatar-uploader"
              :action="actions"
              :show-file-list="false"
              :headers="{ Authorization: 'Bearer ' + token }"
              @before-upload="beforeUpload"
              @success="picSuccess"
              draggable
            >
              <template #upload-button>
                <div>
                  <div
                    class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                    v-if="imageUrl"
                  >
                    <div
                      class="edui-left-panel__reference-img-container mt-0 rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <img class="w-auto rounded-10" :src="imageUrl" />
                        </div>
                      </div>
                    </div>

                    <div class="arco-upload-list-picture-mask rounded-10">
                      <IconPlus />
                    </div>
                  </div>
                  <div
                    v-else
                    class="edui-left-panel__reference-img-container rounded-10"
                  >
                    <span class="left-panel-setting-block__title">参考图</span>
                    <div class="upload-file">
                      <div
                        class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                        style="width: 56px; height: 56px"
                      >
                        <svg
                          role="img"
                          aria-label="cloud-upload"
                          focusable="false"
                          data-icon="cloud-upload"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="gd_design_icon gd_design_icon-cloud-upload"
                        >
                          <path
                            d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
            <a-button
              type="primary"
              status="danger"
              @click="deletePic"
              class="w-100"
              shape="round"
              v-if="imageUrl"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除图片
            </a-button>

            <!--model select-->
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                模型选择
                <a-tooltip
                  content="MJ：通用模型
                        NIJI：动漫风格模型"
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
                    <div class="model-card__title"><span>MJ</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/mj.jpg"
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
                    <div class="model-card__title"><span>NIJI</span></div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    src="@/assets/images/niji.jpg"
                  />
                </button>
              </a-col>
            </a-row>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">版本</span>
              <div class="flex-1" v-if="version == 1">
                <a-select v-model="version_me" placeholder="选择版本">
                  <a-option
                    v-for="item of mj_version"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </div>
              <div class="flex-1" v-else>
                <a-select v-model="version_nj" placeholder="选择版本">
                  <a-option
                    v-for="item of nj_version"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </div>
            </div>
            <div
              class="flex items-center justify-between space-x-2 mt-2"
              v-if="version == 1"
            >
              <span class="w-[70px]">RAW</span>
              <div class="flex-1">
                <a-switch v-model="mj_row" />
              </div>
              <a-tooltip
                content="呈现的人物写实感更加逼真,人物细节、光源、流畅度也更加接近原始作品"
              >
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
            <div class="mt-2" v-if="version == 2">
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title mt-2 fs-5">
                  风格选择
                  <a-tooltip
                    content="根据你想生成的图片选择对应的风格，效果更佳哦"
                  >
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>
              <a-row :gutter="10" class="mj_version style_choose">
                <a-col
                  :span="12"
                  class="version-item mb-2"
                  @click="niji_style = 1"
                  :class="niji_style == 1 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title"><span>动漫</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/normal_niji.png"
                    />
                  </button>
                </a-col>
                <a-col
                  :span="12"
                  class="version-item"
                  @click="niji_style = 2"
                  :class="niji_style == 2 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title"><span>可爱</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/cute_niji.png"
                    />
                  </button>
                </a-col>
                <a-col
                  :span="12"
                  class="version-item"
                  @click="niji_style = 3"
                  :class="niji_style == 3 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title"><span>丰富</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/dr_niji.png"
                    />
                  </button>
                </a-col>
                <a-col
                  :span="12"
                  class="version-item"
                  @click="niji_style = 4"
                  :class="niji_style == 4 ? 'active' : ''"
                >
                  <button
                    class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                  >
                    <div
                      class="absolute flex items-center justify-center w-full h-full"
                    >
                      <div class="model-card__title"><span>风景</span></div>
                    </div>
                    <img
                      class="object-cover w-full h-full rounded-xl"
                      src="@/assets/images/scene_niji.png"
                    />
                  </button>
                </a-col>
              </a-row>
            </div>

            <!--model select end-->
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                图片比例
                <a-tooltip content="参数释义：生成图片尺寸比例">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-dropdown :popup-max-height="false" class="bili_main">
              <section
                class="w-full p-1 flex-center justify-between bg-white-1 rounded-8 cursor-pointer border hover:border-primary-base transition-border border-transparent"
              >
                <div class="flex-center space-x-20">
                  <div class="flex-center bg-gray-6 w-20 rounded-6 pr-6">
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${bili[choose_bili - 1].width}%;height:${
                          bili[choose_bili - 1].height
                        }%`"
                      ></div>
                    </div>
                    <span class="text-gray-2 text-12 font-600">{{
                      bili[choose_bili - 1].name
                    }}</span>
                  </div>
                  <span class="text-gray-2 text-14 font-600">{{
                    bili[choose_bili - 1].title
                  }}</span>
                </div>
              </section>
              <template #content>
                <a-doption
                  v-for="(b, b_index) in bili"
                  @click="choose_bili = b.value"
                >
                  <div class="w-100 flex justify-content-between p-1">
                    <div class="flex-center rounded-6 w-20 bg-gray-6 mr-6 pl-2">
                      <div
                        class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                      >
                        <div
                          class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                          :style="`width:${b.width}%;height:${b.height}%`"
                        ></div>
                      </div>
                      <span
                        class="text-14 ml-1 mr-3 text-gray-2 font-600 large:text-12 large:mr-0"
                        >{{ b.name }}</span
                      >
                    </div>
                    <span class="text-gray-2 text-14 font-600 left-83">{{
                      b.title
                    }}</span>
                  </div>
                </a-doption>
              </template>
            </a-dropdown>

            <!--model can -->
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">参数</div>
            </div>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">画质</span>
              <div class="flex-1">
                <a-select v-model="pic_select" placeholder="画质选择">
                  <a-option
                    v-for="item of pic_quality"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </div>
              <a-tooltip content="参数释义：更高质量需要更长的时间处理更多细节">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">混乱</span>
              <div class="flex-1">
                <a-input-number v-model="chaos" :min="0" :max="100" />
              </div>
              <a-tooltip
                content="参数释义：较高值将产生意想不到的结果和成分 较低值具有更可靠、可重复的结果"
              >
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>

            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">种子</span>
              <div class="flex-1">
                <a-input-number v-model="seed" :min="0" :max="100" />
              </div>
              <a-tooltip content="参数释义：指定的种子数对图片定位有意义">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
            <div
              v-if="version == 1 && (version_me == 6.0 || version_me == 6.1)"
            >
              <div class="left-panel-setting-block__header">
                <div class="left-panel-setting-block__title fs-5">
                  角色一致性
                  <a-tooltip
                    content="参数释义：--cref请上传1张具有人脸的图片,图片大小上限为20M"
                  >
                    <icon-exclamation-circle class="font-18 ml-1" />
                  </a-tooltip>
                </div>
              </div>

              <a-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :headers="{ Authorization: 'Bearer ' + token }"
                @before-upload="beforeUpload"
                @success="picSuccessCref"
                draggable
              >
                <template #upload-button>
                  <div>
                    <div
                      class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                      v-if="cref_image"
                    >
                      <div
                        class="edui-left-panel__reference-img-container mt-0 rounded-10"
                      >
                        <span class="left-panel-setting-block__title"
                          >参考图</span
                        >
                        <div class="upload-file">
                          <div
                            class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                            style="width: 56px; height: 56px"
                          >
                            <img class="w-auto rounded-10" :src="cref_image" />
                          </div>
                        </div>
                      </div>

                      <div class="arco-upload-list-picture-mask rounded-10">
                        <IconPlus />
                      </div>
                    </div>
                    <div
                      v-else
                      class="edui-left-panel__reference-img-container rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <svg
                            role="img"
                            aria-label="cloud-upload"
                            focusable="false"
                            data-icon="cloud-upload"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-cloud-upload"
                          >
                            <path
                              d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                              fill="currentColor"
                            ></path>
                            <path
                              d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <a-button
                type="primary"
                status="danger"
                @click="deletePicCref"
                class="w-100"
                shape="round"
                v-if="cref_image"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除图片
              </a-button>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">角色强度</span>
                <div class="flex-1">
                  <a-slider v-model="cw" :min="0" :max="100" />
                </div>
                <a-tooltip
                  content="参数释义：强度为0时会专注面部一致，强度为100时会同时参考面部、头发和衣服。"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>

            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title fs-5">
                风格化
                <a-tooltip
                  content="参数释义：数值越高，画面表现也会更具丰富性和艺术性"
                >
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <div class="filters-container">
              <div class="filters-wrapper filter-tabst">
                <ul class="filter-tabs">
                  <li>
                    <button class="filter-button" @click="change_s(50, 0)">
                      低
                    </button>
                  </li>
                  <li>
                    <button class="filter-button" @click="change_s(100, 100)">
                      中
                    </button>
                  </li>
                  <li>
                    <button class="filter-button" @click="change_s(250, 200)">
                      高
                    </button>
                  </li>
                  <li>
                    <button class="filter-button" @click="change_s(750, 300)">
                      强烈
                    </button>
                  </li>
                </ul>
                <div class="filter-slider" aria-hidden="true">
                  <div
                    class="filter-slider-rect"
                    :style="{ transform: 'translateX(' + xPos + '%)' }"
                  >
                    &nbsp;
                  </div>
                </div>
              </div>
            </div>
            <!--<a-input-number class="mt-2" v-model="style" :min="0" :max="750"/>-->
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                设定信息
              </div>
            </div>

            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">携带参数</span>
              <div class="flex-1">
                <a-switch v-model="is_pic" />
              </div>
            </div>
          </section>
          <section class="draw_infomation pb-32" v-else>
            <a-upload
              class="avatar-uploader"
              :action="actions"
              :show-file-list="false"
              :headers="{ Authorization: 'Bearer ' + token }"
              @before-upload="beforeUpload"
              @success="TextSuccess"
              draggable
            >
              <template #upload-button>
                <div>
                  <div
                    class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                    v-if="text_imageUrl"
                  >
                    <div
                      class="edui-left-panel__reference-img-container mt-0 rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <img class="w-auto rounded-10" :src="text_imageUrl" />
                        </div>
                      </div>
                    </div>

                    <div class="arco-upload-list-picture-mask rounded-10">
                      <IconPlus />
                    </div>
                  </div>
                  <div
                    v-else
                    class="edui-left-panel__reference-img-container rounded-10"
                  >
                    <span class="left-panel-setting-block__title">参考图</span>
                    <div class="upload-file">
                      <div
                        class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                        style="width: 56px; height: 56px"
                      >
                        <svg
                          role="img"
                          aria-label="cloud-upload"
                          focusable="false"
                          data-icon="cloud-upload"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="gd_design_icon gd_design_icon-cloud-upload"
                        >
                          <path
                            d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
            <a-button
              type="primary"
              status="danger"
              @click="text_imageUrl = ''"
              class="w-100"
              shape="round"
              v-if="imageUrl"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除图片
            </a-button>
            <a-button
              type="primary"
              size="large"
              class="w-full my-3 rounded"
              @click="midj_ai_describe()"
            >
              <template #icon>
                <icon-command />
              </template>
              生成图生文
            </a-button>
          </section>
        </a-tab-pane>
        <a-tab-pane
          title="百度绘画"
          key="baidu"
          v-if="counter.setting.is_draw_baidu_open == 1"
        >
          <div class="pb-32">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                  >
                    绘画描述
                    <a-tooltip content="百度绘画仅支持中文关键词">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                >
                  <a-textarea
                    v-model="input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    type="textarea"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                  />
                  <div
                    class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      position="bottom"
                      auto-fit-position
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
                          <h5>绘画联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出绘图内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="draw_loading"
                            @click="send_ai_draw()"
                            >生成绘图描述
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                    <div class="cursor-pointer ml-1.5" @click="des_send()">
                      <icon-skin />
                      描述咒语
                    </div>
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
                      花海女孩
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[1]"
                    >
                      办公室男人
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center justify-between relative">
                <div class="flex-center">
                  <h5
                    class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                  >
                    图片尺寸
                    <a-tooltip content="图片固定高度和宽度生成">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div
                class="flex items-center justify-between space-x-1 flex-wrap aspect"
              >
                <button
                  v-for="(s, s_index) in baidu_all_size"
                  :class="baidu_size == s.value ? 'active' : ''"
                  @click="change_baidu_size(s.value)"
                  class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                >
                  <div
                    class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                  >
                    <div
                      class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                      :style="`width:${s.width}%;height:${s.height}%`"
                    ></div>
                  </div>
                  <p class="mb-1 text-sm text-center">
                    {{ s.label }}
                  </p>
                </button>
              </div>
            </section>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center justify-between relative">
                <div class="flex-center">
                  <h5
                    class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                  >
                    图片数量
                  </h5>
                </div>
              </div>
              <div class="UXmDHLrm">
                <span
                  v-for="(i, i_index) in images_list"
                  :key="i_index"
                  :class="image_select == i.value ? 'OMJ2YPhL' : ''"
                  @click="change_i(i.value)"
                  >{{ i.name }}</span
                >
              </div>
            </section>
            <a-upload
              class="avatar-uploader"
              :action="actions"
              :show-file-list="false"
              :headers="{ Authorization: 'Bearer ' + token }"
              @before-upload="beforeUpload"
              @success="BaiduSuccess"
              draggable
            >
              <template #upload-button>
                <div>
                  <div
                    class="arco-upload-list-picture mt-2 rounded-10 w-100 custom-upload-avatar"
                    v-if="baidu_imageUrl"
                  >
                    <div
                      class="edui-left-panel__reference-img-container mt-0 rounded-10"
                    >
                      <span class="left-panel-setting-block__title"
                        >参考图</span
                      >
                      <div class="upload-file">
                        <div
                          class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                          style="width: 56px; height: 56px"
                        >
                          <img
                            class="w-auto rounded-10"
                            :src="baidu_imageUrl"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="arco-upload-list-picture-mask rounded-10">
                      <IconPlus />
                    </div>
                  </div>
                  <div
                    v-else
                    class="edui-left-panel__reference-img-container rounded-10"
                  >
                    <span class="left-panel-setting-block__title">参考图</span>
                    <div class="upload-file">
                      <div
                        class="upload-file__upload upload-file__upload--white gda-dropdown-trigger"
                        style="width: 56px; height: 56px"
                      >
                        <svg
                          role="img"
                          aria-label="cloud-upload"
                          focusable="false"
                          data-icon="cloud-upload"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="gd_design_icon gd_design_icon-cloud-upload"
                        >
                          <path
                            d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
            <a-button
              type="primary"
              status="danger"
              @click="baidu_imageUrl = ''"
              class="w-100"
              shape="round"
              v-if="imageUrl"
            >
              <template #icon>
                <icon-delete />
              </template>
              删除图片
            </a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane
          title="意间绘画"
          key="yijian"
          v-if="counter.setting.is_draw_yijian_open == 1"
        >
          <div class="pb-32">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                  >
                    绘画描述
                    <a-tooltip content="意间绘画仅支持中文关键词">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                >
                  <a-textarea
                    v-model="input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    type="textarea"
                    :max-length="2000"
                    show-word-limit
                    allow-clear
                    placeholder="关键词的分割用英文逗号，不要用+ & 等号。，参考形式：画面主体，细节描述，修饰词"
                  />
                  <div
                    class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      position="bottom"
                      auto-fit-position
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
                          <h5>绘画联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出绘图内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="draw_loading"
                            @click="send_ai_draw()"
                            >生成绘图描述
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                    <div class="cursor-pointer ml-1.5" @click="des_send()">
                      <icon-skin />
                      描述咒语
                    </div>
                  </div>
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center overflow-auto flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      v-for="(yj, yj_index) in systemPrompts"
                      :key="yj_index"
                      @click="input2 = yj.value"
                    >
                      {{ yj.text }}
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
                图片比例
                <a-tooltip content="参数释义：生成图片尺寸比例">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-dropdown :popup-max-height="false" class="bili_main">
              <section
                class="w-full p-1 flex-center justify-between bg-white-1 rounded-8 cursor-pointer border hover:border-primary-base transition-border border-transparent"
              >
                <div class="flex-center space-x-20">
                  <div class="flex-center bg-gray-6 w-20 rounded-6 pr-6">
                    <div
                      class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                    >
                      <div
                        class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                        :style="`width:${imageSizes[yijian_bili]?.width}%;height:${imageSizes[yijian_bili]?.height}%`"
                      ></div>
                    </div>
                    <span class="text-gray-2 text-12 font-600">{{
                      imageSizes[yijian_bili]?.text
                    }}</span>
                  </div>
                  <span class="text-gray-2 text-14 font-600">{{
                    imageSizes[yijian_bili]?.title
                  }}</span>
                </div>
              </section>
              <template #content>
                <a-doption
                  v-for="(b, b_index) in imageSizes"
                  @click="yijian_bili = b.value"
                >
                  <div class="w-100 flex justify-content-between p-1">
                    <div class="flex-center rounded-6 w-20 bg-gray-6 mr-6 pl-2">
                      <div
                        class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                      >
                        <div
                          class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                          :style="`width:${b.width}%;height:${b.height}%`"
                        ></div>
                      </div>
                      <span
                        class="text-14 ml-1 mr-3 text-gray-2 font-600 large:text-12 large:mr-0"
                        >{{ b.text }}</span
                      >
                    </div>
                    <span class="text-gray-2 text-14 font-600 left-83">{{
                      b.title
                    }}</span>
                  </div>
                </a-doption>
              </template>
            </a-dropdown>
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                模型选择
                <a-tooltip content="多种模型分类">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-tabs type="line">
              <a-tab-pane title="通用模型" key="normal_model">
                <a-row
                  :gutter="10"
                  class="flex justify-content-center mj_version"
                >
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="yijian_choose(s1.id, 'one')"
                    :class="yijian_id == s1.id ? 'active' : ''"
                    v-for="(s1, s1_index) in styleDetails[0]"
                    :key="s1_index"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>{{ s1.text }}</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        :src="s1.poster"
                      />
                    </button>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane title="动漫模型" key="animate_model">
                <a-row
                  :gutter="10"
                  class="flex justify-content-center mj_version"
                >
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="yijian_choose(s2.id, 'two')"
                    :class="yijian_id == s2.id ? 'active' : ''"
                    v-for="(s2, s2_index) in styleDetails[1]"
                    :key="s2_index"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>{{ s2.text }}</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        :src="s2.poster"
                      />
                    </button>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane title="现实设计" key="life_model">
                <a-row
                  :gutter="10"
                  class="flex justify-content-center mj_version"
                >
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="yijian_choose(s3.id, 'three')"
                    :class="yijian_id == s3.id ? 'active' : ''"
                    v-for="(s3, s3_index) in styleDetails[2]"
                    :key="s3_index"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>{{ s3.text }}</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        :src="s3.poster"
                      />
                    </button>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
        <a-tab-pane
          title="通义万象"
          key="ali"
          v-if="counter.setting.is_draw_ali == 1"
        >
          <div class="pb-32">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                  >
                    绘画描述
                    <a-tooltip content="通义万象绘画支持中英文">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                >
                  <a-textarea
                    v-model="input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    type="textarea"
                    :max-length="75"
                    show-word-limit
                    allow-clear
                    placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                  />
                  <div
                    class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      position="bottom"
                      auto-fit-position
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
                          <h5>绘画联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出绘图内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="draw_loading"
                            @click="send_ai_draw()"
                            >生成绘图描述
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                    <div class="cursor-pointer ml-1.5" @click="des_send()">
                      <icon-skin />
                      描述咒语
                    </div>
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
                      花海女孩
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[1]"
                    >
                      办公室男人
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center justify-between relative">
                <div class="flex-center">
                  <h5
                    class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                  >
                    图片尺寸
                    <a-tooltip content="图片固定高度和宽度生成">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div
                class="flex items-center justify-between space-x-1 flex-wrap aspect"
              >
                <button
                  v-for="(s, s_index) in ali_all_size"
                  :class="ali_size == s.value ? 'active' : ''"
                  @click="change_ali_size(s.value)"
                  class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                >
                  <div
                    class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                  >
                    <div
                      class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                      :style="`width:${s.width}%;height:${s.height}%`"
                    ></div>
                  </div>
                  <p class="mb-1 text-sm text-center">
                    {{ s.label }}
                  </p>
                </button>
              </div>
            </section>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center justify-between relative">
                <div class="flex-center">
                  <h5
                    class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                  >
                    图片数量
                  </h5>
                </div>
              </div>
              <div class="UXmDHLrm">
                <span
                  v-for="(i, i_index) in ali_images_list"
                  :key="i_index"
                  :class="ali_select == i.value ? 'OMJ2YPhL' : ''"
                  @click="change_i_ali(i.value)"
                  >{{ i.name }}</span
                >
              </div>
            </section>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">风格</span>
              <div class="flex-1">
                <a-select
                  v-model="ali_style"
                  class="w-100"
                  @change="ali_style_change"
                >
                  <a-option
                    v-for="(s, s_index) in ali_style_config"
                    :key="s_index"
                    :value="s.value"
                  >
                    {{ s.label }}
                  </a-option>
                </a-select>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          title="混元绘画"
          key="tencent"
          v-if="counter.setting.tencent_draw_open == 1"
        >
          <div class="pb-32">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex"
                  >
                    绘画描述
                    <a-tooltip content="腾讯混元绘画支持中英文">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-prim ary-base transition-border"
                >
                  <a-textarea
                    v-model="input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    type="textarea"
                    :max-length="75"
                    show-word-limit
                    allow-clear
                    placeholder="请用中文输入Prompt，参考形式：画面主体，细节描述，修饰词"
                  />
                  <div
                    class="des_check z-10 flex position-absolute left-2 bottom-3 cursor-pointer"
                  >
                    <a-trigger
                      :popup-translate="[100, 0]"
                      trigger="click"
                      position="bottom"
                      auto-fit-position
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
                          <h5>绘画联想</h5>
                          <a-textarea
                            v-model="draw_ai"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                            type="textarea"
                            allow-clear
                            placeholder="请输入简单的描述，AI将智能输出绘图内容"
                          />
                          <a-button
                            type="primary"
                            class="w-100 mt-2 mb-2"
                            :loading="draw_loading"
                            @click="send_ai_draw()"
                            >生成绘图描述
                          </a-button>
                        </div>
                      </template>
                    </a-trigger>
                    <div class="cursor-pointer ml-1.5" @click="des_send()">
                      <icon-skin />
                      描述咒语
                    </div>
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
                      花海女孩
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = all_prompt[1]"
                    >
                      办公室男人
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <section class="flex flex-col rounded-10 mt-1">
              <div class="mt-2">
                <div class="left-panel-setting-block__header">
                  <div class="left-panel-setting-block__title mt-2 fs-5">
                    风格选择
                    <a-tooltip
                      content="根据你想生成的图片选择对应的风格，效果更佳哦"
                    >
                      <icon-exclamation-circle class="font-18 ml-1" />
                    </a-tooltip>
                  </div>
                </div>
                <a-row :gutter="10" class="mj_version style_choose">
                  <a-col
                    :span="12"
                    class="version-item mb-2"
                    @click="tencent_style_set(1)"
                    :class="tencent_style == 1 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title"><span>不限定</span></div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/tencent-style-1.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="tencent_style_set(2)"
                    :class="tencent_style == 2 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>艺术绘画</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/tencent-style-2.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="tencent_style_set(3)"
                    :class="tencent_style == 3 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>游戏动漫</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/tencent-style-3.png"
                      />
                    </button>
                  </a-col>
                  <a-col
                    :span="12"
                    class="version-item"
                    @click="tencent_style_set(4)"
                    :class="tencent_style == 4 ? 'active' : ''"
                  >
                    <button
                      class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                    >
                      <div
                        class="absolute flex items-center justify-center w-full h-full"
                      >
                        <div class="model-card__title">
                          <span>专业写实</span>
                        </div>
                      </div>
                      <img
                        class="object-cover w-full h-full rounded-xl"
                        src="@/assets/images/tencent-style-4.png"
                      />
                    </button>
                  </a-col>
                </a-row>
              </div>
            </section>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">风格</span>
              <div class="flex-1">
                <a-select
                  v-model="tencent_style_choose"
                  class="w-100"
                  @change="tencent_style_choose_change"
                >
                  <a-option
                    v-for="(s, s_index) in tencent_categories[tencent_style - 1]
                      .styles"
                    :key="s_index"
                    :value="s.code"
                  >
                    {{ s.name }}
                  </a-option>
                </a-select>
              </div>
            </div>
            <section class="flex flex-col rounded-10 p-3 bg-gray-7 mt-3">
              <div class="flex-center justify-between relative">
                <div class="flex-center">
                  <h5
                    class="mb-3 left-panel-setting-block__title font-14 text-gray-2 mr-4 flex justify-between"
                  >
                    图片尺寸
                    <a-tooltip content="图片固定高度和宽度生成">
                      <icon-exclamation-circle />
                    </a-tooltip>
                  </h5>
                </div>
              </div>
              <div
                class="flex items-center justify-between space-x-1 flex-wrap aspect"
              >
                <button
                  v-for="(s, s_index) in tencent_all_size"
                  :class="tencent_size == s.value ? 'active' : ''"
                  @click="change_tencent_size(s.value)"
                  class="flex-1 border-2 rounded aspect-item dark:border-neutral-700 mb-1"
                >
                  <div
                    class="flex items-center justify-center w-5 h-5 mx-auto my-2 aspect-box-wrapper"
                  >
                    <div
                      class="border-2 border-gray-600 rounded aspect-box dark:border-neutral-700"
                      :style="`width:${s.width}%;height:${s.height}%`"
                    ></div>
                  </div>
                  <p class="mb-1 text-sm text-center">
                    {{ s.label }}
                  </p>
                </button>
              </div>
            </section>
          </div>
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <div class="bg-white z-10 w-full h-110 bg-white-1">
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
            消耗{{ counter.setting.money_name_set }}：{{
              activeDraw == "midj" ? mj_midj : ai_draw_pay
            }}/次
          </div>
          <a-button
            :loading="draw_loading"
            v-if="activeDraw == 'gpt'"
            @click="ai_draw()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'dream'"
            @click="ai_draw_dreams()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'midj'"
            @click="midj_ai_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'baidu'"
            @click="baidu_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'yijian'"
            @click="yijian_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'ali'"
            @click="ali_draw_send()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
          <a-button
            :loading="draw_loading"
            v-else-if="activeDraw == 'tencent'"
            @click="ai_draw_tencent()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始绘图
          </a-button>
        </div>
      </template>
    </a-drawer>
    <a-modal
      v-model:visible="beizhu_info"
      title="公开标题名称"
      @ok="handle_send"
    >
      <a-spin :loading="pub_loading">
        <template #icon>
          <div class="flex justify-center">
            <svg
              class="arco-icon-loading"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z"
                fill="url(#svg_2fc1cd5fdf__paint0_linear_118545_226288)"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z"
                fill="url(#svg_2fc1cd5fdf__paint1_linear_118545_226288)"
              ></path>
              <defs>
                <linearGradient
                  id="svg_2fc1cd5fdf__paint0_linear_118545_226288"
                  x1="13.215"
                  y1="6.907"
                  x2="10.715"
                  y2="16.282"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#1765FF"></stop>
                  <stop
                    offset=".031"
                    stop-color="#1765FF"
                    stop-opacity=".969"
                  ></stop>
                  <stop offset="1" stop-color="#1765FF" stop-opacity="0"></stop>
                </linearGradient>
                <linearGradient
                  id="svg_2fc1cd5fdf__paint1_linear_118545_226288"
                  x1="-.574"
                  y1="9.566"
                  x2="18.802"
                  y2="13.316"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#ADC9FF"></stop>
                  <stop offset="1" stop-color="#8AB1FF" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </template>
        <h6>作品名称</h6>
        <a-input v-model="beizhu" placeholder="请定义要展示的作品名称" />
        <h6 class="mt-3">分类</h6>
        <a-select v-model="fenlei" placeholder="请选择分类" multiple>
          <a-option
            v-for="(cate, c_index) in fenlei_list"
            :key="c_index"
            :value="cate.id"
            :label="cate.title"
          />
        </a-select>
        <h6 class="mt-3">查看耗费{{ counter.setting.money_name_set }}</h6>
        <a-input-number
          v-model="cost"
          :placeholder="'需要花费多少' + counter.setting.money_name_set"
        />
        <h6 class="mt-3">会员免费查看</h6>
        <a-select v-model="vip_choose" placeholder="请选择会员组" multiple>
          <a-option
            v-for="(vip, vip_index) in vip_list"
            :key="vip_index"
            :value="vip.id"
            :label="vip.title"
          />
        </a-select>
      </a-spin>
    </a-modal>

    <a-modal v-model:visible="des_dialog" class="des_dialog" title="描述咒语">
      <div class="des_form flex">
        <a-tabs position="left" class="w-50">
          <a-tab-pane
            v-for="(des, des_index) in des_all"
            :key="des_index"
            :title="des.title"
          >
            <a-space class="flex-wrap">
              <a-button
                class="mt-2 mb-2"
                v-for="(des_t, des_t_index) in des.curses"
                :key="des_t_index"
                @click="add_content(des_t.en_title)"
              >
                {{ des_t.title }}
              </a-button>
            </a-space>
            <div class="child_cate" v-if="des.children.length > 0">
              <div
                class="child_cate_for mb-2"
                v-for="(desc_c, desc_index) in des.children"
                :key="desc_index"
              >
                <h6 class="font-bold">{{ desc_c.title }}</h6>
                <a-space class="flex-wrap block">
                  <a-button
                    class="mt-2 mb-2"
                    v-for="(des_two, des_two_index) in desc_c.curses"
                    :key="des_two_index"
                    @click="add_content(des_two.en_title)"
                  >
                    {{ des_two.title }}
                  </a-button>
                </a-space>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
        <div class="content">
          <a-textarea
            v-model="input2"
            :auto-size="{ minRows: 10, maxRows: 10 }"
            type="textarea"
            allow-clear
            placeholder="请用英文输入Prompt，参考形式：画面主体，细节描述，修饰词"
          />
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model:visible="region_dialog"
      @ok="region_midjourney()"
      okText="提交"
      class="region_dialog"
      title="局部重绘"
    >
      <div class="h-full">
        <div class="image-region" @contextmenu.prevent>
          <img ref="$imgRef" :src="region_src" />
          <canvas
            ref="$canvasRef"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
          />
        </div>
        <a-space class="actions mt-2">
          <a-button @click="undoLastDraw">撤回</a-button>
          <a-button @click="clearAll">清空画布</a-button>
        </a-space>
        <a-input class="mt-2" v-model="region_title"></a-input>
      </div>
    </a-modal>
    <Login :login_dialog="login_dialog" @handleCancel="handleCancel" />

    <!-- Feedback Modal -->
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
import { ref, onMounted, nextTick } from "vue";
import FeedbackModal from "~/components/chat/FeedbackModal.vue";
import { useCounter } from "~/store/counter";
definePageMeta({
  middleware: ["mustlogin"],
});
const counter = useCounter();

import {
  IconMenuUnfold,
  IconImage,
  IconCloud,
  IconDelete,
  IconPlus,
  IconTranslate,
  IconExclamationCircle,
  IconRefresh,
  IconDice,
  IconPalette,
  IconSkin,
  IconRelation,
  IconLanguage,
  IconCaretRight,
  IconCaretLeft,
  IconEdit,
  IconDownload,
  IconLock,
  IconUnlock,
  IconThumbUp,
  IconHeart,
  IconSelectAll,
  IconUser,
  IconCommand,
} from "@arco-design/web-vue/es/icon";

useHead({
  title: "AI绘画 - " + counter.setting.title,
  meta: [
    { name: "description", content: counter.setting.description },
    { name: "keywords", content: counter.setting.keywords },
  ],
});

import { Message } from "@arco-design/web-vue";
import { ai_draw_fluxs, region_dialog_open } from "~/utils/api";
import { useCookie } from "nuxt/app";
import { submitMessageReport } from "~/api/api";
const isFeedbackModalOpen = ref(false);
const feedbackType = ref("");
const selectedReportableId = ref(null);
const modelKey = ref("ai_draw");
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
      reportable_type: "ImageGeneration",
      ai_function: "ai_draw",
      user_id: user_info.value.id || null,
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
const onSuccess = () => {
  console.log("success");
};
const drawer = ref(false);
const change_drawer = () => {
  drawer.value = true;
};
const user_balance = ref(0);
const user_id = ref(0);
const get_user_balance = () => {
  get_siwei_limit().then((res) => {
    user_balance.value = res._rawValue.data;
    user_id.value = res._rawValue.us_id;
  });
};

const actions = counter.setting.APP_URL + "/api/upload_miji";
const imageUrl = ref("");
const deletePic = () => {
  imageUrl.value = "";
};
const midj_check_radio = ref("basic_do");
const beforeUpload = (file: any) => {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 15;

  if (!isJPG && !isPNG) {
    Message.error("上传图片只能是 JPG/PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    Message.error("上传图片大小不能超过 15MB!");
    return false;
  }
  return true;
};
const handleGme = (tab: any) => {
  activeName.value = tab;
};
const cref_image = ref("");
const picSuccess = (currentFile: any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  imageUrl.value = currentFile.response.data;
};

const picSuccessCref = (currentFile: any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  cref_image.value = currentFile.response.data;
};

const cw = ref(0);

const deletePicCref = () => {
  cref_image.value = "";
};

const text_imageUrl = ref("");
const TextSuccess = (currentFile) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  text_imageUrl.value = currentFile.response.data;
};

const baidu_imageUrl = ref("");
const BaiduSuccess = (currentFile) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  baidu_imageUrl.value = currentFile.response.data;
};
const activeDraw = ref("gpt");
const onError = () => {
  console.log("error");
};
const check_activeDraw = () => {
  if (counter.setting.is_open_normal_draw == 1) {
    activeDraw.value = "gpt";
  } else if (counter.setting.midjourney_is_open == 1) {
    activeDraw.value = "midj";
  } else if (counter.setting.is_draw_baidu_open == 1) {
    activeDraw.value = "baidu";
  } else if (counter.setting.is_draw_yijian_open == 1) {
    activeDraw.value = "yijian";
  } else if (counter.setting.is_draw_ali == 1) {
    activeDraw.value = "ali";
  } else if (counter.setting.tencent_draw_open == 1) {
    activeDraw.value = "tencent";
  }
};
check_activeDraw();
const user_info = useCookie("user_info");
const input2 = ref("");
const size = ref("1024x1024");
const image_select = ref(1);
const srcList = ref([]);
const pub_srcList = ref([]);
const mj_midj = ref(0);
const des_dialog = ref(false);
const des_all = ref([]);
const des_send = () => {
  des_dialog.value = true;
  get_curse()
    .then((res: any) => {
      des_all.value = res._rawValue.data;
    })
    .catch((err: any) => {
      Message.error(err);
    });
};
const add_content = (content: any) => {
  if (input2.value == "") {
    input2.value = content;
  } else {
    input2.value += " " + content;
  }
};
const all_size = [
  {
    label: "1024x1024",
    value: "1024x1024",
    width: 100,
    height: 100,
  },
  {
    label: "1792x1024",
    value: "1792x1024",
    width: 125,
    height: 75,
  },
  {
    label: "1024x1792",
    value: "1024x1792",
    width: 75,
    height: 125,
  },
];
const baidu_all_size = [
  {
    label: "640x360",
    value: "640x360",
    width: 100,
    height: 70,
  },
  {
    label: "512x512",
    value: "512x512",
    width: 100,
    height: 100,
  },
  {
    label: "360x640",
    value: "360x640",
    width: 70,
    height: 100,
  },
  {
    label: "1024x1024",
    value: "1024x1024",
    width: 125,
    height: 125,
  },
  {
    label: "1280x720",
    value: "1280x720",
    width: 100,
    height: 95,
  },
  {
    label: "720x1280",
    value: "720x1280",
    width: 125,
    height: 125,
  },
];
const ali_size = ref("1024*1024");
const ali_all_size = [
  {
    label: "1024x1024",
    value: "1024*1024",
    width: 125,
    height: 125,
  },
  {
    label: "1280x720",
    value: "1280*720",
    width: 100,
    height: 95,
  },
  {
    label: "720x1280",
    value: "720*1280",
    width: 125,
    height: 125,
  },
];

const tencent_all_size = [
  // 768:768（1:1）、768:1024（3:4）、1024:768（4:3）、1024:1024（1:1）、720:1280（9:16）、1280:720（16:9）、768:1280（3:5）、1280:768（5:3）、1080:1920（9:16）、1920:1080（16:9）
  {
    label: "768x768",
    value: "768:768",
    width: 100,
    height: 100,
  },
  {
    label: "768x1024",
    value: "768:1024",
    width: 75,
    height: 100,
  },
  {
    label: "1024x768",
    value: "1024:768",
    width: 100,
    height: 75,
  },
  {
    label: "1024x1024",
    value: "1024:1024",
    width: 100,
    height: 100,
  },
  {
    label: "720x1280",
    value: "720:1280",
    width: 75,
    height: 100,
  },
  {
    label: "1280x720",
    value: "1280:720",
    width: 100,
    height: 75,
  },
  {
    label: "768x1280",
    value: "768:1280",
    width: 75,
    height: 100,
  },
  {
    label: "1280x768",
    value: "1280:768",
    width: 100,
    height: 75,
  },
  {
    label: "1080x1920",
    value: "1080:1920",
    width: 75,
    height: 100,
  },
  {
    label: "1920x1080",
    value: "1920:1080",
    width: 100,
    height: 75,
  },
];
const change_ali_size = (size: any) => {
  ali_size.value = size;
};
const right_sout = ref(false);
const images_list = ref([
  {
    name: "1",
    value: 1,
  },
  {
    name: "2",
    value: 2,
  },
  {
    name: "3",
    value: 3,
  },
  {
    name: "4",
    value: 4,
  },
  {
    name: "5",
    value: 5,
  },
  {
    name: "6",
    value: 6,
  },
  {
    name: "7",
    value: 7,
  },
  {
    name: "8",
    value: 8,
  },
]);
const ali_select = ref(1);
const ali_style = ref("<auto>");
const ali_style_config = [
  // {
  //   label: '摄影',
  //   value: '<photography>'
  // },
  // {
  //   label: '人像写真',
  //   value: '<portrait>'
  // },
  {
    label: "默认",
    value: "<auto>",
  },
  {
    label: "3D卡通",
    value: "<3d cartoon>",
  },
  {
    label: "动画",
    value: "<anime>",
  },
  {
    label: "油画",
    value: "<oil painting>",
  },
  {
    label: "水彩",
    value: "<watercolor>",
  },
  {
    label: "素描",
    value: "<sketch>",
  },
  {
    label: "中国画",
    value: "<chinese painting>",
  },
  {
    label: "扁平插画",
    value: "<flat illustration>",
  },
];
const ali_style_change = (style: any) => {
  ali_style.value = style;
};
const ali_images_list = ref([
  {
    name: "1",
    value: 1,
  },
  {
    name: "2",
    value: 2,
  },
  {
    name: "3",
    value: 3,
  },
  {
    name: "4",
    value: 4,
  },
]);
const change_i_ali = (i: any) => {
  ali_select.value = i;
};
const prompt_info = ref("A cute cat is in the bushes");
const all_prompt = [
  "A cute cat is in the bushes",
  "PPT background, soft gold gradient lines, elegant, noble, understated, gentle, silky",
  "a man standing on top of a snow covered mountain, by Werner Andermatt, trending on pexels, romanticism, sunset in the clouds, panoramic widescreen view",
  "a red and blue light streaks through a black background, digital art, shutterstock, light and space, blue and pin,Symmetrical composition, driving fast,8k resolution,uhd image",
];
const handleClick = (tab: any) => {
  activeDraw.value = tab;
};
onMounted(() => {
  if (counter.setting.is_draw_yijian_open == 1) {
    get_yijian();
  }
});
const choose_bili = ref(1);
const version = ref(1);
const version_me = ref(6.1);
const version_nj = ref(6);
const mj_row = ref(false);
const pic_select = ref(3);
const chaos = ref(0);
const style = ref(100);
const is_pic = ref(true);
const niji_style = ref(1);
const tencent_style = ref(1);
const tencent_style_choose = ref("000");
const tencent_size = ref("768:768");
const change_tencent_size = (size: any) => {
  tencent_size.value = size;
};
const tencent_style_choose_change = (style: any) => {
  tencent_style_choose.value = style;
};

const tencent_style_set = (style: any) => {
  tencent_style.value = style;
  tencent_style_choose.value =
    tencent_categories.value[style - 1].styles[0].code;
};

const tencent_categories = ref([
  {
    name: "不限定风格",
    styles: [{ name: "不限定风格", code: "000" }],
  },
  {
    name: "艺术绘画类",
    styles: [
      { name: "水墨画", code: "101" },
      { name: "概念艺术", code: "102" },
      { name: "油画1", code: "103" },
      { name: "油画2（梵高）", code: "118" },
      { name: "水彩画", code: "104" },
      { name: "像素画", code: "105" },
      { name: "厚涂风格", code: "106" },
      { name: "插图", code: "107" },
      { name: "剪纸风格", code: "108" },
      { name: "印象派1（莫奈）", code: "109" },
      { name: "印象派2", code: "119" },
      { name: "2.5D", code: "110" },
      { name: "古典肖像画", code: "111" },
      { name: "黑白素描画", code: "112" },
      { name: "赛博朋克", code: "113" },
      { name: "科幻风格", code: "114" },
      { name: "暗黑风格", code: "115" },
      { name: "3D", code: "116" },
      { name: "蒸汽波", code: "117" },
    ],
  },
  {
    name: "游戏动漫类",
    styles: [
      { name: "日系动漫", code: "201" },
      { name: "怪兽风格", code: "202" },
      { name: "唯美古风", code: "203" },
      { name: "复古动漫", code: "204" },
      { name: "游戏卡通手绘", code: "301" },
    ],
  },
  {
    name: "专业写实类",
    styles: [{ name: "通用写实风格", code: "401" }],
  },
]);

const mj_version = [
  {
    value: 6.1,
    label: "6.1",
  },
  {
    value: 6.0,
    label: "6",
  },
  {
    value: 5.2,
    label: "5.2",
  },
  {
    value: 5.1,
    label: "5.1",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 4,
    label: "4",
  },
];
const nj_version = [
  {
    value: 6,
    label: "6",
  },
  {
    value: 5,
    label: "5",
  },
];

const pic_quality = [
  {
    label: "一般",
    value: 1,
  },
  {
    label: "清晰",
    value: 2,
  },
  {
    label: "高清",
    value: 3,
  },
  {
    label: "超高清",
    value: 4,
  },
];
const xPos = ref(0);
const change_s = (s_v: any, x: any) => {
  style.value = s_v;
  xPos.value = x;
};
const niji_style_v = [
  {
    label: "默认",
    value: 1,
  },
  {
    label: "可爱",
    value: 2,
  },
  {
    label: "丰富",
    value: 3,
  },
  {
    label: "风景",
    value: 4,
  },
];
const bili = [
  {
    name: "1:1",
    value: 1,
    width: 100,
    height: 100,
    title: "头像图",
  },
  {
    name: "4:3",
    value: 2,
    width: 100,
    height: 75,
    title: "媒体配图",
  },
  {
    name: "3:4",
    value: 3,
    width: 75,
    height: 100,
    title: "媒体配图",
  },
  {
    name: "16:9",
    value: 4,
    width: 100,
    height: 57,
    title: "电脑壁纸",
  },
  {
    name: "9:16",
    value: 5,
    width: 57,
    height: 100,
    title: "海报展示",
  },
];
const flux_num_inference_steps = ref(100);
const flux_size = ref("1024x1024");
const change_flux_size = (size: any) => {
  flux_size.value = size;
};
const flux_all_size = [
  {
    label: "1024x1024",
    value: "1024x1024",
    width: 100,
    height: 100,
  },
  {
    label: "512x1024",
    value: "512x1024",
    width: 50,
    height: 100,
  },
  {
    label: "768x512",
    value: "768x512",
    width: 75,
    height: 50,
  },
  {
    label: "768x1024",
    value: "768x1024",
    width: 75,
    height: 100,
  },
  {
    label: "1024x576",
    value: "1024x576",
    width: 100,
    height: 60,
  },
  {
    label: "576x1024",
    value: "576x1024",
    width: 60,
    height: 100,
  },
];
const change_prompt = () => {
  // 数组中all_prompt随机拿数据改变prompt_info并且判断不和上一次一样
  let random = Math.floor(Math.random() * all_prompt.length);
  if (input2.value == all_prompt[random]) {
    change_prompt();
  } else {
    input2.value = all_prompt[random];
  }
};
const download_draw = (imgsrc: any) => {
  // 下载当前图片
  const image = new Image();
  image.src = imgsrc;
  image.onload = function () {
    const a = document.createElement("a");
    a.href = imgsrc;
    a.download = "picture";
    a.click();
  };
};
const baidu_size = ref("640x360");
const change_size = (s_v: string) => {
  size.value = s_v;
};
const yijian_list = ref([]);
const imageSizes = ref([]);
const stableArtists = ref([]);
const styleDetails = ref([]);
const systemPrompts = ref([]);

const yijian_bili = ref(0);
const yijian_version = ref(0);
const yijian_guide_scale = ref(0);
const yijian_engine = ref("");
const yijian_id = ref(0);
const get_yijian = () => {
  get_draw_selector()
    .then((res: any) => {
      yijian_list.value = res._rawValue.data;
      imageSizes.value = res._rawValue.data.imageSizes;
      stableArtists.value = res._rawValue.data.stableArtists;
      styleDetails.value = res._rawValue.styleDetails;
      systemPrompts.value = res._rawValue.data.systemPrompts;
    })
    .catch((err: any) => {
      console.log(err);
    });
};
const yijian_task = ref();
const yijian_draw_send = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;
  run_yijian_ai({
    prompt: input2.value,
    ratio: yijian_bili.value,
    style: yijian_version.value,
    guide_scale: yijian_guide_scale.value,
    engine: yijian_engine.value,
  })
    .then((res: any) => {
      Message.success("任务提交成功");
      get_me_d();
      yijian_task.value = setInterval(() => {
        yijian_draw_check(res._rawValue.data);
      }, 5000);
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};
const yijian_draw_check = (task_id: any) => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }

  draw_loading.value = true;
  yijian_draw_info({
    uuid: task_id,
    prompt: input2.value,
  })
    .then((res: any) => {
      if (res._rawValue.status == 200) {
        clearInterval(yijian_task.value);
        yijian_task.value = null;
        is_finish.value = true;
        is_sc.value = false;
        get_me_d();
        draw_loading.value = false;
        for (let i = 0; i < res._rawValue.data.length; i++) {
          r_images.value.push(res._rawValue.data[i]);
          clearInterval(yijian_task.value);
        }
      }
    })
    .catch((err: any) => {
      clearInterval(yijian_task.value);
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};
const yijian_choose = (sid: any, type: any) => {
  if (type == "one") {
    // 找到styleDetails[0]中的id匹配相关数据
    for (let i = 0; i < styleDetails.value[0].length; i++) {
      if (styleDetails.value[0][i].id == sid) {
        yijian_id.value = styleDetails.value[0][i].id;
        yijian_version.value = styleDetails.value[0][i].value;
        yijian_guide_scale.value = styleDetails.value[0][i].default_guide_scale;
        yijian_engine.value = styleDetails.value[0][i].engine;
        break;
      }
    }
  } else if (type == "two") {
    for (let i = 0; i < styleDetails.value[1].length; i++) {
      if (styleDetails.value[1][i].id == sid) {
        yijian_id.value = styleDetails.value[1][i].id;
        yijian_version.value = styleDetails.value[1][i].value;
        yijian_guide_scale.value = styleDetails.value[1][i].default_guide_scale;
        yijian_engine.value = styleDetails.value[1][i].engine;
        break;
      }
    }
  } else {
    for (let i = 0; i < styleDetails.value[2].length; i++) {
      if (styleDetails.value[2][i].id == sid) {
        yijian_id.value = styleDetails.value[2][i].id;
        yijian_version.value = styleDetails.value[2][i].value;
        yijian_guide_scale.value = styleDetails.value[2][i].default_guide_scale;
        yijian_engine.value = styleDetails.value[2][i].engine;
        break;
      }
    }
  }
};

const change_baidu_size = (s_v: string) => {
  baidu_size.value = s_v;
};
const change_i = (i_v: number) => {
  image_select.value = i_v;
};
const r_images = ref([]);
const draw_loading = ref(false);
const is_sc = ref(false);
const is_finish = ref(false);
const activeName = ref("first");
const me_draw = ref([]);
const public_draw = ref([]);

const change_draw = (v: string) => {
  activeDraw.value = v;
};
const login_dialog = ref(false);

const handleCancel = () => {
  login_dialog.value = false;
};

const ai_draw = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;

  ai_draw_openai({
    prompt: input2.value,
    size: size.value,
    number: 1,
  })
    .then((res: any) => {
      is_finish.value = true;
      is_sc.value = false;
      Message.success("生成成功");
      get_me_d();
      draw_loading.value = false;
      for (let i = 0; i < res._rawValue.data.length; i++) {
        r_images.value.push(res._rawValue.data[i]);
      }
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      is_finish.value = false;
      draw_loading.value = false;
    });
};

const ai_draw_flux = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;

  ai_draw_fluxs({
    prompt: input2.value,
    size: flux_size.value,
    num_inference_steps: flux_num_inference_steps.value,
    guidance_scale: 7.5,
  })
    .then((res: any) => {
      is_finish.value = true;
      is_sc.value = false;
      Message.success("生成成功");
      get_me_d();
      draw_loading.value = false;
      for (let i = 0; i < res._rawValue.data.length; i++) {
        r_images.value.push(res._rawValue.data[i]);
      }
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      is_finish.value = false;
      draw_loading.value = false;
    });
};

const ai_draw_tencent = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;

  tencent_draw({
    prompt: input2.value,
    size: tencent_size.value,
    style: tencent_style_choose.value,
    number: 1,
  })
    .then((res: any) => {
      is_finish.value = true;
      is_sc.value = false;
      Message.success("生成成功");
      get_me_d();
      draw_loading.value = false;
      r_images.value.push(res._rawValue.data);
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      is_finish.value = false;
      draw_loading.value = false;
    });
};
const baidu_task = ref();
const baidu_draw_send = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;
  baidu_draw_go({
    prompt: input2.value,
    number: image_select.value,
    size: baidu_size.value,
    image_url: baidu_imageUrl.value,
  })
    .then((res: any) => {
      Message.success("任务提交成功");
      get_me_d();
      baidu_task.value = setInterval(() => {
        baidu_draw_check(res._rawValue.data, res._rawValue.number);
      }, 10000);
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};

const baidu_draw_check = (task_id: any, numbers: any) => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  draw_loading.value = true;
  baidu_draw_info({
    task_id: task_id,
    number: numbers,
    prompt: input2.value,
  })
    .then((res: any) => {
      if (res._rawValue.status == 200) {
        clearInterval(baidu_task.value);
        is_finish.value = true;
        is_sc.value = false;
        get_me_d();
        draw_loading.value = false;
        for (let i = 0; i < res._rawValue.data.length; i++) {
          r_images.value.push(res._rawValue.data[i]);
          clearInterval(baidu_task.value);
        }
      }
    })
    .catch((err: any) => {
      clearInterval(baidu_task.value);
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};

const ali_task = ref();
const ali_draw_send = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;
  ali_draw_go({
    prompt: input2.value,
    number: ali_select.value,
    size: ali_size.value,
    style: ali_style.value,
  })
    .then((res: any) => {
      Message.success("任务提交成功");
      get_me_d();
      ali_task.value = setInterval(() => {
        ali_draw_check(res._rawValue.data, res._rawValue.number);
      }, 10000);
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};

const ali_draw_check = (task_id: any, numbers: any) => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  draw_loading.value = true;
  ali_draw_info({
    task_id: task_id,
    number: numbers,
    prompt: input2.value,
  })
    .then((res: any) => {
      if (res._rawValue.status == 200) {
        clearInterval(ali_task.value);
        is_finish.value = true;
        is_sc.value = false;
        get_me_d();
        draw_loading.value = false;
        for (let i = 0; i < res._rawValue.data.length; i++) {
          r_images.value.push(res._rawValue.data[i]);
          clearInterval(ali_task.value);
        }
      }
    })
    .catch((err: any) => {
      clearInterval(ali_task.value);
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};

const ai_draw_pay = ref("0");
const me_draw_count = ref(0);
const public_draw_count = ref(0);
const me_page = ref(1);
const public_page = ref(1);
const me_page_size = ref(8);
const public_page_size = ref(16);
const ske_loading = ref(false);
const token = useCookie("token");

const check_time = ref(false);
const time_set = ref();
const get_me_d = () => {
  clearInterval(time_set.value);
  srcList.value = [];
  get_me_draw({
    page: me_page.value,
    limit: me_page_size.value,
  })
    .then((res: any) => {
      me_draw.value = res._rawValue.data;
      me_draw_count.value = res._rawValue.count;
      ai_draw_pay.value = res._rawValue.dw_m;
      mj_midj.value = res._rawValue.mj_m;
      for (let i = 0; i < me_draw.value.length; i++) {
        if (
          me_draw.value[i].progress != 100 &&
          me_draw.value[i].type == "midjourney"
        ) {
          check_time.value = true;
          break;
        } else {
          check_time.value = false;
        }
      }

      if (check_time.value) {
        time_set.value = setTimeout(() => {
          get_me_d();
        }, 3000);
      }
      for (let i = 0; i < me_draw.value.length; i++) {
        srcList.value.push(me_draw.value[i].image);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
if (token.value) {
  get_me_d();
}

const visible1 = ref(false);
const onDownLoad = (imgsrc: any) => {
  // 下载当前图片
  const image = new Image();
  image.src = imgsrc;
  image.onload = function () {
    const a = document.createElement("a");
    a.href = imgsrc;
    a.download = "图片";
    a.click();
  };
};
const beizhu = ref("");
const beizhu_info = ref(false);
const beizhu_id = ref(0);
const fenlei_list = ref([]);
const fenlei = ref();
const vip_list = ref([]);
const vip_choose = ref();
const pub_loading = ref(false);
const send_pub = (c: number, mid: number) => {
  if (c == 0) {
    pub_loading.value = true;
    beizhu_info.value = true;
    beizhu_id.value = mid;
    draw_cate_me({
      id: mid,
    })
      .then((res: any) => {
        fenlei_list.value = res._rawValue.data;
        fenlei.value = res._rawValue.cate_id;
        vip_list.value = res._rawValue.vip;
        pub_loading.value = false;
      })
      .catch((err: any) => {
        pub_loading.value = false;
        console.log(err);
      });

    for (let i = 0; i < me_draw.value.length; i++) {
      if (me_draw.value[i].id == mid) {
        beizhu.value = me_draw.value[i].name;
      }
    }
  } else {
    send_public({
      draw_id: mid,
    })
      .then((res: any) => {
        Message.success(res._rawValue.message);
        console.log(mid);
        get_me_d();
        get_choose_index(mid);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
const load_more_loading = ref(false);
const columnCount = ref(4);

const get_my_like = () => {
  load_more_loading.value = true;
  get_draw_like({
    page: public_page.value,
    limit: public_page_size.value,
  })
    .then((res: any) => {
      public_draw.value = res._rawValue.data;
      public_draw_count.value = res._rawValue.count;
      load_more_loading.value = false;
    })
    .catch((err: any) => {
      console.log(err);
      load_more_loading.value = false;
    });
};

const load_more = () => {
  public_page_size.value += 20;
  get_my_like();
};
const cost = ref();

const handle_send = () => {
  if (beizhu.value == "") {
    Message.error("请输入名称");
    return false;
  }
  if (fenlei.value == "") {
    Message.error("请选择分类");
    return false;
  }
  send_public({
    draw_id: beizhu_id.value,
    name: beizhu.value,
    cost: cost.value,
    vip_set: JSON.stringify(vip_choose.value),
    cate: JSON.stringify(fenlei.value),
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      get_choose_index(beizhu_id.value);
      get_me_d();
      beizhu_info.value = false;
    })
    .catch((err: any) => {
      console.log(err);
    });
};
if (token.value) {
  get_user_balance();
  get_my_like();
}
const get_info = (name: string) => {
  if (input2.value == "") {
    input2.value = name;
  } else {
    input2.value = input2.value + "，" + name;
  }
};
const {
  public: { baseUrl },
} = useRuntimeConfig();
const headers = {
  Authorization: `Bearer ${token.value}`,
  Accept: "text/event-stream",
};
const streams = ref();
const last_content = ref("");
const draw_ai = ref("");
const delete_draw_nofinish = () => {
  del_draw_nofinish()
    .then((res: any) => {
      Message.success(res._rawValue.message);
      get_me_d();
    })
    .catch((err: any) => {
      Message.error(err);
    });
};
const isInvalidJSON = (data: string) => {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
};
const send_ai_draw = async () => {
  if (draw_ai.value == "") {
    Message.error("请输入内容");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  input2.value = "";
  last_content.value = "";
  draw_loading.value = true;
  const res = await fetch(`${window.APP_CONFIG.baseUrl}draw_ai_send`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      content: draw_ai.value,
      type: "draw_ai",
    }),
  });

  if (res.status == 500) {
    draw_loading.value = false;
    Message.error("服务器错误");
    return false;
  }
  if (res.status == 401) {
    draw_loading.value = false;
    Message.error("请先登录");
    return false;
  }
  if (res.status == 402) {
    draw_loading.value = false;
    Message.error("发送次数已达上限或余额不足");
    return false;
  }
  if (res.status == 403) {
    draw_loading.value = false;
    Message.error("禁止发送违禁词");
    return false;
  }
  let partialData = "";
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        Message.error(json.error.message);
        return; // 或者进行其他错误处理
      }
      return;
    }
    const lines = (partialData + chunk).split("\n");

    partialData = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "data: [DONE]") {
        // 如果是最后一行，跳过处理
        continue;
      }

      try {
        const trimmedLine = line.trim(); // 去除行首尾的空格
        if (trimmedLine.startsWith("data:")) {
          const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
          const json = JSON.parse(jsonData);
          if (json.choices) {
            for (const choice of json.choices) {
              const content = choice.delta?.content;
              if (content) {
                last_content.value += content;
                input2.value = last_content.value;
              }
              if (choice.finish_reason === "stop") {
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const read = async () => {
    const result = await stream?.read();
    if (result?.done) {
      draw_loading.value = false;
      draw_ai.value = "";
    } else {
      onData(result!);
      await read();
    }
  };
  await read();
};
// translate send
const translate = async () => {
  if (input2.value == "") {
    Message.error("请输入内容");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  last_content.value = "";
  draw_loading.value = true;
  const res = await fetch(`${window.APP_CONFIG.baseUrl}draw_ai_translate`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      content: input2.value,
      type: "draw_fanyi",
    }),
  });

  if (
    res.status == 500 ||
    res.status == 401 ||
    res.status == 405 ||
    res.status == 402 ||
    res.status == 403
  ) {
    const responseData = await res.json();
    draw_loading.value = false;
    Message.error(responseData.message);
    return false;
  }

  let partialData = "";
  input2.value = "";
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        input2.value = json.error.message;
        return; // 或者进行其他错误处理
      }
      return;
    }
    const lines = (partialData + chunk).split("\n");

    partialData = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "data: [DONE]") {
        // 如果是最后一行，跳过处理
        continue;
      }

      try {
        const trimmedLine = line.trim(); // 去除行首尾的空格
        if (trimmedLine.startsWith("data:")) {
          const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
          const json = JSON.parse(jsonData);
          if (json.choices) {
            for (const choice of json.choices) {
              const content = choice.delta?.content;
              if (content) {
                input2.value += content;
              }
              if (choice.finish_reason === "stop") {
                break;
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const read = async () => {
    const result = await stream?.read();
    if (result?.done) {
      draw_loading.value = false;
    } else {
      onData(result!);
      await read();
    }
  };
  await read();
};

const value_height = ref(0);
const value_width = ref(0);

const ai_draw_dreams = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  is_sc.value = true;
  draw_loading.value = true;
  ai_draw_dream({
    prompt: input2.value,
    size: size.value,
    number: image_select.value,
    height: value_height.value,
    width: value_width.value,
  })
    .then((res: any) => {
      is_finish.value = true;
      is_sc.value = false;
      Message.success("生成成功");
      get_me_d();
      draw_loading.value = false;
      for (let i = 0; i < res._rawValue.data.length; i++) {
        r_images.value.push(res._rawValue.data[i]);
      }
    })
    .catch((err: any) => {
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};
const infoLoading = ref(false);
const now_draw = ref("");
const now_draw_id = ref(0);
const now_draw_time = ref();
const now_draw_title_arr = ref([]);
const get_choose_index = (id: any) => {
  is_finish.value = false;
  is_sc.value = false;
  get_index_draw({
    id: id,
  })
    .then((res: any) => {
      now_draw.value = res._rawValue.data;
      if (now_draw.value.progress != 100) {
        now_draw_time.value = setTimeout(() => {
          get_choose_index(id);
        }, 3000);
      }
      // 将now_draw.title里的\n\n分割为每个数组
      now_draw_title_arr.value = now_draw.value.title.split("\n\n");
    })
    .catch((err: any) => {
      console.log(err);
    });
};

const seed = ref(0);
// midj
const midj_ai_draw_send = () => {
  if (input2.value == "") {
    Message.error("请填写关键词");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    return false;
  }
  input2.value = input2.value.replace(/\n/g, "");
  input2.value = input2.value.replace(/\s+/g, " ");
  draw_loading.value = true;
  if (is_pic.value == false) {
    midj_ai_draw({
      prompt: input2.value,
    })
      .then((res: any) => {
        get_choose_index(res._rawValue.id);
        midj_ai_draw_check(res._rawValue.prompt_id);
        Message.success("提交成功");
        draw_loading.value = false;
        get_me_d();
      })
      .catch((err: any) => {
        Message.error("提交失败");
        is_sc.value = false;
        draw_loading.value = false;
      });
  } else {
    midj_ai_draw({
      prompt: input2.value,
      version: version.value,
      version_ban: version.value == 1 ? version_me.value : version_nj.value,
      mj_row: mj_row.value,
      niji_style: niji_style.value,
      pic_select: pic_select.value,
      chaos: chaos.value,
      style: style.value,
      choose_bili: choose_bili.value,
      imageUrl: imageUrl.value,
      cref_image: cref_image.value,
      cw: cw.value,
      seed: seed.value,
    })
      .then((res: any) => {
        now_draw_id.value = res._rawValue.id;
        get_choose_index(now_draw_id.value);
        midj_ai_draw_check(res._rawValue.prompt_id);
        Message.success("提交成功");
        draw_loading.value = false;

        get_me_d();
      })
      .catch((err: any) => {
        Message.error("提交失败");
        is_sc.value = false;
        draw_loading.value = false;
      });
  }
};
const midj_interval = ref();
const no_img = ref("");

// 轮询midjourney
const midj_ai_draw_check = (midj_ai: any) => {
  // draw_loading.value = true
  // is_finish.value = false
  midj_ai_check({
    prompt_id: midj_ai,
  })
    .then((res: any) => {})
    .catch((err: any) => {
      console.log(err);
      Message.error("生成失败");
      is_sc.value = false;
      draw_loading.value = false;
    });
};
const up_loading = ref(false);

const up_image_midj = (
  index: number,
  title: any,
  prompt_id: any,
  message_id: any
) => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;
  now_draw.value = "";
  up_midj_index({
    prompt: title,
    index: index,
    prompt_id: prompt_id,
    message_id: message_id,
  })
    .then((res: any) => {
      up_loading.value = false;
      r_images.value = res._rawValue.data;
      is_finish.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      get_choose_index(res._rawValue.id);
      get_me_d();
    })
    .catch((err: any) => {
      up_loading.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      console.log(err);
    });
};

const vary_image_midj = (
  title: any,
  prompt_id: any,
  message_id: any,
  varys: any
) => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;
  now_draw.value = "";
  vary_midj_index({
    prompt: title,
    prompt_id: prompt_id,
    message_id: message_id,
    index: varys,
  })
    .then((res: any) => {
      up_loading.value = false;
      r_images.value = res._rawValue.data;
      is_finish.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      get_choose_index(res._rawValue.id);
      get_me_d();
    })
    .catch((err: any) => {
      up_loading.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      console.log(err);
    });
};

const region_dialog = ref(false);
const region_title = ref("");
const last_mask_region = ref("");
const region_dialog_up = (title: any, prompt_id: any, message_id: any) => {
  region_dialog.value = true;
  region_src.value = now_draw.value.image;
  region_title.value = now_draw.value.title;
  setCanvas();
};

const region_midjourney = async () => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;

  const formData = new FormData();
  formData.append("prompt", now_draw.value.title);
  formData.append("prompt_id", now_draw.value.prompt_id);
  formData.append("message_id", now_draw.value.message_id);
  formData.append("region_image", last_mask_region.value);
  formData.append("index", 4);
  now_draw.value = "";
  const res = await fetch(`${window.APP_CONFIG.baseUrl}region_midj_index`, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  if (res.status == 200) {
    const data = await res.json();
    up_loading.value = false;
    r_images.value = data.data;
    is_finish.value = false;
    is_sc.value = false;
    draw_loading.value = false;
    get_choose_index(data.id);
    get_me_d();
  } else {
    up_loading.value = false;
    is_sc.value = false;
    draw_loading.value = false;
  }
  // region_midj_index({
  //   prompt: now_draw.value.title,
  //   prompt_id: now_draw.value.prompt_id,
  //   message_id:now_draw.value.message_id,
  //   region_image:last_mask_region.value,
  //   index:5
  // }).then((res: any) => {
  //   up_loading.value = false
  //   r_images.value = res._rawValue.data
  //   is_finish.value = false
  //   is_sc.value = false
  //   draw_loading.value = false
  //   get_choose_index(res._rawValue.id)
  //   get_me_d()
  // }).catch((err: any) => {
  //   up_loading.value = false
  //   is_sc.value = false
  //   draw_loading.value = false
  //   console.log(err)
  // })
};
const region_src = ref("");
const resultSrc = ref("");
const $imgRef = ref();
const $canvasRef = ref();
const drawing = ref(false);
const drawingHistory = ref([]);
async function setCanvas() {
  await nextTick();
  if (!$canvasRef.value) {
    return;
  }

  // 设置Canvas的宽高与图片一致
  $canvasRef.value.width = $imgRef.value.width;
  $canvasRef.value.height = $imgRef.value.height;
}

function startDrawing(event: { offsetX: any; offsetY: any }) {
  console.log("startDrawing");
  drawing.value = true;

  const ctx = $canvasRef.value.getContext("2d");
  ctx.beginPath(); // 清空子路径列表开始一个新的路径

  const { offsetX, offsetY } = event;
  ctx.moveTo(offsetX, offsetY); // 将一个新的子路径的起始点移动到 (x，y) 坐标
  extraction();
}

/**
 * 根据鼠标的移动来绘制线条
 */
function draw(event: { offsetX: any; offsetY: any }) {
  if (!drawing.value) return;

  const ctx = $canvasRef.value.getContext("2d");

  ctx.lineWidth = 5; // 定义笔画宽度
  ctx.strokeStyle = "white"; // 定义笔画颜色

  const { offsetX, offsetY } = event;
  ctx.lineTo(offsetX, offsetY); // 使用直线连接子路径的终点到 x，y 坐标的方法（并不会真正地绘制）
  ctx.stroke(); // 根据当前的画线样式，绘制当前或已经存在的路径的方法
}

/**
 * 停止绘制
 */
function stopDrawing() {
  drawing.value = false;

  const ctx = $canvasRef.value.getContext("2d");

  ctx.closePath(); // 将笔点返回到当前子路径起始点的方法
  drawingHistory.value.push($canvasRef.value.toDataURL()); // 存储当前 Canvas 状态
  // toDataURL 方法返回一个包含图片展示的 data URI
  // console.log('$canvasRef.value.toDataURL()', $canvasRef.value.toDataURL())
  last_mask_region.value = $canvasRef.value.toDataURL();
}

/**
 * canvas转图片
 */
function canvasToImage() {
  // 创建一个新Canvas元素
  const newCanvas = document.createElement("canvas");
  const newContext = newCanvas.getContext("2d");

  // 设置新Canvas的宽度和高度与原始Canvas相同
  newCanvas.width = $canvasRef.value.width;
  newCanvas.height = $canvasRef.value.height;

  // 在新Canvas上绘制黑色背景
  newContext.fillStyle = "black"; // 设置背景颜色为黑色
  newContext.fillRect(0, 0, newCanvas.width, newCanvas.height); // fillRect方法是直接在画布上绘制填充

  // 将原始Canvas上的图形绘制到新Canvas上
  newContext.drawImage($canvasRef.value, 0, 0);
  // drawImage方法提供了多种在画布上绘制图像的方式，第一个参数允许任何的画布图像源

  // 将 Canvas 上的内容转换为DataURL
  const dataURL = newCanvas.toDataURL("image/png"); // 指定要生成的图片格式
  return dataURL;
}

/**
 * 撤回上一次的涂鸦操作
 */
function undoLastDraw() {
  if (drawingHistory.value.length > 0) {
    drawingHistory.value.pop(); // 移除最后一步
    clearCanvas();
    redrawHistory();
  }
}

/**
 * 清空整个Canvas
 */
function clearCanvas() {
  const ctx = $canvasRef.value.getContext("2d");
  ctx.clearRect(0, 0, $canvasRef.value.width, $canvasRef.value.height);
  // clearRect 方法通过把像素设置为透明以达到擦除一个矩形区域的目的
}

/**
 * 重绘 canvas
 */
function redrawHistory() {
  const ctx = $canvasRef.value.getContext("2d");
  const dataURL = drawingHistory.value[drawingHistory.value.length - 1]; // 拿出最后一步重绘即可
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}

/**
 * 清空所有绘制内容
 */
function clearAll() {
  drawingHistory.value = [];
  clearCanvas();
}

/**
 * 确认提取
 */
function extraction() {
  resultSrc.value = canvasToImage();
}

const zoom_image_midj = (
  title: any,
  prompt_id: any,
  message_id: any,
  varys: any
) => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;
  now_draw.value = "";
  zoom_midj_index({
    prompt: title,
    prompt_id: prompt_id,
    message_id: message_id,
    index: varys,
  })
    .then((res: any) => {
      up_loading.value = false;
      r_images.value = res._rawValue.data;
      is_finish.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      get_choose_index(res._rawValue.id);
      get_me_d();
    })
    .catch((err: any) => {
      up_loading.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      console.log(err);
    });
};

const vp_image_midj = (
  index: number,
  title: any,
  prompt_id: any,
  message_id: any
) => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;
  now_draw.value = "";

  v_midj_index({
    prompt: title,
    index: index,
    prompt_id: prompt_id,
    message_id: message_id,
  })
    .then((res: any) => {
      up_loading.value = false;
      r_images.value = res._rawValue.data;
      is_finish.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      get_choose_index(res._rawValue.id);
      get_me_d();
    })
    .catch((err: any) => {
      up_loading.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      console.log(err);
    });
};

const midj_ai_describe = () => {
  up_loading.value = true;
  is_sc.value = true;
  draw_loading.value = true;
  now_draw_id.value = 0;
  now_draw.value = "";
  midjourney_describe({
    imageUrl: text_imageUrl.value,
  })
    .then((res: any) => {
      up_loading.value = false;
      r_images.value = res._rawValue.data;
      is_finish.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      get_choose_index(res._rawValue.id);
      get_me_d();
    })
    .catch((err: any) => {
      up_loading.value = false;
      is_sc.value = false;
      draw_loading.value = false;
      console.log(err);
    });
};

const me_change = (val: number) => {
  me_page.value = val;
  get_me_d();
};

const draw_bottom = ref(false);
const del_me_draw = (id: number) => {
  draw_bottom.value = true;
  del_me_d({
    draw_id: id,
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      draw_bottom.value = false;
      now_draw.value = "";
      now_draw_id.value = 0;
      get_me_d();
    })
    .catch((err: any) => {
      draw_bottom.value = false;
      console.log(err);
    });
};
</script>
<style lang="scss" scoped>
.loader {
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  background-color: transparent;
  border-radius: 50%;
  // animation: rotate3 3s linear infinite;
}

.hexagon-container {
  position: relative;
  top: 33px;
  left: 41px;
  border-radius: 50%;
}

.hexagon {
  position: absolute;
  width: 40px;
  height: 23px;
  background-color: #165dff;

  &:before {
    content: "";
    position: absolute;
    top: -11px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 11.5px solid #165dff;
  }

  &:after {
    content: "";
    position: absolute;
    top: 23px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 11.5px solid #165dff;
  }
}

@each $index, $top, $left in (1, 0px, 0px), (2, 0px, 42px), (3, 36px, 63px),
  (4, 72px, 42px), (5, 72px, 0px), (6, 36px, -21px), (7, 36px, 21px)
{
  $time: 3s; // thx to @zeakd for this formula
  $delay: calc($time / 14);

  .hexagon.hex_#{$index} {
    top: $top;
    left: $left;
    //cubic-bezier(.155,1.105,.295,1.12)
    animation: Animasearch $time ease-in-out infinite;
    animation-delay: $delay * $index;
  }
}

@keyframes Animasearch {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  15%,
  50% {
    transform: scale(0.5);
    opacity: 0;
  }

  65% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
    clip: rect(0px, 35px, 35px, 0px);
  }

  50% {
    clip: rect(0px, 40px, 40px, 0px);
  }

  100% {
    transform: rotate(360deg);
    clip: rect(0px, 35px, 35px, 0px);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotate(0deg);
    clip: rect(0px, 164px, 150px, 0px);
  }

  50% {
    clip: rect(0px, 164px, 0px, 0px);
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(720deg);
    clip: rect(0px, 164px, 150px, 0px);
  }
}

@keyframes rotate3 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
