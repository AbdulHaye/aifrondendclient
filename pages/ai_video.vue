<template>
  <div class="ai-video-show flex w-full">
    <div
      style="width: 340px"
      class="flex h-full flex-col border-r-blue-200 draw-list-left relative"
    >
      <a-tabs
        @change="changevideo"
        type="capsule"
        size="large"
        class="h-full mt-2"
      >
        <a-tab-pane
          key="Luma"
          v-if="counter.setting.ai_video_open == '1'"
          title="Luma视频"
        >
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  Luma提示词
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
                  placeholder="请输入视频内容描述，AI将智能生成视频内容"
                />
              </section>
              <div class="w-full flex align-items-center">
                <p class="flex-none text-gray-3 text-12">示范:</p>
                <ul
                  class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                >
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="
                      input2 =
                        '毛茸茸的小猫咪正在阳光下慵懒地伸展身体,享受着温暖。'
                    "
                  >
                    猫咪场景
                  </li>
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="
                      input2 =
                        '蔚蓝的海水一波接一波地拍打着金色的沙滩,留下一道道白色的浪花。'
                    "
                  >
                    海浪
                  </li>
                </ul>
                <icon-refresh class="cursor-pointer" @click="change_prompt()" />
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
                    <span class="left-panel-setting-block__title">参考图</span>
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
          <section>
            <div
              class="flex items-center w-full justify-between space-x-2 mt-2"
            >
              <span class="w-[70px]">优化提示词</span>
              <div class="flex-1 flex justify-end">
                <a-switch v-model="expand_prompt" />
              </div>
            </div>
          </section>
        </a-tab-pane>
        <a-tab-pane
          key="chatglm"
          title="智谱清言"
          v-if="counter.setting.ai_chatglm_video_open == '1'"
        >
          <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
            <div class="relative">
              <div>
                <h5
                  class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                >
                  智谱提示词
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
                  placeholder="请输入视频内容描述，AI将智能生成视频内容"
                />
              </section>
              <div class="w-full flex align-items-center">
                <p class="flex-none text-gray-3 text-12">示范:</p>
                <ul
                  class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                >
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="
                      input2 =
                        '毛茸茸的小猫咪正在阳光下慵懒地伸展身体,享受着温暖。'
                    "
                  >
                    猫咪场景
                  </li>
                  <li
                    class="cursor-pointer text-gray-2 text-12 ml-1"
                    @click="
                      input2 =
                        '蔚蓝的海水一波接一波地拍打着金色的沙滩,留下一道道白色的浪花。'
                    "
                  >
                    海浪
                  </li>
                </ul>
                <icon-refresh class="cursor-pointer" @click="change_prompt()" />
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
                    <span class="left-panel-setting-block__title">参考图</span>
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
          <span v-if="types == 'Luma'">
            消耗{{ counter.setting.ai_video_price
            }}{{ counter.setting.money_name_set }}/ 会员{{
              counter.setting.ai_video_viplimit
            }}次
          </span>
          <span v-else-if="types == 'chatglm'">
            消耗{{ counter.setting.ai_chatglm_video_price
            }}{{ counter.setting.money_name_set }}/ 会员{{
              counter.setting.ai_chatglm_video_viplimit
            }}次
          </span>
        </div>
        <a-button
          v-if="types == 'Luma' && counter.setting.ai_video_open == '1'"
          :loading="draw_loading"
          @click="ai_generate()"
          class="w-100"
          type="primary"
          size="large"
        >
          <icon-image class="up_images" />
          开始创作
        </a-button>
        <a-button
          v-if="
            types == 'chatglm' && counter.setting.ai_chatglm_video_open == '1'
          "
          :loading="draw_loading"
          @click="ai_generate_chatglm()"
          class="w-100"
          type="primary"
          size="large"
        >
          <icon-image class="up_images" />
          开始创作
        </a-button>
      </div>
    </div>
    <div class="video-content bg-ai main relative">
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
          <span>点击配置输入描述，开始生成视频</span>
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
        <div class="generate-result-area flex-1 p-2 overflow-hidden">
          <div class="generate-result-area__container">
            <div class="generate_now_all" v-if="is_sc || is_finish">
              <div v-if="is_sc">
                <div>
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
                </div>
              </div>
              <div v-if="is_finish">
                <div>
                  <div class="generate-card__generating mb-2">
                    <div class="p-4 mb-2 max-h-[700px] overflow-auto">
                      <Video
                        class="h-full"
                        :key="now_video.id"
                        theme="#106dff"
                        :title="now_video.prompt"
                        poster="/images/video.png"
                        :src="now_video.video_url"
                        :current-time="15"
                      />
                    </div>
                    <div class="flex gap-2 justify-between">
                      <a-button
                        v-if="now_video.types == 'luma'"
                        type="primary"
                        @click="square_video(now_video.video_id)"
                      >
                        <template #icon>
                          <icon-rotate-right />
                        </template>
                        延伸视频
                      </a-button>
                      <a-button
                        type="primary"
                        @click="download(now_video.video_url)"
                      >
                        <template #icon>
                          <icon-download />
                        </template>
                        下载
                      </a-button>
                      <a-popconfirm
                        content="确定删除吗？"
                        type="warning"
                        position="lt"
                        @ok="deleteVideo(now_video.id)"
                      >
                        <a-button type="primary" status="danger">
                          <template #icon>
                            <icon-delete />
                          </template>
                          删除
                        </a-button>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="generate-empty"
              v-if="now_video == '' && !is_finish && !is_sc"
            >
              <svg
                t="1722583019910"
                class="icon"
                viewBox="0 0 1151 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="8533"
                width="128"
                height="128"
              >
                <path
                  d="M426.666667 426.666667m-426.666667 0a426.666667 426.666667 0 1 0 853.333333 0 426.666667 426.666667 0 1 0-853.333333 0Z"
                  fill="#0F62FE"
                  p-id="8534"
                ></path>
                <path
                  d="M664.824242 537.6m-486.4 0a486.4 486.4 0 1 0 972.8 0 486.4 486.4 0 1 0-972.8 0Z"
                  fill="#C1D0FF"
                  fill-opacity=".4"
                  p-id="8535"
                ></path>
                <path
                  d="M844.024242 497.290085c31.030303 17.915345 31.030303 62.704485 0 80.61983l-233.890909 135.036121c-31.030303 17.915345-69.818182-4.477673-69.818181-40.308363V402.562327c0-35.830691 38.787879-58.223709 69.818181-40.308363L844.024242 497.290085z"
                  fill="#FFFFFF"
                  p-id="8536"
                ></path>
              </svg>
              <div class="generate-empty__title font-18">添加视频创作任务</div>
              <div class="generate-empty__desc">快去左侧添加视频创作吧~</div>
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
                <span class="font-bold">{{ count }}个视频</span>
                <a-popconfirm
                  content="此操作将永久删除未完成的视频,确定要删除吗?"
                  @ok="delete_video_nofinish()"
                  type="warning"
                >
                  <icon-select-all size="20" class="cursor-pointer" />
                </a-popconfirm>
              </div>

              <div class="mt-2 work_content" v-if="all_video.length > 0">
                <div
                  class="img_work relative cursor-pointer"
                  v-for="(m, m_index) in all_video"
                  :key="m_index"
                  @click="check_task(m.video_id)"
                >
                  <div
                    class="text-center shadow-sm rounded-xl flex flex-col border items-center my-2 p-2 hover:border-blue-500"
                  >
                    <svg
                      t="1722865115715"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="7805"
                      width="64"
                      height="64"
                    >
                      <path
                        d="M905.6 771.2l-254.4-62.4c-4.8-1.6-9.6-1.6-12.8-1.6C603.2 704 576 673.6 576 640v-67.2c0-35.2 27.2-64 62.4-67.2 4.8 0 9.6-1.6 12.8-1.6l254.4-62.4c25.6-6.4 54.4 1.6 70.4 20.8 9.6 11.2 16 25.6 16 41.6v203.2c0 16-6.4 30.4-16 41.6-16 20.8-44.8 28.8-70.4 22.4z"
                        fill="#E1E1DF"
                        p-id="7806"
                      ></path>
                      <path
                        d="M392 198.4a121.6 118.4 0 1 0 243.2 0 121.6 118.4 0 1 0-243.2 0Z"
                        fill="#2166CC"
                        p-id="7807"
                      ></path>
                      <path
                        d="M222.4 235.2a86.4 84.8 0 1 0 172.8 0 86.4 84.8 0 1 0-172.8 0Z"
                        fill="#2166CC"
                        p-id="7808"
                      ></path>
                      <path
                        d="M705.6 944H160c-70.4 0-128-57.6-128-128V436.8c0-70.4 57.6-128 128-128h545.6c70.4 0 128 57.6 128 128V816c0 70.4-57.6 128-128 128z"
                        fill="#4E8DF6"
                        p-id="7809"
                      ></path>
                      <path
                        d="M526.4 612.8l-172.8-97.6c-11.2-6.4-24 1.6-24 14.4v195.2c0 12.8 12.8 19.2 24 14.4L526.4 640c11.2-6.4 11.2-20.8 0-27.2z"
                        fill="#FFFFFF"
                        p-id="7810"
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
                      <span class="truncate w-20 inline-block">
                        {{ m.prompt }}
                      </span>
                      <p
                        class="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400"
                      >
                        进度: {{ m.progress }}%
                      </p>
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
      class="left_ai_video"
      width="80%"
    >
      <div class="flex h-full flex-col border-r-blue-200 relative">
        <a-tabs
          @change="changevideo"
          type="capsule"
          size="large"
          class="h-full mt-2"
        >
          <a-tab-pane
            key="Luma"
            v-if="counter.setting.ai_video_open == '1'"
            title="Luma视频"
          >
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    Luma提示词
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
                    placeholder="请输入视频内容描述，AI将智能生成视频内容"
                  />
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="
                        input2 =
                          '毛茸茸的小猫咪正在阳光下慵懒地伸展身体,享受着温暖。'
                      "
                    >
                      猫咪场景
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="
                        input2 =
                          '蔚蓝的海水一波接一波地拍打着金色的沙滩,留下一道道白色的浪花。'
                      "
                    >
                      海浪
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
            <section>
              <div
                class="flex items-center w-full justify-between space-x-2 mt-2"
              >
                <span class="w-[70px]">优化提示词</span>
                <div class="flex-1 flex justify-end">
                  <a-switch v-model="expand_prompt" />
                </div>
              </div>
            </section>
          </a-tab-pane>
          <a-tab-pane
            key="chatglm"
            title="智谱清言"
            v-if="counter.setting.ai_chatglm_video_open == '1'"
          >
            <section class="flex flex-col space-y-16 rounded-10 p-4 bg-gray-7">
              <div class="relative">
                <div>
                  <h5
                    class="left-panel-setting-block__title font-18 text-gray-2 mr-4 flex justify-between"
                  >
                    智谱提示词
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
                    placeholder="请输入视频内容描述，AI将智能生成视频内容"
                  />
                </section>
                <div class="w-full flex align-items-center">
                  <p class="flex-none text-gray-3 text-12">示范:</p>
                  <ul
                    class="flex align-items-center flex-grow whitespace-nowrap scrollbar-none"
                  >
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="
                        input2 =
                          '毛茸茸的小猫咪正在阳光下慵懒地伸展身体,享受着温暖。'
                      "
                    >
                      猫咪场景
                    </li>
                    <li
                      class="cursor-pointer text-gray-2 text-12 ml-1"
                      @click="
                        input2 =
                          '蔚蓝的海水一波接一波地拍打着金色的沙滩,留下一道道白色的浪花。'
                      "
                    >
                      海浪
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
            <span v-if="types == 'Luma'">
              消耗{{ counter.setting.ai_video_price
              }}{{ counter.setting.money_name_set }}/ 会员{{
                counter.setting.ai_video_viplimit
              }}次
            </span>
            <span v-else-if="types == 'chatglm'">
              消耗{{ counter.setting.ai_chatglm_video_price
              }}{{ counter.setting.money_name_set }}/ 会员{{
                counter.setting.ai_chatglm_video_viplimit
              }}次
            </span>
          </div>
          <a-button
            v-if="types == 'Luma' && counter.setting.ai_video_open == '1'"
            :loading="draw_loading"
            @click="ai_generate()"
            class="w-100"
            type="primary"
            size="large"
          >
            <icon-image class="up_images" />
            开始创作
          </a-button>
          <a-button
            v-if="
              types == 'chatglm' && counter.setting.ai_chatglm_video_open == '1'
            "
            :loading="draw_loading"
            @click="ai_generate_chatglm()"
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
  </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import { useCounter } from "~/store/counter";
import { IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";
import {
  get_video_list,
  music_delete,
  video_check,
  video_create,
  video_delete_all,
  video_square,
} from "~/utils/api";
import { Video } from "@usuuu/video";
import "@usuuu/video/dist/es/style.css";

const token = useCookie("token");
const input2 = ref("");
const counter = useCounter();
const change_prompt = () => {
  const arr = [
    "毛茸茸的小猫咪正在阳光下慵懒地伸展身体,享受着温暖。",
    "蔚蓝的海水一波接一波地拍打着金色的沙滩,留下一道道白色的浪花。",
  ];
  input2.value = arr[Math.floor(Math.random() * arr.length)];
};

const types = ref("Luma");
const changevideo = (e: any) => {
  types.value = e;
};
const actions = counter.setting.APP_URL + "/api/upload_miji";
const imageUrl = ref("");
const deletePic = () => {
  imageUrl.value = "";
};
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
const picSuccess = (currentFile: any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  imageUrl.value = currentFile.response.data;
};

const expand_prompt = ref(false);

const ai_generate = () => {
  draw_loading.value = true;
  video_create({
    prompt: input2.value,
    expand_prompt: expand_prompt.value,
    image_url: imageUrl.value,
  })
    .then((res: any) => {
      draw_loading.value = false;
      is_sc.value = true;
      timer.value = setInterval(() => {
        check_task(res._rawValue.video_id);
      }, 6000);
      allTimer.value = setInterval(() => {
        video_list_get();
      }, 6000);
      Message.success(res._rawValue.message);
    })
    .catch((err: any) => {
      draw_loading.value = false;
      console.log(err);
    });
};

const ai_generate_chatglm = () => {
  draw_loading.value = true;
  video_create_chatglm({
    prompt: input2.value,
    image_url: imageUrl.value,
  })
    .then((res: any) => {
      draw_loading.value = false;
      is_sc.value = true;
      timer.value = setInterval(() => {
        check_task(res._rawValue.video_id);
      }, 6000);
      allTimer.value = setInterval(() => {
        video_list_get();
      }, 6000);
      Message.success(res._rawValue.message);
    })
    .catch((err: any) => {
      draw_loading.value = false;
      console.log(err);
    });
};

const timer = ref(null) as any;
const allTimer = ref(null) as any;
const is_sc = ref(false);

const check_task = (video_id: any) => {
  video_check({
    id: video_id,
  })
    .then((res) => {
      if (res._rawValue.data.progress == 100) {
        clearInterval(timer.value);
        now_video.value = res._rawValue.data;
        is_sc.value = false;
        is_finish.value = true;
      } else {
        is_sc.value = true;
        is_finish.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const {
  public: { baseUrl },
} = useRuntimeConfig();
const download = async (urls: any) => {
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
    a.download = "视频.mp4";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载文件失败:", error);
  }
};

const page = ref(1);
const limit = ref(10);
const all_video = ref([]) as any;
const count = ref(0);
const refresh_loading = ref(false);
const right_sout = ref(false);
const is_finish = ref(false);
const now_video = ref("");
const draw_loading = ref(false);
const video_list_get = () => {
  refresh_loading.value = true;
  get_video_list({
    page: page.value,
    limit: limit.value,
  })
    .then((res) => {
      all_video.value = res._rawValue.data;
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
  video_list_get();
};

const deleteVideo = (ids: any) => {
  video_delete({
    id: ids,
  })
    .then((res: any) => {
      Message.success("删除成功");
      video_list_get();
      now_video.value = "";
      is_finish.value = false;
    })
    .catch((e: any) => {
      console.log(e);
    });
};

const delete_video_nofinish = () => {
  video_delete_all()
    .then((res) => {
      Message.success(res._rawValue.message);
      video_list_get();
      clearInterval(allTimer.value);
      clearInterval(timer.value);
      is_sc.value = false;
      is_finish.value = false;
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

const square_video = (video_id: any) => {
  video_square({
    video_id: video_id,
    prompt: now_video.value.prompt,
  })
    .then((res: any) => {
      draw_loading.value = false;
      is_sc.value = true;
      timer.value = setInterval(() => {
        check_task(res._rawValue.video_id);
      }, 6000);
      allTimer.value = setInterval(() => {
        video_list_get();
      }, 6000);
      Message.success(res._rawValue.message);
    })
    .catch((err: any) => {
      console.log(err);
    });
};

if (token.value) {
  video_list_get();
  get_user_balance();
}

onUnmounted(() => {
  clearInterval(allTimer.value);
  clearInterval(timer.value);
});
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
