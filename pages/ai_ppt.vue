<template>
  <div class="ai-ppt-show flex w-full">
    <div
      style="width: 340px"
      class="flex h-full flex-col border-r-blue-200 draw-list-left relative"
    >
      <a-tabs
        @change="changePpt"
        type="capsule"
        size="large"
        class="h-full mt-2"
      >
        <a-tab-pane key="refuse" title="专业模式">
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  PPT描述
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
                  placeholder="请输入PPT主题描述，AI将智能生成PPT内容"
                />
              </section>
              <div class="w-full flex align-items-center">
                <p class="flex-none text-gray-3 text-12">示范:</p>
                <ul
                  class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                >
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="input2 = '程序员'"
                  >
                    程序员
                  </li>
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="input2 = '营销行业'"
                  >
                    营销行业
                  </li>
                </ul>
                <icon-refresh class="cursor-pointer" @click="change_prompt()" />
              </div>
            </div>
          </section>
          <section>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">标题</span>
              <div class="flex-1">
                <a-input v-model="catalogs.title" placeholder="填写标题内容" />
              </div>
            </div>
          </section>
          <section>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">副标题</span>
              <div class="flex-1">
                <a-input v-model="catalogs.subTitle" placeholder="填写副标题" />
              </div>
            </div>
          </section>
          <section>
            <div class="flex items-center justify-between space-x-2 mt-2">
              <span class="w-[70px]">作者</span>
              <div class="flex-1">
                <a-input v-model="author" placeholder="填写作者" />
              </div>
              <a-tooltip content="PPT作者">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
          </section>

          <section>
            <div class="relative">
              <div>
                <div class="left-panel-setting-block__header">
                  <div class="left-panel-setting-block__title mt-2 fs-5">
                    大纲内容
                    <a-tooltip content="大纲内容可编辑">
                      <icon-exclamation-circle class="font-18 ml-1" />
                    </a-tooltip>
                  </div>
                </div>
                <a-button
                  @click="generateTitle()"
                  type="primary"
                  :loading="outlineLoading"
                  class="mb-2 w-full"
                  >生成大纲</a-button
                >
              </div>
            </div>
            <div
              class="bg-gray-50 rounded-xl overflow-auto p-2"
              :class="catalogs?.chapters?.length > 0 ? 'h-96' : 'h-full'"
            >
              <a-timeline
                mode="left"
                labelPosition="relative"
                v-if="catalogs?.chapters?.length > 0"
              >
                <a-timeline-item
                  label="一级大纲"
                  v-for="(cate, indexs) in catalogs?.chapters"
                  :key="indexs"
                >
                  <a-row
                    :style="{ display: 'inline-flex', alignItems: 'center' }"
                  >
                    <div>
                      <a-textarea v-model="cate.chapterTitle"></a-textarea>
                      <div
                        v-for="(cat_two, indexT) in cate.chapterContents"
                        :key="indexT"
                        :style="{ fontSize: '12px', color: '#4E5969' }"
                      >
                        <a-tag class="mb-1" size="small" color="arcoblue"
                          >二级大纲</a-tag
                        >
                        <a-input
                          class="my-2"
                          v-model="cate.chapterContents[indexT].chapterTitle"
                          @input="updateSubCatalog(indexs, indexT)"
                        ></a-input>
                      </div>
                    </div>
                  </a-row>
                </a-timeline-item>
              </a-timeline>
              <a-empty v-else></a-empty>
            </div>
          </section>
          <div class="left-panel-setting-block__header">
            <div class="left-panel-setting-block__title mt-2 fs-5">
              主题选择
              <a-tooltip content="PPT主题选定">
                <icon-exclamation-circle class="font-18 ml-1" />
              </a-tooltip>
            </div>
          </div>
          <a-row
            :gutter="10"
            class="flex mb-28 justify-content-center mj_version"
          >
            <a-col
              :span="12"
              class="version-item"
              v-for="(item, index) in ppt_theme_arr"
              :key="index"
              @click="theme = item.key"
              :class="theme == item.key ? 'active' : ''"
            >
              <button
                class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
              >
                <div
                  class="absolute flex items-center justify-center w-full h-full"
                >
                  <div class="model-card__title">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
                <img
                  class="object-cover w-full h-full rounded-xl"
                  :src="item.thumbnail"
                />
              </button>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="easy" title="精简模式">
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  PPT描述
                </h5>
              </div>
            </div>
            <div class="mt-2 fade-box draw_des_clip">
              <section
                class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
              >
                <a-textarea
                  v-model="easy_input2"
                  class="bg-white pb-10"
                  :auto-size="{ minRows: 7, maxRows: 7 }"
                  :max-length="8000"
                  show-word-limit
                  allow-clear
                  placeholder="请输入PPT详细描述，不多于8000字，AI自动生成大纲等内容提交"
                />
              </section>
            </div>
          </section>
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
          消耗{{ counter.setting.ai_ppt_price
          }}{{ counter.setting.money_name_set }}/会员{{
            counter.setting.ai_ppt_viplimit
          }}次
        </div>
        <a-button
          :loading="draw_loading"
          @click="ai_generate()"
          class="w-100"
          type="primary"
          size="large"
        >
          <icon-image class="up_images" />
          开始创作
        </a-button>
      </div>
    </div>
    <div class="ppt-content bg-ai main relative">
      <div class="ai-header relative" style="top: 0px; height: 60px">
        <div
          class="sc-gfbthv jFmMKE"
          v-if="!is_sc && !is_finish"
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
      <div class="flex ai-generate-area">
        <div class="generate-result-area flex-1 p-1">
          <div class="generate-result-area__container">
            <div class="generate_now_all" v-if="is_sc || is_finish">
              <a-row :gutter="20" v-if="is_sc">
                <a-col>
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
                      <p class="mt-4 loading__progress--loading text-center">
                        生成中...
                      </p>
                    </div>
                  </div>
                </a-col>
              </a-row>
              <a-row :gutter="20" v-if="is_finish">
                <iframe
                  width="100%"
                  style="width: 100%; height: calc(100vh - 70px); border: none"
                  :src="`https://view.officeapps.live.com/op/view.aspx?src=${now_ppt.ppt_url}`"
                  frameborder="0"
                ></iframe>
              </a-row>
            </div>

            <div class="generate-empty" v-if="now_ppt == '' && !is_finish">
              <svg
                t="1719239765376"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5367"
                width="128"
                height="128"
              >
                <path
                  d="M968.704 135.168h-430.08v752.64h430.08c15.36 0 26.624-12.288 26.624-26.624V162.816c0-15.36-11.264-27.648-26.624-27.648z"
                  fill="#FF8A65"
                  p-id="5368"
                ></path>
                <path
                  d="M512 646.144h376.832v53.248H512z m0 107.52h376.832v54.272H512z m161.792-483.328c-89.088 0-161.792 72.704-161.792 161.792C512 521.216 584.704 593.92 673.792 593.92s161.792-72.704 161.792-161.792H673.792V270.336z"
                  fill="#FBE9E7"
                  p-id="5369"
                ></path>
                <path
                  d="M727.04 216.064v161.792h161.792c0-89.088-72.704-161.792-161.792-161.792z"
                  fill="#FBE9E7"
                  p-id="5370"
                ></path>
                <path
                  d="M592.896 996.352L28.672 888.832V135.168L592.896 27.648z"
                  fill="#E64A19"
                  p-id="5371"
                ></path>
                <path
                  d="M319.488 327.68H192.512v368.64h78.848V569.344h40.96c44.032 0 78.848-11.264 104.448-34.816 25.6-22.528 38.912-53.248 38.912-90.112C455.68 366.592 409.6 327.68 319.488 327.68z m-14.336 178.176h-33.792V391.168h33.792c43.008 0 64.512 18.432 64.512 56.32 0 39.936-21.504 58.368-64.512 58.368z"
                  fill="#FFFFFF"
                  p-id="5372"
                ></path>
              </svg>
              <div class="generate-empty__title font-18">添加PPT任务</div>
              <div class="generate-empty__desc">快去左侧添加PPT创作吧~</div>
            </div>
          </div>
        </div>
        <div class="task_me flex items-center">
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
                <span class="font-bold">{{ count }}个PPT</span>
                <a-popconfirm
                  content="此操作将永久删除未完成的PPT,确定要删除吗?"
                  @ok="delete_ppt_nofinish()"
                  type="warning"
                >
                  <icon-select-all size="20" class="cursor-pointer" />
                </a-popconfirm>
              </div>

              <div class="mt-2 work_content" v-if="all_ppt.length > 0">
                <div
                  class="img_work relative cursor-pointer"
                  v-for="(m, m_index) in all_ppt"
                  :key="m_index"
                  @click="check_task(m.ppt_id)"
                >
                  <div
                    class="text-center shadow-sm rounded-xl flex flex-col border items-center my-2 p-2 hover:border-blue-500"
                  >
                    <svg
                      t="1719241387999"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="5529"
                      width="64"
                      height="64"
                    >
                      <path
                        d="M179 64h468.5l223 225.5V935c0 13.807-11.193 25-25 25H179c-13.807 0-25-11.193-25-25V89c0-13.807 11.193-25 25-25z"
                        fill="#FF7861"
                        p-id="5530"
                      ></path>
                      <path
                        d="M647.5 64v200.5c0 13.807 11.193 25 25 25h198L647.5 64z"
                        fill="#FFB0A4"
                        p-id="5531"
                      ></path>
                      <path
                        d="M670.098 478.093C677.884 486.056 682 497.51 682 514.5c0 16.989-4.116 28.444-11.902 36.407-8.313 8.504-22.397 14.822-43.202 18.093H318c-19.33 0-35 15.67-35 35v157c0 19.33 15.67 35 35 35s35-15.67 35-35V639h276.5a35 35 0 0 0 4.95-0.352C709.214 627.968 752 584.203 752 514.5s-42.786-113.468-117.55-124.148a35 35 0 0 0-4.95-0.352H318c-19.33 0-35 15.67-35 35s15.67 35 35 35h308.896c20.805 3.271 34.889 9.589 43.202 18.093z"
                        fill="#FFFFFF"
                        p-id="5532"
                      ></path>
                    </svg>
                    <div class="mt-2 sm:mt-4">
                      <a-tooltip :content="m.title" position="left">
                        <h3
                          class="text-sm truncate font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200"
                        >
                          {{ m.title }}
                        </h3>
                      </a-tooltip>
                      <p
                        class="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400"
                      >
                        进度: {{ m.progress }}%
                      </p>
                    </div>
                    <!-- Button Container -->
                    <div class="flex justify-center gap-2 mt-2">
                      <button
                        class="chat-tool-btn"
                        @click="handleThumbsUp(m.ppt_id)"
                      >
                        <div class="sign">
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
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                        </div>
                        <div class="text">好评</div>
                      </button>
                      <!-- Thumbs Down Button -->
                      <button
                        class="chat-tool-btn"
                        @click="handleThumbsDown(m.ppt_id)"
                      >
                        <div class="sign">
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
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </g>
                          </svg>
                        </div>
                        <div class="text">差评</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <a-empty description="暂无数据哦~" v-else />

              <div class="flex justify-center">
                <a-pagination
                  simple
                  size="mini"
                  :current="page"
                  :page-size="limit"
                  class="mr-4 ml-4"
                  hide-on-single-page
                  background
                  :total="count"
                  @change="me_change"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-drawer
      v-model:visible="drawer"
      title="配置"
      placement="left"
      class="left_ai_ppt"
      width="80%"
    >
      <div class="flex flex-col border-r-blue-200 relative overflow-hidden">
        <a-tabs
          @change="changePpt"
          type="capsule"
          size="large"
          class="vh-100 overflow-auto mt-2"
        >
          <a-tab-pane key="refuse" title="专业模式">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    PPT描述
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
                    placeholder="请输入PPT主题描述，AI将智能生成PPT内容"
                  />
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = '程序员'"
                    >
                      程序员
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="input2 = '营销行业'"
                    >
                      营销行业
                    </li>
                  </ul>
                  <icon-refresh
                    class="cursor-pointer"
                    @click="change_prompt()"
                  />
                </div>
              </div>
            </section>
            <section>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">标题</span>
                <div class="flex-1">
                  <a-input
                    v-model="catalogs.title"
                    placeholder="填写标题内容"
                  />
                </div>
              </div>
            </section>
            <section>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">副标题</span>
                <div class="flex-1">
                  <a-input
                    v-model="catalogs.subTitle"
                    placeholder="填写副标题"
                  />
                </div>
              </div>
            </section>
            <section>
              <div class="flex items-center justify-between space-x-2 mt-2">
                <span class="w-[70px]">作者</span>
                <div class="flex-1">
                  <a-input v-model="author" placeholder="填写作者" />
                </div>
                <a-tooltip content="PPT作者">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </section>
            <section>
              <div class="relative">
                <div>
                  <div class="left-panel-setting-block__header">
                    <div class="left-panel-setting-block__title mt-2 fs-5">
                      大纲内容
                      <a-tooltip content="大纲内容可编辑">
                        <icon-exclamation-circle class="font-18 ml-1" />
                      </a-tooltip>
                    </div>
                  </div>
                  <a-button
                    @click="generateTitle()"
                    type="primary"
                    :loading="outlineLoading"
                    class="mb-2 w-full"
                    >生成大纲</a-button
                  >
                </div>
              </div>
              <div
                class="bg-gray-50 rounded-xl overflow-auto p-2"
                :class="catalogs?.chapters?.length > 0 ? 'h-96' : 'h-full'"
              >
                <a-timeline
                  mode="left"
                  labelPosition="relative"
                  v-if="catalogs?.chapters?.length > 0"
                >
                  <a-timeline-item
                    label="一级大纲"
                    v-for="(cate, indexs) in catalogs?.chapters"
                    :key="indexs"
                  >
                    <a-row
                      :style="{ display: 'inline-flex', alignItems: 'center' }"
                    >
                      <div>
                        <a-textarea v-model="cate.chapterTitle"></a-textarea>
                        <div
                          v-for="(cat_two, indexT) in cate.chapterContents"
                          :key="indexT"
                          :style="{ fontSize: '12px', color: '#4E5969' }"
                        >
                          <a-tag class="mb-1" size="small" color="arcoblue"
                            >二级大纲</a-tag
                          >
                          <a-input
                            class="my-2"
                            v-model="cate.chapterContents[indexT].chapterTitle"
                            @input="updateSubCatalog(indexs, indexT)"
                          ></a-input>
                        </div>
                      </div>
                    </a-row>
                  </a-timeline-item>
                </a-timeline>
                <a-empty v-else></a-empty>
              </div>
            </section>
            <div class="left-panel-setting-block__header">
              <div class="left-panel-setting-block__title mt-2 fs-5">
                主题选择
                <a-tooltip content="PPT主题选定">
                  <icon-exclamation-circle class="font-18 ml-1" />
                </a-tooltip>
              </div>
            </div>
            <a-row
              :gutter="10"
              class="flex mb-28 justify-content-center mj_version"
            >
              <a-col
                :span="12"
                class="version-item"
                v-for="(item, index) in ppt_theme_arr"
                :key="index"
                @click="theme = item.key"
                :class="theme == item.key ? 'active' : ''"
              >
                <button
                  class="relative overflow-hidden border-2 rounded-xl dark:border-neutral-700"
                >
                  <div
                    class="absolute flex items-center justify-center w-full h-full"
                  >
                    <div class="model-card__title">
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                  <img
                    class="object-cover w-full h-full rounded-xl"
                    :src="item.thumbnail"
                  />
                </button>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="easy" title="精简模式">
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    PPT描述
                  </h5>
                </div>
              </div>
              <div class="mt-2 fade-box draw_des_clip">
                <section
                  class="w-full relative border-gray-5 pb-0 rounded-8 bg-white-1 hover:border-primary-base transition-border"
                >
                  <a-textarea
                    v-model="easy_input2"
                    class="bg-white pb-10"
                    :auto-size="{ minRows: 7, maxRows: 7 }"
                    :max-length="8000"
                    show-word-limit
                    allow-clear
                    placeholder="请输入PPT详细描述，不多于8000字，AI自动生成大纲等内容提交"
                  />
                </section>
              </div>
            </section>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <div class="bg-white z-10 w-full h-110 bg-white-1 border-gray-5">
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
            消耗{{ counter.setting.ai_ppt_price
            }}{{ counter.setting.money_name_set }}/会员{{
              counter.setting.ai_ppt_viplimit
            }}次
          </div>
          <a-button
            :loading="draw_loading"
            @click="ai_generate()"
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
import { Message } from "@arco-design/web-vue";
import { useCounter } from "~/store/counter";
import { useCookie } from "nuxt/app";
import FeedbackModal from "~/components/chat/FeedbackModal.vue";
import { submitMessageReport } from "~/api/api";
const token = useCookie("token");
const input2 = ref("");
const counter = useCounter();
const change_prompt = () => {
  const arr = ["程序员", "营销行业"];
  input2.value = arr[Math.floor(Math.random() * arr.length)];
};

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
const types = ref("refuse");
const changePpt = (e: any) => {
  types.value = e;
};

