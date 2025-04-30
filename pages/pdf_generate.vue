<template>
  <div class="pdf-gene w-full flex">
    <div
      style="width: 15%; min-width: 260px; margin-left: 1px"
      class="flex h-full flex-col bg-[#fafbfc] chat-message-left ai_pdf_list"
    >
      <a-space class="p-2 bg-white">
        <a-input-search
          v-model="qs_input"
          @search="qs_search"
          @keydown.enter.native="qs_search"
          placeholder="搜索..."
        />
        <a-button type="primary" @click="check_message(0)" status="danger">
          <icon-plus />
        </a-button>
      </a-space>
      <a-spin
        class="overflow-auto h-full"
        :loading="left_loding"
        tip="Loading.."
      >
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
        <div
          v-if="left_list.length > 0"
          class="chat_list_message p-2 bg-[#fafbfc]"
        >
          <p class="all_message mb-2 mt-2">
            <span
              @click="get_left_list()"
              class="py-0 border-0 text-muted"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <icon-refresh class="fs-6 align-text-bottom" />
            </span>
            PDF文档
          </p>
          <ul class="chat-list mb-2">
            <div class="bot_info">
              <li
                class="online list-animation-bottomIn"
                :class="[
                  now_pdf_id == item[item.length - 1].pdf_id ? 'active' : '',
                  'delay-' + index,
                ]"
                v-for="(item, index) in left_list"
                :key="index"
              >
                <div class="hover_action">
                  <a-space>
                    <icon-edit
                      @click="change_sname(item[item.length - 1].pdf_id)"
                    />

                    <a-popconfirm
                      content="此操作将永久删除当前pdf文档,确定要删除吗?"
                      @ok="delete_msg(item[item.length - 1].pdf_id)"
                      type="warning"
                    >
                      <icon-delete />
                    </a-popconfirm>
                  </a-space>
                </div>
                <div
                  class="card mb-2"
                  @click="check_message(item[item.length - 1].pdf_id)"
                >
                  <div class="card-body">
                    <div class="media">
                      <div class="avatar me-3">
                        <svg
                          t="1688027443507"
                          class="icon w-10 inline h-auto"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2439"
                          width="64"
                          height="64 "
                        >
                          <path
                            d="M995.17 246.71v485.97H35.29V246.71c0-118.55 96.1-214.66 214.66-214.66h530.56c118.55 0.01 214.66 96.12 214.66 214.66z"
                            fill="#FDF1F2"
                            p-id="2440"
                          ></path>
                          <path
                            d="M995.17 732.68v44.59c0 118.56-96.11 214.67-214.66 214.67H249.95c-118.56 0-214.66-96.11-214.66-214.67v-44.59h959.88z"
                            fill="#F04D58"
                            p-id="2441"
                          ></path>
                          <path
                            d="M344.31 928.24V803.76h46.96c8.26 0 14.58 0.4 18.93 1.19 6.11 1.02 11.24 2.96 15.37 5.82 4.13 2.86 7.46 6.87 9.98 12.02 2.52 5.15 3.78 10.81 3.78 16.98 0 10.59-3.37 19.54-10.1 26.88-6.74 7.33-18.91 11-36.51 11h-31.93v50.61h-16.48z m16.48-65.3h32.18c10.64 0 18.2-1.98 22.67-5.94 4.47-3.96 6.71-9.54 6.71-16.73 0-5.21-1.32-9.67-3.95-13.37-2.63-3.71-6.1-6.16-10.4-7.34-2.77-0.74-7.9-1.1-15.37-1.1h-31.84v44.48zM467.26 928.24V803.76h42.88c9.68 0 17.07 0.59 22.16 1.78 7.13 1.64 13.22 4.61 18.26 8.92 6.57 5.55 11.48 12.64 14.73 21.27 3.25 8.63 4.88 18.5 4.88 29.59 0 9.45-1.1 17.83-3.31 25.13-2.21 7.3-5.04 13.35-8.49 18.13-3.45 4.78-7.23 8.55-11.34 11.29-4.1 2.75-9.06 4.83-14.86 6.24-5.8 1.42-12.47 2.12-20 2.12h-44.91z m16.47-14.69h26.58c8.21 0 14.65-0.76 19.32-2.29s8.39-3.68 11.17-6.45c3.91-3.91 6.95-9.16 9.13-15.75 2.18-6.59 3.27-14.59 3.27-23.99 0-13.02-2.14-23.02-6.41-30.02-4.27-6.99-9.47-11.68-15.58-14.05-4.42-1.7-11.52-2.55-21.31-2.55h-26.15v95.1zM600.65 928.24V803.76h83.98v14.69h-67.5V857h58.42v14.69h-58.42v56.55h-16.48z"
                            fill="#FFFFFF"
                            p-id="2442"
                          ></path>
                          <path
                            d="M500.21 352.29c-6.1 20.03-14.85 41.39-26.78 64.93-5.3 10.28-11.14 20.01-13.26 28.14l2.92-1.09c33.68-13.25 65.5-20.83 88.57-25.16-3.98-2.71-7.69-5.68-10.87-8.65-15.92-13.8-29.71-33.82-40.58-58.17z m171.83 103.08c-4.51 5.13-12.46 8.11-24.13 8.11-20.16 0-53.03-6.22-79.55-20.02-45.61 5.14-79.55 11.36-106.86 20.29-1.33 0.54-2.92 1.08-4.77 1.89-32.88 57.34-57.28 83.05-78.76 83.05-4.24 0-8.49-1.09-11.67-2.98l-12.73-8.39-0.8-1.35c-1.86-4.87-2.39-9.48-1.33-14.61 2.92-14.33 18.03-37.06 49.85-57.35 5.04-3.8 12.99-8.11 23.6-13.25 7.96-14.07 16.44-30.57 25.46-48.7 13.53-27.86 22.01-55.46 28.64-79.26v-0.27c-9.81-32.73-15.65-52.47-5.83-88.46 2.38-10.28 11.14-20.83 20.95-20.83h6.37c6.1 0 11.93 2.16 16.17 6.49 17.5 17.85 9.28 61.41 0.53 97.38-0.53 1.63-0.8 2.98-1.06 3.79 10.61 30.56 25.72 55.19 42.43 69.25 6.89 5.41 14.59 10.82 23.07 15.7 11.93-1.36 23.33-1.9 34.21-1.9 32.88 0 52.77 5.96 60.46 18.66 2.65 4.34 3.98 9.47 3.18 14.89-0.27 6.77-2.66 13-7.43 17.87z m-10.87-19.22c-2.65-2.7-13.26-9.47-50.38-9.47-1.86 0-3.71 0-6.1 2.71 19.36 8.66 38.18 13.8 50.38 13.8 1.86 0 3.45-0.27 5.04-0.54h1.06c1.33-0.54 2.12-0.81 2.39-3.52-0.54-0.82-1.06-1.9-2.39-2.98z m-243.16 39.5c-5.57 3.25-10.08 6.22-12.73 8.39-18.83 17.58-30.76 35.44-32.08 45.71 11.93-4.05 27.57-21.91 44.81-54.1z m80.08-186.93l1.33-1.09c1.86-8.65 2.65-16.23 4.24-22.18l0.8-4.31c2.65-15.43 2.12-23.27-2.39-29.76l-3.98-1.36c-0.53 0.82-1.33 2.17-1.85 3.25-4.51 11.36-4.25 31.11 1.85 55.45z"
                            fill="#F04D58"
                            p-id="2443"
                          ></path>
                        </svg>
                      </div>
                      <div class="media-body overflow-hidden">
                        <div class="d-flex align-items-center mb-1">
                          <h6 class="text-truncate mb-0 me-auto">
                            {{
                              item[item.length - 1]
                                ? item[item.length - 1]?.title
                                : "未命名.pdf"
                            }}
                          </h6>
                        </div>
                        <div
                          class="text-truncate h-20"
                          v-html="
                            item[item.length - 1].message.replace(
                              /\n/g,
                              '<br />'
                            )
                          "
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          </ul>
        </div>
        <a-empty class="message_empty" v-else />
        <a-pagination
          size="small"
          :total="pdf_list_count"
          :current="page"
          :page-size="page_size"
          class="justify-content-center mb-2"
          background
          simple
          @change="handleCurrentChange"
          :hide-on-single-page="true"
        />
      </a-spin>
      <client-only>
        <div class="left-panel-footer p-2">
          <div class="left-panel-footer__tips mb-2">
            <div class="left-panel-footer__spend-tip">
              <svg
                t="1701775802508"
                class="icon mr-1"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6498"
                width="20"
                height="20"
              >
                <path
                  d="M213.339429 42.660571a170.660571 170.660571 0 0 0-170.678858 170.678858v597.321142a170.660571 170.660571 0 0 0 170.678858 170.678858h597.321142a170.660571 170.660571 0 0 0 170.678858-170.678858V213.357714a170.660571 170.660571 0 0 0-170.678858-170.660571H213.339429z m279.149714 228.041143a36.205714 36.205714 0 0 1 1.974857-0.603428c0.475429 2.395429 0.914286 5.906286 0.914286 10.825143 0.073143 8.045714-0.914286 18.249143-3.072 30.537142-2.907429 16.530286-7.716571 35.547429-14.098286 56.265143a239.36 239.36 0 0 1-7.094857-24.228571c-5.302857-22.857143-4.973714-39.972571-1.152-51.382857 3.291429-9.856 9.563429-17.078857 22.528-21.394286z m55.716571 50.614857c-6.016 34.066286-18.614857 75.52-35.181714 119.424A583.552 583.552 0 0 0 552.228571 498.468571a568.539429 568.539429 0 0 0 48.950858 55.954286c43.337143-6.162286 83.803429-9.142857 116.809142-7.990857 28.397714 0.969143 57.234286 5.065143 76.452572 17.609143 10.715429 6.966857 20.845714 18.212571 23.168 34.505143 2.194286 15.36-3.474286 29.293714-10.660572 40.32-17.536 26.916571-42.130286 42.185143-70.912 45.330285-27.300571 2.980571-55.277714-5.266286-81.115428-18.377142-24.210286-12.288-48.786286-29.988571-72.466286-51.072a1184.914286 1184.914286 0 0 0-76.251428 15.451428 1085.568 1085.568 0 0 0-96.786286 27.556572c-16.731429 28.617143-33.645714 54.857143-49.92 77.019428-19.017143 25.856-38.637714 48.219429-57.472 61.696-9.325714 6.674286-20.845714 12.928-33.792 14.482286a46.409143 46.409143 0 0 1-39.826286-14.189714c-10.788571-11.227429-18.651429-24.393143-21.449143-39.424-2.816-15.250286 0.091429-29.732571 6.326857-42.514286 11.739429-24.082286 35.968-43.812571 62.537143-59.867429 26.258286-15.872 58.934857-30.592 94.848-43.721143a1470.043429 1470.043429 0 0 0 79.780572-166.180571c-15.890286-30.226286-28.032-60.525714-34.596572-88.722286-6.509714-28.068571-8.155429-56.905143 0.329143-82.249143 9.014857-26.953143 28.708571-47.323429 58.386286-57.216 12.617143-4.205714 27.081143-6.198857 41.142857-1.353142 15.012571 5.174857 24.557714 16.402286 29.842286 28.544 4.955429 11.428571 6.528 24.283429 6.601143 36.498285 0.091429 12.544-1.408 26.331429-3.931429 40.758857z m-73.252571 209.974858c4.022857-8.740571 7.972571-17.536 11.830857-26.331429a657.481143 657.481143 0 0 0 47.451429 61.001143 1259.209143 1259.209143 0 0 0-86.052572 20.553143c9.252571-18.176 18.230857-36.699429 26.770286-55.222857z m205.641143 83.931428c-6.016-3.053714-12.141714-6.582857-18.358857-10.550857 19.803429-1.536 37.961143-2.084571 53.778285-1.536 21.412571 0.731429 35.053714 3.419429 42.459429 6.107429-8.649143 12.635429-18.249143 17.408-28.617143 18.541714-12.196571 1.334857-28.708571-2.139429-49.261714-12.562286z m-375.442286 88.301714c3.766857-2.267429 7.698286-4.534857 11.812571-6.765714-1.078857 1.481143-2.139429 2.962286-3.218285 4.388572-18.048 24.594286-33.426286 41.051429-44.763429 49.188571a49.371429 49.371429 0 0 1-3.602286 2.358857 15.232 15.232 0 0 1-2.633142-5.686857c-0.274286-1.426286-0.292571-3.602286 1.517714-7.314286 4.352-8.941714 16.804571-21.613714 40.886857-36.169143z"
                  fill="#FF4747"
                  p-id="6499"
                ></path>
              </svg>
              每页{{ pdf_limit }}{{ counter.setting.money_name_set }}/会员{{
                counter.setting.pdf_generate_limit
              }}次
            </div>
            <div class="disclaimer">
              <div class="disclaimer">
                <a-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    您应当合法合规使用本服务，并承担由此产生的所有责任。<br />本服务生成的作品仅供个人学习交流使用，不可用于商业用途<br />对您的使用不做保证且不承担任何责任。
                  </template>
                  <div class="d-sm-flex align-items-center">
                    <svg
                      role="img"
                      aria-label="warning"
                      focusable="false"
                      data-icon="warning"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="gd_design_icon gd_design_icon-warning"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.25 14V7H12.75V14H11.25ZM11.25 17V15.5H12.75V17H11.25Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    免责声明
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
          <client-only>
            <a-popconfirm
              content="此操作将永久删除所有PDF,确定要删除吗?"
              @ok="delete_all"
              type="warning"
            >
              <a-button
                type="primary"
                status="danger"
                class="w-full flex m-auto mb-2"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>清空所有PDF</template>
              </a-button>
            </a-popconfirm>
          </client-only>
        </div>
      </client-only>
    </div>
    <main class="main overflow-auto ai-pdf">
      <!--header-->
      <div class="ai-header" style="top: 0px; height: 60px">
        <div class="ai-header__left" @click="change_drawer()">
          <icon-menu-unfold size="24" />
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
      <div class="w-full flex items-center vh-100">
        <div
          class="w-full"
          :class="
            now_pdf_id == 0
              ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
              : 'h-full overflow-hidden'
          "
        >
          <div
            class="flex flex-column align-items-center"
            v-if="now_pdf_id == 0"
          >
            <h1 class="mt-10 mb-10">PDF解析工具</h1>
            <a-card hoverable class="upload_card">
              <a-upload
                class="avatar-uploader"
                :action="actions"
                :show-file-list="false"
                :headers="{ Authorization: 'Bearer ' + token }"
                @before-upload="beforeUpload"
                @success="picSuccess"
                draggable
                multiple
                accept="application/pdf"
              >
                <template #upload-button>
                  <div>
                    <div
                      class="arco-upload-list-picture w-100 h-auto custom-upload-avatar"
                      v-if="imageUrl.length > 0"
                    >
                      <a-tag color="arcoblue">
                        总页数：{{ total_pages }} 页 | 需消耗
                        {{ (total_pages * pdf_limit).toFixed(2) }}
                        {{ counter.setting.money_name_set }}/会员次数
                        {{ total_pages * counter.setting.pdf_generate_limit }}
                        次
                      </a-tag>
                      <div v-for="(item, index) in imageUrl" :key="index">
                        <svg
                          t="1688027443507"
                          class="icon w-16 inline h-auto"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2439"
                          width="128"
                          height="128"
                        >
                          <path
                            d="M995.17 246.71v485.97H35.29V246.71c0-118.55 96.1-214.66 214.66-214.66h530.56c118.55 0.01 214.66 96.12 214.66 214.66z"
                            fill="#FDF1F2"
                            p-id="2440"
                          ></path>
                          <path
                            d="M995.17 732.68v44.59c0 118.56-96.11 214.67-214.66 214.67H249.95c-118.56 0-214.66-96.11-214.66-214.67v-44.59h959.88z"
                            fill="#F04D58"
                            p-id="2441"
                          ></path>
                          <path
                            d="M344.31 928.24V803.76h46.96c8.26 0 14.58 0.4 18.93 1.19 6.11 1.02 11.24 2.96 15.37 5.82 4.13 2.86 7.46 6.87 9.98 12.02 2.52 5.15 3.78 10.81 3.78 16.98 0 10.59-3.37 19.54-10.1 26.88-6.74 7.33-18.91 11-36.51 11h-31.93v50.61h-16.48z m16.48-65.3h32.18c10.64 0 18.2-1.98 22.67-5.94 4.47-3.96 6.71-9.54 6.71-16.73 0-5.21-1.32-9.67-3.95-13.37-2.63-3.71-6.1-6.16-10.4-7.34-2.77-0.74-7.9-1.1-15.37-1.1h-31.84v44.48zM467.26 928.24V803.76h42.88c9.68 0 17.07 0.59 22.16 1.78 7.13 1.64 13.22 4.61 18.26 8.92 6.57 5.55 11.48 12.64 14.73 21.27 3.25 8.63 4.88 18.5 4.88 29.59 0 9.45-1.1 17.83-3.31 25.13-2.21 7.3-5.04 13.35-8.49 18.13-3.45 4.78-7.23 8.55-11.34 11.29-4.1 2.75-9.06 4.83-14.86 6.24-5.8 1.42-12.47 2.12-20 2.12h-44.91z m16.47-14.69h26.58c8.21 0 14.65-0.76 19.32-2.29s8.39-3.68 11.17-6.45c3.91-3.91 6.95-9.16 9.13-15.75 2.18-6.59 3.27-14.59 3.27-23.99 0-13.02-2.14-23.02-6.41-30.02-4.27-6.99-9.47-11.68-15.58-14.05-4.42-1.7-11.52-2.55-21.31-2.55h-26.15v95.1zM600.65 928.24V803.76h83.98v14.69h-67.5V857h58.42v14.69h-58.42v56.55h-16.48z"
                            fill="#FFFFFF"
                            p-id="2442"
                          ></path>
                          <path
                            d="M500.21 352.29c-6.1 20.03-14.85 41.39-26.78 64.93-5.3 10.28-11.14 20.01-13.26 28.14l2.92-1.09c33.68-13.25 65.5-20.83 88.57-25.16-3.98-2.71-7.69-5.68-10.87-8.65-15.92-13.8-29.71-33.82-40.58-58.17z m171.83 103.08c-4.51 5.13-12.46 8.11-24.13 8.11-20.16 0-53.03-6.22-79.55-20.02-45.61 5.14-79.55 11.36-106.86 20.29-1.33 0.54-2.92 1.08-4.77 1.89-32.88 57.34-57.28 83.05-78.76 83.05-4.24 0-8.49-1.09-11.67-2.98l-12.73-8.39-0.8-1.35c-1.86-4.87-2.39-9.48-1.33-14.61 2.92-14.33 18.03-37.06 49.85-57.35 5.04-3.8 12.99-8.11 23.6-13.25 7.96-14.07 16.44-30.57 25.46-48.7 13.53-27.86 22.01-55.46 28.64-79.26v-0.27c-9.81-32.73-15.65-52.47-5.83-88.46 2.38-10.28 11.14-20.83 20.95-20.83h6.37c6.1 0 11.93 2.16 16.17 6.49 17.5 17.85 9.28 61.41 0.53 97.38-0.53 1.63-0.8 2.98-1.06 3.79 10.61 30.56 25.72 55.19 42.43 69.25 6.89 5.41 14.59 10.82 23.07 15.7 11.93-1.36 23.33-1.9 34.21-1.9 32.88 0 52.77 5.96 60.46 18.66 2.65 4.34 3.98 9.47 3.18 14.89-0.27 6.77-2.66 13-7.43 17.87z m-10.87-19.22c-2.65-2.7-13.26-9.47-50.38-9.47-1.86 0-3.71 0-6.1 2.71 19.36 8.66 38.18 13.8 50.38 13.8 1.86 0 3.45-0.27 5.04-0.54h1.06c1.33-0.54 2.12-0.81 2.39-3.52-0.54-0.82-1.06-1.9-2.39-2.98z m-243.16 39.5c-5.57 3.25-10.08 6.22-12.73 8.39-18.83 17.58-30.76 35.44-32.08 45.71 11.93-4.05 27.57-21.91 44.81-54.1z m80.08-186.93l1.33-1.09c1.86-8.65 2.65-16.23 4.24-22.18l0.8-4.31c2.65-15.43 2.12-23.27-2.39-29.76l-3.98-1.36c-0.53 0.82-1.33 2.17-1.85 3.25-4.51 11.36-4.25 31.11 1.85 55.45z"
                            fill="#F04D58"
                            p-id="2443"
                          ></path>
                        </svg>
                        <div class="flex justify-center">
                          <p>名称：{{ pdf_name[index] }} |</p>
                          <span>
                            大小：{{ pdf_size[index] }}KB | 页数：{{
                              pdf_pages[index]
                            }}</span
                          >
                        </div>

                        <div class="arco-upload-list-picture-mask">
                          <IconPlus />
                        </div>
                      </div>
                    </div>
                    <div
                      class="arco-upload-picture-card pl-20 pr-20 h-48"
                      v-else
                    >
                      <div class="arco-upload-picture-card-text">
                        <icon-cloud class="fs-2" />
                        <div>点击或拖拽PDF文件到这进行解析</div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
              <div
                class="w-full flex justify-content-center"
                v-if="imageUrl.length > 0"
              >
                <a-space>
                  <a-button
                    type="primary"
                    :loading="generate_load"
                    @click="generatePDF()"
                  >
                    <template #icon>
                      <icon-mosaic />
                    </template>
                    进行解析
                  </a-button>
                  <a-button
                    type="primary"
                    :loading="generate_load"
                    status="danger"
                    @click="deletePic()"
                  >
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除PDF文档
                  </a-button>
                </a-space>
              </div>
            </a-card>
          </div>
          <a-spin :loading="content_load" class="h-full">
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
                      <stop
                        offset="1"
                        stop-color="#1765FF"
                        stop-opacity="0"
                      ></stop>
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
                      <stop
                        offset="1"
                        stop-color="#8AB1FF"
                        stop-opacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </template>
            <a-row class="h-full" v-if="imageUrl.length > 0 && now_pdf_id != 0">
              <a-col :xs="{ span: 24 }" :lg="{ span: 12 }" class="mb-3 h-full">
                <iframe
                  :src="currentImageUrl"
                  width="100%"
                  height="94%"
                ></iframe>
                <a-pagination
                  simple
                  page-size="1"
                  class="mt-2 w-full justify-center"
                  :total="imageUrl.length"
                  @change="handlePageChange"
                />
              </a-col>
              <a-col :xs="{ span: 24 }" :lg="{ span: 12 }" class="h-full">
                <a-card
                  :title="pdf_name[0] ? pdf_name[0] : '未命名.pdf'"
                  style="min-height: 600px"
                  class="mes_content h-full"
                >
                  <template #extra>
                    <a-space>
                      <a-tooltip content="编辑名称">
                        <a-button
                          type="primary"
                          @click="change_sname(now_pdf_id)"
                        >
                          <template #icon>
                            <icon-edit />
                          </template>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip content="删除当前会话">
                        <a-popconfirm
                          content="此操作将永久删除当前pdf文档,确定要删除吗?"
                          @ok="delete_msg(now_pdf_id)"
                          type="warning"
                        >
                          <a-button type="primary">
                            <template #icon>
                              <icon-delete />
                            </template>
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                      <a-tooltip content="导出为word">
                        <a-button type="primary" @click="export_word()">
                          <template #icon>
                            <icon-share-internal />
                          </template>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip content="positive">
                        <a-button
                          type="primary"
                          round
                          class="button"
                          @click="handleThumbsUp(now_pdf_id)"
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
                      </a-tooltip>
                      <!-- Thumbs Down -->
                      <a-tooltip content="negative">
                        <a-button
                          type="primary"
                          round
                          class="button"
                          @click="handleThumbsDown(now_pdf_id)"
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
                      </a-tooltip>
                    </a-space>
                  </template>
                  <a-spin
                    :loading="pdf_generate_end"
                    class="d-flex justify-content-center flex-wrap"
                  >
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
                              <stop
                                offset="1"
                                stop-color="#1765FF"
                                stop-opacity="0"
                              ></stop>
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
                              <stop
                                offset="1"
                                stop-color="#8AB1FF"
                                stop-opacity="0"
                              ></stop>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </template>
                    <div class="chat_content p-4 w-full">
                      <div class="chat_message_all">
                        <div
                          class="message_right_all"
                          v-for="(mes, mes_index) in now_message"
                          :key="mes_index"
                        >
                          <div
                            v-if="mes.question"
                            class="chat-message-row list-animation-bottomIn human"
                            :class="['delay' + mes_index]"
                          >
                            <div
                              class="chat-message"
                              v-html="
                                renderMarkdown(
                                  mes.question != ''
                                    ? mes.question
                                    : mes.message
                                )
                              "
                            ></div>
                          </div>
                          <div
                            v-if="mes.message"
                            class="chat-message-row list-animation-bottomIn ai"
                            :class="['delay' + mes_index]"
                          >
                            <div
                              class="chat-message"
                              v-html="
                                renderMarkdown(
                                  mes.message != '' ? mes.message : ''
                                )
                              "
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="mes_footer position-absolute bottom-0 d-flex w-full p-4"
                    >
                      <a-textarea
                        placeholder="询问pdf相关内容"
                        v-model="input_message"
                        allow-clear
                        :auto-size="{
                          minRows: 1,
                          maxRows: 4,
                        }"
                        @keydown.enter.native.prevent="send_pdf()"
                        show-word-limit
                      />
                      <a-button
                        class="ml-1"
                        @click="send_pdf()"
                        type="primary"
                        :loading="send_loading"
                      >
                        <icon-send class="text-lg" />
                      </a-button>
                    </div>
                  </a-spin>
                </a-card>
              </a-col>
            </a-row>
          </a-spin>
          <a-row :gutter="20" class="mt-4 mb-4" v-if="now_pdf_id == 0">
            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 8 }"
              v-for="(tip, tip_index) in pdf_tip"
              :key="tip_index"
              class="list-animation-leftIn mb-2"
              :class="'delay' - tip_index"
            >
              <a-card :title="tip.title" class="shadow-sm">
                {{ tip.description }}
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </main>
    <Login :login_dialog="login_dialog" @handleCancel="handleCancel" />
    <a-modal v-model:visible="beizhu_info" title="修改名称" @ok="handle_send">
      <a-input v-model="beizhu" placeholder="修改pdf名称" />
    </a-modal>
    <a-drawer
      v-model:visible="drawer"
      placement="left"
      class="left_pdf"
      width="60%"
      :header="false"
    >
      <div class="flex h-full flex-col bg-[#fafbfc] ai_pdf_list">
        <a-space class="p-2 bg-white">
          <a-input-search
            v-model="qs_input"
            @search="qs_search"
            @keydown.enter.native="qs_search"
            placeholder="搜索..."
          />
          <a-button type="primary" @click="check_message(0)" status="danger">
            <icon-plus />
          </a-button>
        </a-space>
        <a-spin
          class="overflow-auto h-full"
          :loading="left_loding"
          tip="Loading.."
        >
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
                    <stop
                      offset="1"
                      stop-color="#1765FF"
                      stop-opacity="0"
                    ></stop>
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
                    <stop
                      offset="1"
                      stop-color="#8AB1FF"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </template>
          <div
            v-if="left_list.length > 0"
            class="chat_list_message p-2 bg-[#fafbfc]"
          >
            <p class="all_message mb-2 mt-2">
              <span
                @click="get_left_list()"
                class="py-0 border-0 text-muted"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <icon-refresh class="fs-6 align-text-bottom" />
              </span>
              PDF文档
            </p>
            <ul class="chat-list mb-2">
              <div class="bot_info">
                <li
                  class="online list-animation-bottomIn"
                  :class="[
                    now_pdf_id == item[item.length - 1].pdf_id ? 'active' : '',
                    'delay-' + index,
                  ]"
                  v-for="(item, index) in left_list"
                  :key="index"
                >
                  <div class="hover_action">
                    <a-space>
                      <icon-edit
                        @click="change_sname(item[item.length - 1].pdf_id)"
                      />

                      <a-popconfirm
                        content="此操作将永久删除当前pdf文档,确定要删除吗?"
                        @ok="delete_msg(item[item.length - 1].pdf_id)"
                        type="warning"
                      >
                        <icon-delete />
                      </a-popconfirm>
                    </a-space>
                  </div>
                  <div
                    class="card mb-2"
                    @click="check_message(item[item.length - 1].pdf_id)"
                  >
                    <div class="card-body">
                      <div class="media">
                        <div class="avatar me-3">
                          <svg
                            t="1688027443507"
                            class="icon w-10 inline h-auto"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="2439"
                            width="64"
                            height="64 "
                          >
                            <path
                              d="M995.17 246.71v485.97H35.29V246.71c0-118.55 96.1-214.66 214.66-214.66h530.56c118.55 0.01 214.66 96.12 214.66 214.66z"
                              fill="#FDF1F2"
                              p-id="2440"
                            ></path>
                            <path
                              d="M995.17 732.68v44.59c0 118.56-96.11 214.67-214.66 214.67H249.95c-118.56 0-214.66-96.11-214.66-214.67v-44.59h959.88z"
                              fill="#F04D58"
                              p-id="2441"
                            ></path>
                            <path
                              d="M344.31 928.24V803.76h46.96c8.26 0 14.58 0.4 18.93 1.19 6.11 1.02 11.24 2.96 15.37 5.82 4.13 2.86 7.46 6.87 9.98 12.02 2.52 5.15 3.78 10.81 3.78 16.98 0 10.59-3.37 19.54-10.1 26.88-6.74 7.33-18.91 11-36.51 11h-31.93v50.61h-16.48z m16.48-65.3h32.18c10.64 0 18.2-1.98 22.67-5.94 4.47-3.96 6.71-9.54 6.71-16.73 0-5.21-1.32-9.67-3.95-13.37-2.63-3.71-6.1-6.16-10.4-7.34-2.77-0.74-7.9-1.1-15.37-1.1h-31.84v44.48zM467.26 928.24V803.76h42.88c9.68 0 17.07 0.59 22.16 1.78 7.13 1.64 13.22 4.61 18.26 8.92 6.57 5.55 11.48 12.64 14.73 21.27 3.25 8.63 4.88 18.5 4.88 29.59 0 9.45-1.1 17.83-3.31 25.13-2.21 7.3-5.04 13.35-8.49 18.13-3.45 4.78-7.23 8.55-11.34 11.29-4.1 2.75-9.06 4.83-14.86 6.24-5.8 1.42-12.47 2.12-20 2.12h-44.91z m16.47-14.69h26.58c8.21 0 14.65-0.76 19.32-2.29s8.39-3.68 11.17-6.45c3.91-3.91 6.95-9.16 9.13-15.75 2.18-6.59 3.27-14.59 3.27-23.99 0-13.02-2.14-23.02-6.41-30.02-4.27-6.99-9.47-11.68-15.58-14.05-4.42-1.7-11.52-2.55-21.31-2.55h-26.15v95.1zM600.65 928.24V803.76h83.98v14.69h-67.5V857h58.42v14.69h-58.42v56.55h-16.48z"
                              fill="#FFFFFF"
                              p-id="2442"
                            ></path>
                            <path
                              d="M500.21 352.29c-6.1 20.03-14.85 41.39-26.78 64.93-5.3 10.28-11.14 20.01-13.26 28.14l2.92-1.09c33.68-13.25 65.5-20.83 88.57-25.16-3.98-2.71-7.69-5.68-10.87-8.65-15.92-13.8-29.71-33.82-40.58-58.17z m171.83 103.08c-4.51 5.13-12.46 8.11-24.13 8.11-20.16 0-53.03-6.22-79.55-20.02-45.61 5.14-79.55 11.36-106.86 20.29-1.33 0.54-2.92 1.08-4.77 1.89-32.88 57.34-57.28 83.05-78.76 83.05-4.24 0-8.49-1.09-11.67-2.98l-12.73-8.39-0.8-1.35c-1.86-4.87-2.39-9.48-1.33-14.61 2.92-14.33 18.03-37.06 49.85-57.35 5.04-3.8 12.99-8.11 23.6-13.25 7.96-14.07 16.44-30.57 25.46-48.7 13.53-27.86 22.01-55.46 28.64-79.26v-0.27c-9.81-32.73-15.65-52.47-5.83-88.46 2.38-10.28 11.14-20.83 20.95-20.83h6.37c6.1 0 11.93 2.16 16.17 6.49 17.5 17.85 9.28 61.41 0.53 97.38-0.53 1.63-0.8 2.98-1.06 3.79 10.61 30.56 25.72 55.19 42.43 69.25 6.89 5.41 14.59 10.82 23.07 15.7 11.93-1.36 23.33-1.9 34.21-1.9 32.88 0 52.77 5.96 60.46 18.66 2.65 4.34 3.98 9.47 3.18 14.89-0.27 6.77-2.66 13-7.43 17.87z m-10.87-19.22c-2.65-2.7-13.26-9.47-50.38-9.47-1.86 0-3.71 0-6.1 2.71 19.36 8.66 38.18 13.8 50.38 13.8 1.86 0 3.45-0.27 5.04-0.54h1.06c1.33-0.54 2.12-0.81 2.39-3.52-0.54-0.82-1.06-1.9-2.39-2.98z m-243.16 39.5c-5.57 3.25-10.08 6.22-12.73 8.39-18.83 17.58-30.76 35.44-32.08 45.71 11.93-4.05 27.57-21.91 44.81-54.1z m80.08-186.93l1.33-1.09c1.86-8.65 2.65-16.23 4.24-22.18l0.8-4.31c2.65-15.43 2.12-23.27-2.39-29.76l-3.98-1.36c-0.53 0.82-1.33 2.17-1.85 3.25-4.51 11.36-4.25 31.11 1.85 55.45z"
                              fill="#F04D58"
                              p-id="2443"
                            ></path>
                          </svg>
                        </div>
                        <div class="media-body overflow-hidden">
                          <div class="d-flex align-items-center mb-1">
                            <h6 class="text-truncate mb-0 me-auto">
                              {{
                                item[item.length - 1].title
                                  ? item[item.length - 1].title
                                  : "未命名.pdf"
                              }}
                            </h6>
                          </div>
                          <div
                            class="text-truncate h-20"
                            v-html="
                              item[item.length - 1].message.replace(
                                /\n/g,
                                '<br />'
                              )
                            "
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            </ul>
          </div>
          <a-empty class="message_empty" v-else />
          <a-pagination
            size="small"
            :total="pdf_list_count"
            :current="page"
            :page-size="page_size"
            class="justify-content-center mb-2"
            background
            simple
            @change="handleCurrentChange"
            :hide-on-single-page="true"
          />
        </a-spin>
      </div>
      <template #footer>
        <div class="left-panel-footer p-2">
          <div class="left-panel-footer__tips mb-2">
            <div class="left-panel-footer__spend-tip">
              <svg
                t="1701775802508"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6498"
                width="20"
                height="20"
              >
                <path
                  d="M213.339429 42.660571a170.660571 170.660571 0 0 0-170.678858 170.678858v597.321142a170.660571 170.660571 0 0 0 170.678858 170.678858h597.321142a170.660571 170.660571 0 0 0 170.678858-170.678858V213.357714a170.660571 170.660571 0 0 0-170.678858-170.660571H213.339429z m279.149714 228.041143a36.205714 36.205714 0 0 1 1.974857-0.603428c0.475429 2.395429 0.914286 5.906286 0.914286 10.825143 0.073143 8.045714-0.914286 18.249143-3.072 30.537142-2.907429 16.530286-7.716571 35.547429-14.098286 56.265143a239.36 239.36 0 0 1-7.094857-24.228571c-5.302857-22.857143-4.973714-39.972571-1.152-51.382857 3.291429-9.856 9.563429-17.078857 22.528-21.394286z m55.716571 50.614857c-6.016 34.066286-18.614857 75.52-35.181714 119.424A583.552 583.552 0 0 0 552.228571 498.468571a568.539429 568.539429 0 0 0 48.950858 55.954286c43.337143-6.162286 83.803429-9.142857 116.809142-7.990857 28.397714 0.969143 57.234286 5.065143 76.452572 17.609143 10.715429 6.966857 20.845714 18.212571 23.168 34.505143 2.194286 15.36-3.474286 29.293714-10.660572 40.32-17.536 26.916571-42.130286 42.185143-70.912 45.330285-27.300571 2.980571-55.277714-5.266286-81.115428-18.377142-24.210286-12.288-48.786286-29.988571-72.466286-51.072a1184.914286 1184.914286 0 0 0-76.251428 15.451428 1085.568 1085.568 0 0 0-96.786286 27.556572c-16.731429 28.617143-33.645714 54.857143-49.92 77.019428-19.017143 25.856-38.637714 48.219429-57.472 61.696-9.325714 6.674286-20.845714 12.928-33.792 14.482286a46.409143 46.409143 0 0 1-39.826286-14.189714c-10.788571-11.227429-18.651429-24.393143-21.449143-39.424-2.816-15.250286 0.091429-29.732571 6.326857-42.514286 11.739429-24.082286 35.968-43.812571 62.537143-59.867429 26.258286-15.872 58.934857-30.592 94.848-43.721143a1470.043429 1470.043429 0 0 0 79.780572-166.180571c-15.890286-30.226286-28.032-60.525714-34.596572-88.722286-6.509714-28.068571-8.155429-56.905143 0.329143-82.249143 9.014857-26.953143 28.708571-47.323429 58.386286-57.216 12.617143-4.205714 27.081143-6.198857 41.142857-1.353142 15.012571 5.174857 24.557714 16.402286 29.842286 28.544 4.955429 11.428571 6.528 24.283429 6.601143 36.498285 0.091429 12.544-1.408 26.331429-3.931429 40.758857z m-73.252571 209.974858c4.022857-8.740571 7.972571-17.536 11.830857-26.331429a657.481143 657.481143 0 0 0 47.451429 61.001143 1259.209143 1259.209143 0 0 0-86.052572 20.553143c9.252571-18.176 18.230857-36.699429 26.770286-55.222857z m205.641143 83.931428c-6.016-3.053714-12.141714-6.582857-18.358857-10.550857 19.803429-1.536 37.961143-2.084571 53.778285-1.536 21.412571 0.731429 35.053714 3.419429 42.459429 6.107429-8.649143 12.635429-18.249143 17.408-28.617143 18.541714-12.196571 1.334857-28.708571-2.139429-49.261714-12.562286z m-375.442286 88.301714c3.766857-2.267429 7.698286-4.534857 11.812571-6.765714-1.078857 1.481143-2.139429 2.962286-3.218285 4.388572-18.048 24.594286-33.426286 41.051429-44.763429 49.188571a49.371429 49.371429 0 0 1-3.602286 2.358857 15.232 15.232 0 0 1-2.633142-5.686857c-0.274286-1.426286-0.292571-3.602286 1.517714-7.314286 4.352-8.941714 16.804571-21.613714 40.886857-36.169143z"
                  fill="#FF4747"
                  p-id="6499"
                ></path>
              </svg>
              每页{{ pdf_limit }}{{ counter.setting.money_name_set }}/会员{{
                counter.setting.pdf_generate_limit
              }}次
            </div>
            <div class="disclaimer">
              <div class="disclaimer">
                <a-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    您应当合法合规使用本服务，并承担由此产生的所有责任。<br />本服务生成的作品仅供个人学习交流使用，不可用于商业用途<br />对您的使用不做保证且不承担任何责任。
                  </template>
                  <div class="d-sm-flex align-items-center">
                    <svg
                      role="img"
                      aria-label="warning"
                      focusable="false"
                      data-icon="warning"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="gd_design_icon gd_design_icon-warning"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11.25 14V7H12.75V14H11.25ZM11.25 17V15.5H12.75V17H11.25Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    免责声明
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
          <client-only>
            <a-popconfirm
              content="此操作将永久删除所有PDF,确定要删除吗?"
              @ok="delete_all"
              type="warning"
            >
              <a-button
                type="primary"
                status="danger"
                class="w-full flex m-auto mb-2"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>清空所有PDF</template>
              </a-button>
            </a-popconfirm>
          </client-only>
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
import { ref } from "vue";
import {
  IconCloud,
  IconDelete,
  IconPlus,
  IconMosaic,
  IconSend,
  IconEdit,
  IconRefresh,
  IconShareInternal,
  IconDownload,
  IconMenuUnfold,
} from "@arco-design/web-vue/es/icon";
import fileSaver from "file-saver";