const author = ref("");
const easy_input2 = ref("");
const catalogs = ref([]);
const designSid = ref("");
const outlineLoading = ref(false);
const generateTitle = () => {
  outlineLoading.value = true;
  if (input2.value) {
    ppt_out_line({
      prompt: input2.value,
    })
      .then((res) => {
        catalogs.value = res._rawValue.data;
        designSid.value = res._rawValue.sid;
        Message.success(res._rawValue.message);
        outlineLoading.value = false;
      })
      .catch((err) => {
        console.log(err);
        outlineLoading.value = false;
      });
  } else {
    Message.error("请输入PPT描述");
  }
};

const updateSubCatalog = (index: number, indexs: number) => {
  catalogs.value[index].chapterContents[indexs].chapterTitle =
    catalogs.value[index].chapterContents[indexs].chapterTitle;
};

const ai_generate = () => {
  draw_loading.value = true;
  if (types.value === "refuse") {
    if (catalogs.value.length == 0) {
      Message.error("请先生成大纲");
      draw_loading.value = false;
      return;
    }

    if (author.value == "") {
      Message.error("请填写作者");
      draw_loading.value = false;
      return;
    }

    ppt_create_outline({
      prompt: input2.value,
      outline: JSON.stringify(catalogs.value),
      theme: theme.value,
      author: author.value,
    })
      .then((res: any) => {
        draw_loading.value = false;
        ppt_generate_easys(res._rawValue.sid);
        Message.success(res._rawValue.message);
        now_ppt.value = "";
        is_finish.value = false;
      })
      .catch((err: any) => {
        draw_loading.value = false;
        console.log(err);
      });
  } else {
    ppt_generate_easy({
      prompt: easy_input2.value,
    })
      .then((res: any) => {
        draw_loading.value = false;
        ppt_generate_easys(res._rawValue.sid);
        Message.success(res._rawValue.message);
        now_ppt.value = "";
        is_finish.value = false;
      })
      .catch((err: any) => {
        draw_loading.value = false;
        console.log(err);
      });
  }
};

const timer = ref(null) as any;
const allTimer = ref(null) as any;
const is_sc = ref(false);
const ppt_generate_easys = (task_id: any) => {
  ppt_process({
    sid: task_id,
  })
    .then((res) => {
      is_sc.value = true;
      timer.value = setInterval(() => {
        check_task(task_id);
      }, 6000);
      allTimer.value = setInterval(() => {
        ppt_list_get();
      }, 6000);
    })
    .catch((err) => {
      console.log(err);
    });
};

const check_task = (task_id: any) => {
  ppt_check({
    sid: task_id,
  })
    .then((res) => {
      if (res._rawValue.data.progress == 100) {
        clearInterval(timer.value);
        now_ppt.value = res._rawValue.data;
        is_sc.value = false;
        is_finish.value = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const page = ref(1);
const limit = ref(10);
const all_ppt = ref([]);
const count = ref(0);
const refresh_loading = ref(false);
const right_sout = ref(false);
const is_finish = ref(false);
// const now_ppt = ref("");
interface Ppt {
  ppt_id?: string; // Adjust to `id` if the API uses a different field name
  ppt_url?: string;
  title?: string;
  progress?: number;
}

const now_ppt = ref<Ppt | null>(null);
const draw_loading = ref(false);
const ppt_list_get = () => {
  refresh_loading.value = true;
  ppt_list({
    page: page.value,
    limit: limit.value,
  })
    .then((res) => {
      all_ppt.value = res._rawValue.data;
      count.value = res._rawValue.count;
      refresh_loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      refresh_loading.value = false;
    });
};

const me_change = (e: any) => {
  page.value = e;
  ppt_list_get();
};

const delete_ppt_nofinish = () => {
  ppt_delete_all()
    .then((res) => {
      Message.success(res._rawValue.message);
      ppt_list_get();
      clearInterval(allTimer.value);
      clearInterval(timer.value);
    })
    .catch((err) => {
      console.log(err);
    });
};
const ppt_theme_arr = ref([]);
const theme = ref("");
const get_ppt_themes = () => {
  ppt_themes()
    .then((res) => {
      ppt_theme_arr.value = res._rawValue.data;
      theme.value = res._rawValue.data[0].key;
    })
    .catch((err) => {
      console.log(err);
    });
};
const user_balance = ref(0);
const user_id = ref(0);
const get_user_balance = () => {
  get_siwei_limit().then((res) => {
    user_balance.value = res._rawValue.data;
    user_id.value = res._rawValue.us_id;
  });
};

const drawer = ref(false);
const change_drawer = () => {
  drawer.value = true;
};

if (token.value) {
  ppt_list_get();
  get_ppt_themes();
  get_user_balance();
}
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