import { Message } from "@arco-design/web-vue";
import { useCounter } from "~/store/counter";

import markdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItKatex from "markdown-it-katex";
import { asBlob } from "html-docx-js-typescript";
import { count } from "d3-array";
import FeedbackModal from "~/components/chat/FeedbackModal.vue";
import { useCookie } from "nuxt/app";
import { computed } from "vue";
import { submitMessageReport } from "~/api/api";
const renderMarkdown = (markdown: any) => {
  return markdownIt({
    linkify: true, // 添加linkify插件
    highlight: (str: string, lang: string) => {
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
    breaks: true, // 添加breaks插件
  })
    .use(markdownItKatex)
    .render(markdown);
};
const token = useCookie("token");
definePageMeta({
  middleware: ["mustlogin"],
});
const counter = useCounter();
const actions = counter.setting.APP_URL + "/api/upload_pdf";
useHead({
  title: "pdf解析 - " + counter.setting.title,
  meta: [
    { name: "description", content: counter.setting.description },
    { name: "keywords", content: counter.setting.keywords },
  ],
});
const imageUrl = ref([]) as any;
const pdf_size = ref([]) as any;
const pdf_name = ref([]) as any;
const pdf_pages = ref([]) as any;
const pdf_generate_end = ref(false);
const send_loading = ref(false);
const input_message = ref("");
const pdf_list_count = ref(0);
const modelKey = ref("pdf_generate");
const generate_load = ref(false);
const now_message = ref([]);
const now_pdf_id = ref("");
const login_dialog = ref(false);
const page = ref(1);
const page_size = ref(8);
const qs_input = ref("");
const left_loding = ref(false);
const handleCurrentChange = (val: number) => {
  left_loding.value = true;
  page.value = 1;
  page.value = val;
  if (qs_input.value) {
    qs_search();
  } else {
    get_left_list();
  }
};
const qs_search = () => {
  // 搜索功能
  left_loding.value = true;
  pdf_message_search({
    page: page.value,
    limit: page_size.value,
    qs: qs_input.value,
  })
    .then((res) => {
      pdf_list_count.value = res._rawValue.count;
      left_list.value = res._rawValue.data;
      left_loding.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
};

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
      reportable_type: "pdfGeneration",
      ai_function: "pdf_generate",
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

const content_load = ref(false);
const currentImageUrl = ref("");
const handlePageChange = (current: number) => {
  currentImageUrl.value = imageUrl.value[current - 1];
};
const check_message = (id: any) => {
  if (id == 0) {
    now_pdf_id.value = "";
    imageUrl.value = [];
    pdf_size.value = [];
    pdf_name.value = [];
    pdf_pages.value = [];
    now_message.value = [];
    currentImageUrl.value = "";

    return;
  }
  content_load.value = true;
  pdf_message_check({
    pdf_id: id,
  })
    .then((res) => {
      now_message.value = res._rawValue.data;
      imageUrl.value = res._rawValue.images;
      if (!currentImageUrl.value) {
        currentImageUrl.value = res._rawValue.images[0];
      }
      pdf_name.value.push(res._rawValue.info.title);
      now_pdf_id.value = id;
      content_load.value = false;
      down_message();
    })
    .catch((err) => {
      console.log(err);
      content_load.value = false;
    });
};

const beizhu_info = ref(false);
const beizhu = ref("");
const change_sname = (id: string) => {
  beizhu_info.value = true;
  now_pdf_id.value = id;
};
const handle_send = () => {
  if (!beizhu.value) {
    Message.warning("请输入内容");
    return true;
  }
  c_pdf_title({
    pdf_id: now_pdf_id.value,
    title: beizhu.value,
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      get_left_list();
      get_now_pdf_message();
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
  beizhu.value = "";
};

const delete_msg = (id: any) => {
  // 删除单条消息
  pdf_message_delete({
    pdf_id: id,
  })
    .then((res) => {
      Message.success("删除成功");
      if (now_pdf_id.value == id) {
        check_message(0);
      }
      get_left_list();
    })
    .catch((err) => {
      console.log(err);
    });
};
const delete_all = () => {
  // 删除所有pdf
  pdf_listdel_all()
    .then((res) => {
      Message.success("删除成功");
      left_list.value = [];
      check_message(0);
      pdf_list_count.value = 0;
    })
    .catch((err) => {
      console.log(err);
    });
};

const pdf_limit = ref(0);
const user_balance = ref(0);
const get_user_balance = () => {
  get_pdf_limit().then((res) => {
    pdf_limit.value = res._rawValue.pdf;
    user_balance.value = res._rawValue.data;
  });
};
if (token.value) {
  get_user_balance();
}
const drawer = ref(false);
const change_drawer = () => {
  drawer.value = true;
};
const total_pages = ref(0);
const picSuccess = (currentFile: any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error("上传失败!");
    return;
  }
  Message.clear();
  Message.success("上传成功!");

  imageUrl.value.push(currentFile.response.data);
  pdf_size.value.push(currentFile.response.size);
  pdf_name.value.push(currentFile.response.name);
  pdf_pages.value.push(currentFile.response.count);
  for (let i = 0; i < pdf_pages.value.length; i++) {
    total_pages.value += pdf_pages.value[i];
  }
};

const beforeUpload = (file: any) => {
  const isPDF = file.type === "application/pdf";
  const isLt2M = file.size / 1024 / 1024 < 15;

  if (!isPDF) {
    Message.error("上传文件只能是 PDF 格式!");
    return false;
  }
  if (!isLt2M) {
    Message.error("上传文件大小不能超过 15MB!");
    return false;
  }
  if (!token.value) {
    login_dialog.value = true;
    Message.error("请先登录!");
    return false;
  }
  Message.loading("上传中...");
  return true;
};
const deletePic = () => {
  imageUrl.value = [];
  pdf_size.value = [];
  pdf_name.value = [];
  pdf_pages.value = [];
  total_pages.value = 0;
  pdf_generate_end.value = false;
  Message.success("删除成功!");
};

const login_dialog_click = () => {
  login_dialog.value = true;
};
const handleCancel = () => {
  login_dialog.value = false;
};
const get_left_list = () => {
  left_loding.value = true;
  pdf_message_all({
    page: page.value,
    limit: page_size.value,
  })
    .then((res: any) => {
      left_list.value = res._rawValue.data;
      pdf_list_count.value = res._rawValue.count;
      left_loding.value = false;
    })
    .catch((err: any) => {
      console.log(err);
      left_loding.value = false;
    });
};

const pdf_tip = ref([]);

const get_all_gdftip = () => {
  pdf_scene()
    .then((res) => {
      pdf_tip.value = res._rawValue.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
get_all_gdftip();
const down_message = () => {
  setTimeout(() => {
    let chat = document.getElementsByClassName("arco-card-body")[0];
    chat.style.transition = "500ms"; // 过渡时间为0.5秒
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
  }, 100);
};
const {
  public: { baseUrl },
} = useRuntimeConfig();
const headers = {
  Authorization: `Bearer ${token.value}`,
  Accept: "text/event-stream",
};
const up_stop = ref("start");
const is_done = ref(true);
const streams = ref();

const export_word = () => {
  let info = document.getElementsByClassName("arco-card-body")[0].innerHTML;
  asBlob(info).then((blob: any) => {
    fileSaver.saveAs(blob, "pdf_answer.docx");
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
const send_pdf = async () => {
  if (input_message.value == "") {
    Message.error("请输入内容!");
    return;
  }
  if (imageUrl.value.length == 0) {
    Message.error("请先上传PDF文件!");
    return;
  }
  if (!token.value) {
    Message.warning("请先登录");
    login_dialog_click();
    return false;
  }
  send_loading.value = true;

  send_loading.value = true;
  now_message.value.push({
    pdf_id: now_pdf_id.value,
    question: input_message.value,
    message: "思考中...",
  });
  down_message();

  const res = await fetch(`${window.APP_CONFIG.baseUrl}send_pdf_ask`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      info: input_message.value,
      pdf_id: now_pdf_id.value,
    }),
  });

  up_stop.value = "start";
  if (res) {
    now_message.value[now_message.value.length - 1].message = "";
  }
  if (res.status == 500) {
    send_loading.value = false;
    Message.error("服务器错误");
    return false;
  }
  if (res.status == 401) {
    send_loading.value = false;
    Message.error("请先登录");
    return false;
  }
  if (res.status == 402) {
    send_loading.value = false;
    now_message.value[now_message.value.length - 1].message =
      "发送次数已达上限或余额不足";
    Message.error("发送次数已达上限或余额不足");
    return false;
  }
  if (res.status == 403) {
    send_loading.value = false;
    now_message.value[now_message.value.length - 1].message = "禁止发送违禁词";
    Message.error("禁止发送违禁词");
    return false;
  }
  let reply_in = false;
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
                now_message.value[now_message.value.length - 1].message +=
                  content;
                down_message();
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
    if (up_stop.value == "end") {
      console.log("end");
      up_stop.value = "start";
      stream?.cancel();
      return false;
    }
    if (result?.done) {
      console.log("done");
      is_done.value = true;
      get_now_pdf_message();
      send_loading.value = false;
      input_message.value = "";
    } else {
      send_loading.value = true;
      is_done.value = false;
      onData(result!);
      await read();
    }
  };
  await read();
};
const generatePDF = () => {
  if (imageUrl.value.length == 0) {
    Message.error("请先上传PDF文件!");
    return;
  }
  Message.loading({
    content: "解析中...",
    duration: 1000000,
  });
  generate_load.value = true;
  gptpdf_generate({
    pdf_url: JSON.stringify(imageUrl.value),
    total_pages: total_pages.value,
  })
    .then((res: any) => {
      now_pdf_id.value = res._rawValue.pdf_id;
      get_now_pdf_message();
      generate_load.value = false;
      get_left_list();
      Message.clear();
      Message.success("解析成功!");
      pdf_size.value = [];
      pdf_name.value = [];
      pdf_pages.value = [];
      total_pages.value = 0;
      pdf_generate_end.value = false;
    })
    .catch((err: any) => {
      console.log(err);
      Message.clear();
      Message.error("解析失败!");
      generate_load.value = false;
    });
};
if (token.value) {
  get_left_list();
}
const left_list = ref([]);

const get_now_pdf_message = () => {
  content_load.value = true;
  pdf_message({
    pdf_id: now_pdf_id.value,
  })
    .then((res: any) => {
      now_message.value = res._rawValue.data;
      imageUrl.value = res._rawValue.images;
      if (!currentImageUrl.value) {
        currentImageUrl.value = res._rawValue.images[0];
      }
      pdf_name.value.push(res._rawValue.info.title);
      content_load.value = false;
    })
    .catch((err: any) => {
      console.log(err);
      content_load.value = false;
    });
};
</script>
