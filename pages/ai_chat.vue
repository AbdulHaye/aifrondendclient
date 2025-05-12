<template>
  <main class="new-chat w-full flex overflow-hidden">
    <Head>
      <Title>AI对话 - {{ counter.setting.title }}</Title>
    </Head>
    <!-- Sidebar -->
    <div
      style="width: 15%; min-width: 260px; margin-left: 1px"
      class="flex h-full flex-col chat-message-left relative"
      :class="!chat_open ? 'is_open' : ''"
    >
      <a-button
        size="mini"
        shape="circle"
        class="absolute aside-nav-btn"
        @click="chat_open = !chat_open"
      >
        <icon-left v-if="chat_open" />
        <icon-right v-else />
      </a-button>
      <a-space class="p-2 flex justify-between w-full">
        <h1 class="m-0 font-bold">Message</h1>
        <div class="message_action">
          <a-button class="rounded mr-2" type="primary" @click="add_new_chat()">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
          <a-popconfirm
            content="此操作将永久删除所有会话,确定要删除吗?"
            @ok="delete_all"
            type="warning"
          >
            <a-button class="rounded">
              <template #icon>
                <icon-delete />
              </template>
            </a-button>
          </a-popconfirm>
        </div>
      </a-space>
      <a-space class="w-full flex justify-between search_space" wrap>
        <a-input-search
          class="ml-2 mr-0 rounded"
          v-model="qs_input"
          @search="qs_search"
          @keydown.enter.native="qs_search"
          placeholder="搜索..."
        />
        <a-button class="rounded mr-2" @click="all_message()">
          <template #icon>
            <icon-loop />
          </template>
        </a-button>
      </a-space>

      <a-spin
        class="overflow-auto h-full"
        :loading="left_loding"
        tip="Loading.."
      >
        <div v-if="messages.length > 0" class="chat_list_message p-2">
          <ul ref="sidebarRef" class="chat-list mb-2">
            <li
              v-for="(item, index) in messages"
              :key="item.session_id"
              class="online list-animation-bottomIn"
              :class="[
                ms_active == item.session_id ? 'active' : '',
                'delay-' + index,
              ]"
              @click="
                loadChatSession(
                  item.session_id,
                  item.is_multi_window,
                  item.models,
                  item.window_count
                )
              "
            >
              <div class="hover_action">
                <a-space>
                  <icon-edit @click.stop="change_sname(item.session_id)" />
                  <a-popconfirm
                    content="此操作将永久删除当前会话,确定要删除吗?"
                    @ok="delete_msg(item.session_id)"
                    type="warning"
                  >
                    <icon-delete />
                  </a-popconfirm>
                </a-space>
              </div>
              <div class="card bg-boli mb-2">
                <div class="card-body">
                  <div class="media">
                    <div class="avatar me-3">
                      <a-avatar>
                        <img :src="counter.setting.ai_chat_normal" alt="" />
                      </a-avatar>
                      <!-- Keep the a-tag for multi-window chats -->
                      <a-tag
                        v-if="item.is_multi_window"
                        class="multi-window-tag"
                        :color="item.window_count === 2 ? 'blue' : 'purple'"
                        size="small"
                      >
                        {{ item.window_count === 2 ? "Dual" : "Quad" }} ({{
                          item.models.length
                        }})
                      </a-tag>
                    </div>
                    <div class="media-body overflow-hidden">
                      <!-- Use the same title logic for both simple and multi-window chats -->
                      <h6 class="text-truncate mb-0 me-auto">
                        {{ item.message_b || item.question || "新会话" }}
                      </h6>
                      <!-- Optionally show the models as a subtitle for multi-window chats -->
                      <!-- <div
                        v-if="item.is_multi_window"
                        class="text-muted text-sm"
                      >
                        {{ formatMultiWindowTitle(item) }}
                      </div> -->
                      <!-- Ensure message display is consistent -->
                      <div
                        class="text-truncate h-20"
                        v-html="
                          item.message
                            ? item.message.replace(/\n/g, '<br />')
                            : '暂无消息'
                        "
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <a-pagination
            size="small"
            :total="ms_count"
            :current="page"
            :page-size="limit"
            class="justify-content-center mb-2"
            background
            simple
            @change="handleCurrentChange"
            :hide-on-single-page="true"
          />
        </div>
        <a-empty class="message_empty" v-else />
      </a-spin>

      <!-- Beizhu (Remark) Modal -->
      <a-modal v-model:visible="beizhu_info" title="修改备注" @ok="handle_send">
        <a-input v-model="beizhu" placeholder="修改备注名称" />
      </a-modal>

      <!-- User Info Section (Unchanged) -->
      <client-only>
        <div class="border-t dark:border-t-neutral-800">
          <div class="p-2 bg-n-6 rounded-xl">
            <a-trigger :trigger="['click', 'hover', 'focus']" v-if="token">
              <div class="flex items-center px-2.5 py-2.5 pb-4.5">
                <div class="relative w-10 h-10">
                  <a-avatar
                    :imageUrl="user_info.avatar"
                    class="rounded-full w-10 h-10"
                  />
                  <div
                    class="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 rounded-full border-4 border-n-6 bg-green-300 top-1 border-green-300"
                  ></div>
                </div>
                <div class="ml-1 mr-2">
                  <div class="base2 font-semibold text-n-1 text-truncate">
                    {{ user_info.name ? user_info.name : "未登录" }}
                  </div>
                  <div class="caption1 font-semibold text-n-3/50 text-truncate">
                    {{ counter.setting.money_name_set }}:{{ user_info.money }}
                  </div>
                </div>
                <div
                  class="shrnik-0 ml-auto self-start px-2 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
                >
                  {{ vip_level }}
                </div>
              </div>
              <template #content>
                <div class="nav-wraper">
                  <div class="user-info-box">
                    <div class="user-dis">
                      <a-avatar>
                        <img
                          :src="user_info.avatar"
                          alt="avatar"
                          class="rounded-full w-10 h-10"
                        />
                      </a-avatar>
                      <span class="nickname flex-wrap ml-1">
                        <span>{{ user_info.name }}</span>
                        <div
                          class="shrnik-0 px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
                        >
                          {{ vip_level }}
                        </div>
                      </span>
                    </div>
                    <div class="use-info user-type">
                      <span class="number">问答 </span>
                      <div class="limit_information flex flex-col">
                        <div class="limit_bag">
                          <span>{{ user_qs }}次</span>
                          <a-tag class="ml-1" color="#165dff" size="small"
                            >次数包</a-tag
                          >
                        </div>
                        <div class="day_bag">
                          <span>{{ last_msg }}/{{ total_msg }}次 </span>
                          <a-tag class="ml-1" color="#165dff" size="small">{{
                            check_vip_type(vip_type)
                          }}</a-tag>
                        </div>
                      </div>
                    </div>
                    <div class="use-info user-type">
                      <span class="number">绘画 </span>
                      <div class="limit_information flex flex-col">
                        <div class="limit_bag">
                          <span>{{ user_draw }}次</span>
                          <a-tag class="ml-1" color="#165dff" size="small"
                            >次数包</a-tag
                          >
                        </div>
                        <div class="day_bag">
                          <span>{{ last_draw }}/{{ total_draw }}次 </span>
                          <a-tag class="ml-1" color="#165dff" size="small">{{
                            check_vip_type(vip_type)
                          }}</a-tag>
                        </div>
                      </div>
                    </div>
                    <div class="use-info">
                      <span class="number">{{
                        counter.setting.money_name_set
                      }}</span>
                      <span>{{ user_info.money }}</span>
                    </div>
                    <div class="quit" @click="quit_out()">
                      <div name="quit" class="i-svg quit-icon-blue">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="Group 1000007605">
                            <rect
                              id="Rectangle 10"
                              x="15.0001"
                              y="9.41418"
                              width="2"
                              height="6"
                              rx="1"
                              transform="rotate(-45 15.0001 9.41418)"
                              fill="#057cff"
                            ></rect>
                            <rect
                              id="Rectangle 11"
                              x="19.2427"
                              y="10.8284"
                              width="2"
                              height="6"
                              rx="1"
                              transform="rotate(45 19.2427 10.8284)"
                              fill="#057cff"
                            ></rect>
                            <rect
                              id="Rectangle 12"
                              x="19"
                              y="11"
                              width="2"
                              height="11"
                              rx="1"
                              transform="rotate(90 19 11)"
                              fill="#057cff"
                            ></rect>
                            <path
                              id="Rectangle 11218"
                              d="M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17"
                              stroke="#057cff"
                              stroke-width="2"
                              stroke-linecap="round"
                            ></path>
                          </g>
                        </svg>
                      </div>
                      退出登录
                    </div>
                  </div>
                </div>
              </template>
            </a-trigger>
            <div class="flex items-center px-2.5 py-2.5 pb-4.5" v-else>
              <div class="relative w-10 h-10">
                <a-avatar :style="{ backgroundColor: '#3370ff' }">
                  <IconUser />
                </a-avatar>
                <div
                  class="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 rounded-full border-4 border-n-6 bg-green-300 top-1 border-green-300"
                ></div>
              </div>
              <div class="ml-1 mr-2">
                <div class="base2 font-semibold text-n-1 text-truncate">
                  请先登录
                </div>
              </div>
              <div
                class="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
              >
                {{ vip_level }}
              </div>
            </div>
            <a-button
              @click="login_dialog_click()"
              class="w-full"
              v-if="!token"
            >
              用户登录
            </a-button>
            <a-button class="w-full" v-else @click="charge()">
              <div v-if="counter.setting.show_limit_front == '1'">
                VIP剩余
                <a-tag color="arcoblue" class="ml-1 mr-1">{{ last_msg }}</a-tag
                >次问答
              </div>
              <div v-else>升级会员</div>
            </a-button>
          </div>
        </div>
      </client-only>
    </div>
    <div class="main">
      <a-spin :loading="loadins" tip="记录加载loading..">
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
        <!-- chat body start -->
        <div
          class="chat-body relative"
          :style="
            chat_bg_cookie
              ? {
                  background: 'url(' + chat_bg_cookie + ') no-repeat',
                  'background-size': 'cover',
                }
              : ''
          "
        >
          <div class="circle-info z-0">
            <ul class="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

          <div class="chat-header z-10 border-bottom md:py-3 sm:py-3 py-2">
            <div class="container-xxl">
              <div class="row align-items-center">
                <div class="col-6 col-xl-4 d-flex">
                  <button
                    @click="change_side()"
                    class="mr-2 sidebar-toggle-btn"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2.5 5L5 5L5 2.5L2.5 2.5L2.5 5ZM5 11.25L2.5 11.25L2.5 8.75L5 8.75L5 11.25ZM17.5 11.25L15 11.25L15 8.75L17.5 8.75L17.5 11.25ZM8.75 11.25L11.25 11.25L11.25 8.75L8.75 8.75L8.75 11.25ZM5 17.5L2.5 17.5L2.5 15L5 15L5 17.5ZM15 17.5L17.5 17.5L17.5 15L15 15L15 17.5ZM11.25 17.5L8.75 17.5L8.75 15L11.25 15L11.25 17.5ZM17.5 5L15 5L15 2.5L17.5 2.5L17.5 5ZM8.75 5L11.25 5L11.25 2.5L8.75 2.5L8.75 5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                  <div class="media align-items-center">
                    <div class="show-user-detail" v-if="ms_active == 0">
                      <a-avatar class="mr-2">
                        <img
                          :src="counter.setting.ai_chat_normal"
                          alt="avatar"
                          class="rounded-full w-100"
                        />
                      </a-avatar>
                    </div>
                    <div class="show-user-detail relative" v-else>
                      <a-avatar class="mr-2">
                        <img
                          v-if="
                            me_message &&
                            me_message[0] &&
                            me_message[0].icon != null
                          "
                          :src="me_message[0].icon"
                          alt="avatar"
                          class="rounded-full w-100"
                        />
                        <img
                          v-else
                          :src="counter.setting.ai_chat_normal"
                          alt="avatar"
                          class="rounded-full w-100"
                        />
                        <a-tag
                          color="arcoblue"
                          style="border-radius: 50%"
                          class="absolute left-5 bottom-6"
                          v-if="me_message.length > 0"
                        >
                          {{ me_message.length * 2 }}
                        </a-tag>
                      </a-avatar>
                    </div>
                    <div class="media-body overflow-hidden">
                      <div class="d-flex align-items-center mb-1">
                        <!--header question-->
                        <h6
                          class="text-truncate mb-0 me-auto"
                          v-if="ms_active == 0"
                        >
                          {{ counter.setting.bot_name }}
                        </h6>
                        <h6
                          class="mobile_width_5rem text-truncate mb-0 me-auto w-40"
                          v-if="me_message.length > 0"
                        >
                          {{
                            me_message[0].question
                              ? me_message[0].question
                              : "新会话"
                          }}
                        </h6>
                      </div>
                      <div class="text-truncate">
                        <a-space>
                          <a-tag
                            color="arcoblue"
                            class="cursor-pointer"
                            @click="dialog_scene = true"
                          >
                            <template #icon>
                              <icon-code />
                            </template>
                            预设配置
                          </a-tag>

                          <a-dropdown
                            @select="handleSelect"
                            :popup-max-height="false"
                          >
                            <a-tag color="green" class="cursor-pointer">{{
                              now_model_title
                            }}</a-tag>
                            <template #content>
                              <div>
                                <a-tooltip
                                  v-for="(n_mod, n_mod_index) in model_list"
                                  :key="n_mod_index"
                                  position="right"
                                  :content="n_mod?.tips ? n_mod.tips : '暂无'"
                                >
                                  <a-doption :value="n_mod.id">{{
                                    n_mod.title
                                  }}</a-doption>
                                </a-tooltip>
                              </div>
                            </template>
                          </a-dropdown>
                        </a-space>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-xl-8 text-end">
                  <ul
                    class="nav justify-content-end align-items-center mobile_show mobile_show_flex"
                  >
                    <li class="nav-item list-inline-item d-md-block">
                      <client-only>
                        <a-dropdown>
                          <svg
                            t="1695103719913"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="49910"
                            width="26"
                            height="26"
                          >
                            <path
                              d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
                              fill="#EBF4FF"
                              p-id="49911"
                            ></path>
                            <path
                              d="M705.365333 413.312a22.528 22.528 0 0 0-20.010666-17.493333H338.816a22.528 22.528 0 0 0-20.010667 17.493333 34.773333 34.773333 0 0 0 4.736 30.890667l173.141334 227.114666a19.626667 19.626667 0 0 0 15.317333 8.533334 19.370667 19.370667 0 0 0 15.317333-8.533334l173.226667-227.114666a35.072 35.072 0 0 0 4.821333-30.890667z m0 0"
                              fill="#417FF9"
                              p-id="49912"
                            ></path>
                          </svg>

                          <template #content>
                            <a-doption>
                              <a
                                @click="change_theme('dark')"
                                data-toggle="pill"
                                v-if="colorMode.preference == 'light'"
                                class="text-gray-400"
                                href="javascript:;"
                              >
                                <svg
                                  t="1685290472155"
                                  fill="#9ca3af"
                                  class="icon arco-icon"
                                  viewBox="0 0 1024 1024"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  p-id="1521"
                                  width="26"
                                  height="26"
                                >
                                  <path
                                    d="M512.8 806.6c-162.2 0-293.8-131.8-293.8-293.8s131.8-293.8 293.8-293.8 293.8 131.8 293.8 293.8-131.6 293.8-293.8 293.8z m0-526.8c-128.4 0-233 104.6-233 233s104.6 233 233 233 233-104.6 233-233-104.6-233-233-233zM512.8 957c-22.2 0-40.6-16.6-40.6-39v-3.2c0-22.2 18.2-40.6 40.6-40.6s40.6 18.2 40.6 40.6-18.2 42.2-40.6 42.2z m289.4-114.2c-10.6 0-20.6-4-28.8-11.8l-5.2-5.2c-15.8-15.8-15.8-41.4 0-57.2 15.8-15.8 41.4-15.8 57.2 0l5.2 5.2c15.8 15.8 15.8 41.4 0 57.2-7.8 7.6-17.8 11.8-28.4 11.8z m-578.8 0c-10.6 0-20.6-4-28.8-11.8-15.8-15.8-15.8-41.4 0-57.2l5.2-5.2c15.8-15.8 41.4-15.8 57.2 0s15.8 41.4 0 57.2l-5.2 5.2c-7.6 7.6-18.2 11.8-28.4 11.8zM918 553.4h-3.2c-22.2 0-40.6-18.2-40.6-40.6s18.2-40.6 40.6-40.6 42.2 18.2 42.2 40.6-16.6 40.6-39 40.6z m-807.2 0h-3.2c-22.2 0-40.6-18.2-40.6-40.6s18.2-40.6 40.6-40.6 42.2 18.2 42.2 40.6-16.8 40.6-39 40.6z m686.2-284.2c-10.6 0-20.6-4-28.8-11.8-15.8-15.8-15.8-41.4 0-57.2l5.2-5.2c15.8-15.8 41.4-15.8 57.2 0s15.8 41.4 0 57.2l-5.2 5.2c-7.8 7.8-18 11.8-28.4 11.8z m-568.2 0c-10.6 0-20.6-4-28.8-11.8l-5.2-5.6c-15.8-15.8-15.8-41.4 0-57.2s41.4-15.8 57.2 0l5.2 5.2c15.8 15.8 15.8 41.4 0 57.2-7.8 8.2-18.4 12.2-28.4 12.2z m284-119.6c-22.2 0-40.6-16.6-40.6-39v-3.2c0-22.2 18.2-40.6 40.6-40.6s40.6 18.2 40.6 40.6-18.2 42.2-40.6 42.2z"
                                    p-id="1522"
                                  ></path>
                                </svg>

                                白天模式
                              </a>
                              <a
                                @click="change_theme('light')"
                                data-toggle="pill"
                                v-if="colorMode.preference == 'dark'"
                                class="text-gray-400"
                                href="javascript:;"
                              >
                                <svg
                                  t="1685290466829"
                                  fill="#9ca3af"
                                  class="icon arco-icon"
                                  viewBox="0 0 1024 1024"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  p-id="9095"
                                  width="26"
                                  height="26"
                                >
                                  <path
                                    d="M544.2 957c-7 0-14 0-21.2-0.4C291.2 946.2 97.6 759.6 81.4 532c-14-195.4 99-378 281-454.4 51.8-21.6 79-5 90.6 7 11.6 11.6 27.8 38.4 6.2 87.8-19 43.8-28.6 90.6-28.2 138.6 0.8 183.4 153.2 339 339 346.4 27 1.2 53.4-0.8 79-5.4 54.6-10 77.4 12 86 26 8.6 14 18.6 44.2-14.4 89-87.6 120-227 190-376.4 190zM143 527.4c14 197 182.2 358.4 382.4 367.2 136.2 6.6 265.4-55.4 344.8-164 6.2-8.6 9.2-15 10.4-18.2-3.8-0.4-10.4-0.8-20.6 1.2-30.2 5.4-61.6 7.4-92.8 6.2-218.6-8.6-397.4-192-398.6-408.2 0-57.2 11.2-112.2 34-164 4.2-9.2 5-15.4 5.4-18.6-3.8 0-10.4 0.8-21.2 5.4-157.6 66.4-255.4 224.4-243.8 393z"
                                    p-id="9096"
                                  ></path>
                                </svg>

                                黑夜模式
                              </a>
                            </a-doption>
                            <a-doption>
                              <a
                                @click="notice = true"
                                data-toggle="pill"
                                class="text-gray-400"
                                href="javascript:;"
                              >
                                <icon-notification
                                  class="fs-6 align-text-bottom"
                                />
                                公告信息
                              </a>
                            </a-doption>

                            <a-doption v-if="ms_active != 0">
                              <a
                                @click="img_download = true"
                                data-toggle="pill"
                                class="text-gray-400"
                                href="javascript:;"
                              >
                                <icon-download class="fs-6 align-text-bottom" />
                                导出记录
                              </a>
                            </a-doption>
                            <a-doption>
                              <a
                                @click="check_message(ms_active)"
                                class="text-gray-400"
                                data-toggle="pill"
                                href="javascript:;"
                              >
                                <icon-refresh class="fs-6 align-text-bottom" />
                                刷新对话
                              </a>
                            </a-doption>

                            <a-doption>
                              <a
                                v-if="token"
                                @click="charge()"
                                class="text-gray-400"
                                data-toggle="pill"
                                href="javascript:;"
                              >
                                <icon-command class="fs-6 align-text-bottom" />
                                充值{{ counter.setting.money_name_set }}</a
                              >
                              <a
                                v-else
                                @click="login_dialog_click()"
                                class="text-gray-400"
                                data-toggle="pill"
                                href="javascript:;"
                              >
                                <icon-command
                                  class="fs-6 align-text-bottom"
                                />充值{{ counter.setting.money_name_set }}</a
                              >
                            </a-doption>
                          </template>
                        </a-dropdown>
                      </client-only>
                    </li>
                  </ul>
                  <ul
                    class="nav justify-content-end align-items-center mobile_none"
                  >
                    <li class="nav-item list-inline-item d-md-block me-2">
                      <a-tooltip
                        class="box-item"
                        effect="dark"
                        content="公告信息"
                        placement="bottom"
                      >
                        <button
                          @click="notice = true"
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-notification class="fs-6" />
                        </button>
                      </a-tooltip>
                    </li>
                    <li
                      class="nav-item list-inline-item d-md-block me-2"
                      v-if="ms_active != 0"
                    >
                      <a-tooltip
                        class="box-item"
                        effect="dark"
                        content="保存当前聊天"
                        placement="bottom"
                      >
                        <button
                          @click="img_download = true"
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-download class="fs-6 align-text-bottom" />
                        </button>
                      </a-tooltip>
                    </li>
                    <li class="nav-item list-inline-item d-md-block me-2">
                      <a-tooltip
                        class="box-item"
                        effect="dark"
                        content="刷新当前聊天"
                        placement="bottom"
                      >
                        <button
                          @click="check_message(ms_active)"
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-refresh class="fs-6 align-text-bottom" />
                        </button>
                      </a-tooltip>
                    </li>
                    <li class="nav-item list-inline-item d-md-block me-2">
                      <a-tooltip
                        class="box-item"
                        effect="dark"
                        content="充值"
                        placement="bottom"
                      >
                        <button
                          v-if="token"
                          @click="charge()"
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-command class="fs-6 align-text-bottom" />
                        </button>
                        <button
                          v-else
                          @click="login_dialog_click()"
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-command class="fs-6 align-text-bottom" />
                        </button>
                      </a-tooltip>
                    </li>
                    <li class="nav-item list-inline-item d-md-block me-2">
                      <a-trigger
                        trigger="click"
                        show-arrow
                        v-if="counter.setting.chat_bg_open == '1'"
                      >
                        <button
                          class="chat-header-tool-btn"
                          data-toggle="pill"
                          href="javascript:;"
                        >
                          <icon-image class="fs-6 align-text-bottom" />
                        </button>
                        <template #content>
                          <div
                            class="image-chat text-center bg-white w-100 box-shadow"
                          >
                            <div>
                              <a-image
                                @click="bg_change(img.background_image)"
                                :preview-visible="false"
                                class="m-2 cursor-pointer box-shadow-sm border"
                                :src="img.background_image"
                                width="200"
                                height="100"
                                v-for="(img, index) in chat_bg"
                                :key="index"
                              ></a-image>
                            </div>
                            <a-button @click="remove_bg()" class="mb-2"
                              >清除背景图</a-button
                            >
                          </div>
                        </template>
                      </a-trigger>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- chat content -->
          <div class="chat-content">
            <div v-if="!showMultiWindow">
              <div class="pb-28 sm:py-6 relative" ref="poster">
                <div class="container-xxl" v-if="me_message.length > 0">
                  <ul class="list-unstyled pt-5">
                    <div
                      class="message_s"
                      v-for="(item, index) in me_message"
                      :key="index"
                    >
                      <!-- User Message with Images -->
                      <li
                        class="d-flex message right"
                        v-if="item.question || item.images"
                      >
                        <div class="message-body">
                          <span class="date-time text-muted">{{
                            item.created_at
                          }}</span>
                          <div
                            class="message-row d-flex align-items-center justify-content-end"
                          >
                            <div
                              class="message-content me_content border p-3"
                              v-if="item.question"
                            >
                              <div
                                v-html="
                                  renderMarkdown(item.question).replace(
                                    /\\n/g,
                                    '\n'
                                  )
                                "
                              ></div>
                            </div>
                          </div>
                          <div
                            v-if="item.images && item.images.length > 0"
                            class="mt-2 flex justify-end"
                          >
                            <img
                              v-for="(img, imgIndex) in item.images"
                              :key="imgIndex"
                              :src="img"
                              class="w-16 h-16 object-contain rounded"
                              alt="User uploaded image"
                            />
                          </div>
                          <a-tag
                            class="mr-1 mb-2 token-sel"
                            size="small"
                            color="arcoblue"
                          >
                            <Icon
                              name="material-symbols:generating-tokens-outline-rounded"
                              size="16"
                              class="mr-1"
                            />
                            消耗 {{ item.qs_token || 0 }} Token
                          </a-tag>
                          <div class="message_content_footer">
                            <a-space class="ml-2">
                              <button
                                class="chat-tool-btn"
                                @click="edit_question(item.question)"
                              >
                                <div class="sign"><icon-edit /></div>
                                <div class="text">编辑</div>
                              </button>
                              <button
                                class="chat-tool-btn"
                                @click="handleClick(item.question)"
                              >
                                <div class="sign"><icon-copy /></div>
                                <div class="text">复制问题</div>
                              </button>
                              <a-popconfirm
                                content="此操作将永久删除当条消息,确定要删除吗?"
                                @ok="delete_this(item.id)"
                                type="warning"
                              >
                                <button class="chat-tool-btn">
                                  <div class="sign"><icon-delete /></div>
                                  <div class="text">删除</div>
                                </button>
                              </a-popconfirm>
                            </a-space>
                          </div>
                        </div>
                      </li>

                      <!-- AI Response with Thinking and Typewriter Effects -->
                      <li
                        class="d-flex message"
                        v-if="item.message || item.isThinking"
                      >
                        <div class="mr-lg-3 me-2">
                          <a-avatar class="mr-2">
                            <img
                              v-if="me_message[0]?.icon"
                              :src="me_message[0].icon"
                              alt="avatar"
                              class="rounded-full w-100"
                            />
                            <img
                              v-else
                              :src="counter.setting.ai_chat_normal"
                              alt="avatar"
                              class="rounded-full w-100"
                            />
                          </a-avatar>
                        </div>
                        <div class="message-body">
                          <span class="date-time text-muted">{{
                            item.created_at
                          }}</span>
                          <div
                            class="message-row d-flex flex-column align-items-start"
                          >
                            <!-- Thinking Indicator
                            <div
                              v-if="item.isThinking"
                              class="message-content ai-message-content p-3"
                            >
                              <span class="thinking-indicator"></span>
                            </div> -->
                            <!-- Thinking Indicator -->
                            <div
                              v-if="item.isThinking"
                              class="message-content ai-message-content p-3"
                            >
                              <span class="thinking-indicator"></span>
                            </div>

                            <!-- Typewriter Effect (Dynamic Rendering of Text and Code) -->
                            <div
                              v-else-if="!item.isComplete"
                              class="message-content ai-message-content p-3"
                            >
                              <template
                                v-for="(text, segIndex) in item.textSegments"
                                :key="segIndex"
                              >
                                <div
                                  v-if="text?.trim()"
                                  class="typewriter-text"
                                  v-html="
                                    renderMarkdown(text).replace(/\\n/g, '\n')
                                  "
                                ></div>
                                <div
                                  v-if="item.codeSegments[segIndex]"
                                  class="code-block-wrapper"
                                >
                                  <pre
                                    class="ai-code-container typewriter-text p-3"
                                    >{{ item.codeSegments[segIndex] }}</pre
                                  >
                                  <button
                                    class="copy-code-btn"
                                    @click="
                                      copyCode(item.codeSegments[segIndex])
                                    "
                                  >
                                    <span>Copy Code</span>
                                  </button>
                                </div>
                              </template>
                            </div>

                            <!-- Final Rendered Content (Using Segments) -->
                            <div
                              v-else-if="item.isComplete && !item.isEditing"
                              @click="handleClickEvent"
                              class="message-content ai-message-content p-3"
                              :class="
                                index === me_message.length - 1 && !is_done
                                  ? 'ms-up'
                                  : ''
                              "
                            >
                              <template
                                v-for="(text, segIndex) in item.textSegments"
                                :key="segIndex"
                              >
                                <div
                                  v-if="text"
                                  v-html="
                                    renderMarkdown(text).replace(/\\n/g, '\n')
                                  "
                                ></div>
                                <div
                                  v-if="item.codeSegments[segIndex]"
                                  class="code-block-wrapper"
                                >
                                  <pre
                                    class="ai-code-container p-3"
                                  ><code>{{ item.codeSegments[segIndex] }}</code></pre>
                                  <button
                                    class="copy-code-btn"
                                    @click="
                                      copyCode(item.codeSegments[segIndex])
                                    "
                                  >
                                    <span>Copy Code</span>
                                  </button>
                                </div>
                              </template>
                            </div>

                            <!-- Edit Mode -->
                            <div
                              v-else-if="item.isEditing"
                              class="message-content ai-message-content p-3"
                            >
                              <a-textarea
                                v-model="item.editedMessage"
                                :auto-size="{ minRows: 3, maxRows: 10 }"
                                @blur="saveEdit(item)"
                                placeholder="Edit the AI's response here"
                              />
                            </div>

                            <!-- Token Usage and Footer -->
                            <a-tag
                              class="ml-1 mb-2 token-sel"
                              size="small"
                              color="arcoblue"
                            >
                              <Icon
                                name="material-symbols:generating-tokens-outline-rounded"
                                size="16"
                                class="mr-1"
                              />
                              消耗
                              {{ item.answer_token || 0 }}
                              Token（包含上下文预设信息）
                            </a-tag>
                            <div class="message_content_footer">
                              <a-space class="ml-2">
                                <!-- Edit Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="enableEdit(item)"
                                  v-if="!item.isEditing"
                                >
                                  <div class="sign"><icon-edit /></div>
                                  <div class="text">Edit</div>
                                </button>
                                <!-- Save Button (appears only in edit mode) -->
                                <button
                                  class="chat-tool-btn"
                                  @click="saveEdit(item)"
                                  v-if="item.isEditing"
                                >
                                  <div class="sign"><icon-save /></div>
                                  <div class="text">Save</div>
                                </button>
                                <!-- Speak Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="
                                    speak_is_audio
                                      ? stop_speak()
                                      : speak(
                                          item.message
                                            ? item.message.replace(/\\n/g, '\n')
                                            : ''
                                        )
                                  "
                                >
                                  <div class="sign"><icon-voice /></div>
                                  <div class="text">
                                    {{ speak_is_audio ? "停止" : "朗读" }}
                                  </div>
                                </button>
                                <!-- Refresh Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="refresh_answer(item.question)"
                                >
                                  <div class="sign"><icon-refresh /></div>
                                  <div class="text">重新生成</div>
                                </button>
                                <!-- Copy Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="
                                    handleClick(
                                      item.message ? item.message : ''
                                    )
                                  "
                                >
                                  <div class="sign"><icon-copy /></div>
                                  <div class="text">复制答案</div>
                                </button>
                                <!-- Export Word Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="
                                    exportWord(
                                      item.message
                                        ? renderMarkdown(item.message).replace(
                                            /\\n/g,
                                            '\n'
                                          )
                                        : ''
                                    )
                                  "
                                >
                                  <div class="sign">
                                    <icon-share-internal />
                                  </div>
                                  <div class="text">导出Word</div>
                                </button>
                                <!-- Export PDF Button -->
                                <button
                                  class="chat-tool-btn"
                                  @click="
                                    exportPdf(
                                      item.message
                                        ? renderMarkdown(item.message).replace(
                                            /\\n/g,
                                            '\n'
                                          )
                                        : ''
                                    )
                                  "
                                >
                                  <div class="sign"><icon-download /></div>
                                  <div class="text">导出PDF</div>
                                </button>
                                <!-- Delete Button -->
                                <a-popconfirm
                                  content="此操作将永久删除当条消息,确定要删除吗?"
                                  @ok="delete_this(item.id)"
                                  type="warning"
                                >
                                  <button class="chat-tool-btn">
                                    <div class="sign"><icon-delete /></div>
                                    <div class="text">删除</div>
                                  </button>
                                </a-popconfirm>
                                <button
                                  class="chat-tool-btn"
                                  @click="handleThumbsUp(item.id)"
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
                                  @click="handleThumbsDown(item.id)"
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
                              </a-space>
                            </div>
                          </div>
                        </div>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>

            <!-- MultiWindowChat Component -->
            <MultiWindowChat
              v-if="showMultiWindow"
              :selectedModels="selectedModels"
              :user-id="userId"
              :text-image-urls="text_imageUrls"
              :initial-session-id="ms_active"
              ref="multiWindowRef"
              @toggle-speak="toggleSpeak"
              @refresh-answer="refreshAnswer"
              @export-word="exportWord"
              @export-pdf="exportPdf"
              @delete-message="deleteMessage"
              @feedback="handleFeedback"
              @close="add_new_chat"
              @history-updated="handleHistoryUpdated"
              @message-sent="handleMessageSent"
            />

            <!-- Model Selection Modal -->
            <ModelSelectionModal
              v-if="showModelSelectionModal"
              :enabledModels="enabledModels"
              :selectionType="selectionType"
              @confirm="handleModelSelection"
              @cancel="showModelSelectionModal = false"
            />

            <!-- Login Prompt Modal -->
            <LoginPromptModal
              :is-visible="showLoginModal"
              @update:is-visible="showLoginModal = $event"
            />
          </div>
          <div
            class="res_stop text-center mb-2"
            :class="is_done ? 'd-none' : ''"
          >
            <a-button @click="stop_stream()">
              <icon-record-stop class="font-22 mr-2" />
              停止运行
            </a-button>
          </div>

          <!-- input area -->
          <div class="chat-footer border-top py-xl-2 py-lg-2 py-2">
            <div class="container-xxl">
              <div class="row">
                <div class="col-12">
                  <!-- <a-upload
                    v-if="
                      plugins_select === 'image_read' ||
                      is_can_upload(model_is_select)
                    "
                    class="avatar-uploader z-10 relative"
                    :action="actions"
                    :show-file-list="false"
                    :headers="{ Authorization: 'Bearer ' + token }"
                    @before-upload="beforeUpload"
                    @success="TextSuccess"
                    multiple
                    draggable
                  >
                    <template #upload-button>
                      <div>
                        <div
                          class="rounded-10 w-100 mr-1 custom-upload-avatar"
                          v-if="text_imageUrl"
                        >
                          <div class="upload-file">
                            <a-trigger trigger="hover" show-arrow>
                              <div
                                class="upload-file__upload border border-dashed upload-file__upload--white overflow-hidden gda-dropdown-trigger"
                                style="width: 50px; height: 50px"
                              >
                                <img
                                  class="w-auto rounded"
                                  :src="text_imageUrl"
                                />
                              </div>
                              <template #content>
                                <div class="bg-white p-2 shadow-md rounded-xl">
                                  <img
                                    class="w-60 rounded"
                                    :src="text_imageUrl"
                                  />
                                  <a-button
                                    type="primary"
                                    class="w-full mt-1"
                                    @click="text_imageUrl = ''"
                                    >删除图片</a-button
                                  >
                                </div>
                              </template>
                            </a-trigger>
                          </div>

                          <div
                            class="absolute top-2 plugin-upload left-2 rounded-10"
                          >
                            <IconPlus />
                          </div>
                        </div>
                        <div class="upload-file" v-else>
                          <div
                            class="upload-file__upload border mb-2 border-dashed upload-file__upload--white gda-dropdown-trigger"
                            style="width: 30px; height: 30px"
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
                    </template>
                  </a-upload> -->

                  <a-upload
                    v-if="
                      plugins_select === 'image_read' ||
                      is_can_upload(model_is_select)
                    "
                    class="avatar-uploader z-10 relative"
                    :action="actions"
                    :show-file-list="false"
                    :headers="{ Authorization: 'Bearer ' + token }"
                    @before-upload="beforeUpload"
                    @success="TextSuccess"
                    multiple
                    draggable
                  >
                    <template #upload-button>
                      <div class="upload-file">
                        <!-- Show upload icon when no images are uploaded -->
                        <div
                          v-if="!text_imageUrls.length"
                          class="upload-file__upload border mb-2 border-dashed upload-file__upload--white gda-dropdown-trigger"
                          style="width: 30px; height: 30px"
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
                        <!-- Show plus icon when images are uploaded -->
                        <div
                          v-else
                          class="absolute top-2 plugin-upload left-2 rounded-10"
                        >
                          <IconPlus />
                        </div>
                      </div>
                    </template>
                  </a-upload>

                  <!-- Display Uploaded Files with Hover Effect -->
                  <div
                    v-for="(url, index) in text_imageUrls"
                    :key="index"
                    class="uploaded-file inline-block mr-2 relative"
                  >
                    <div
                      v-if="isImage(url)"
                      class="thumbnail-container relative inline-block"
                    >
                      <a-trigger trigger="hover" show-arrow>
                        <img
                          :src="url"
                          class="thumbnail"
                          style="
                            width: 50px;
                            height: 50px;
                            object-fit: cover;
                            border-radius: 4px;
                          "
                        />
                        <template #content>
                          <div class="bg-white p-2 shadow-md rounded-xl">
                            <img :src="url" class="w-60 rounded" />
                            <a-button
                              type="primary"
                              class="w-full mt-1"
                              @click="deleteImage(index)"
                            >
                              删除图片
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <a-button
                        type="text"
                        shape="circle"
                        size="small"
                        class="delete-btn absolute top-0 right-0"
                        @click="deleteImage(index)"
                      >
                        <span class="text-xs font-bold">×</span>
                      </a-button>
                    </div>
                    <div v-else class="file-icon relative inline-block">
                      <a-trigger trigger="hover" show-arrow>
                        <icon-file />
                        <template #content>
                          <div class="bg-white p-2 shadow-md rounded-xl">
                            <p>非图片文件: {{ url.split("/").pop() }}</p>
                            <a-button
                              type="primary"
                              class="w-full mt-1"
                              @click="deleteImage(index)"
                            >
                              删除文件
                            </a-button>
                          </div>
                        </template>
                      </a-trigger>
                      <a-button
                        type="text"
                        shape="circle"
                        size="small"
                        class="delete-btn absolute top-0 right-0"
                        @click="deleteImage(index)"
                      >
                        <span class="text-xs font-bold">×</span>
                      </a-button>
                    </div>
                  </div>

                  <a-form :model="ruleForm" ref="formRef">
                    <a-form-item
                      :hide-label="true"
                      :hide-asterisk="true"
                      field="message_input"
                      validate-trigger="input"
                      class="mb-0 relative"
                    >
                      <!-- multi-window show buttons -->
                      <div class="flex items-center pl-8 space-x-2 mr-1">
                        <!-- quad-window Button (All 4 Modals) -->
                        <a-button
                          type="primary"
                          size="small"
                          @click="openMultiWindow(4)"
                          :disabled="chatModeLocked || hasMessageBeenSent"
                        >
                          <svg
                            role="img"
                            aria-label="quad-window"
                            focusable="false"
                            data-icon="quad-window"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-quad-window"
                            width="16"
                            height="16"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="9"
                              height="9"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                            <rect
                              x="13"
                              y="2"
                              width="9"
                              height="9"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                            <rect
                              x="2"
                              y="13"
                              width="9"
                              height="9"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                            <rect
                              x="13"
                              y="13"
                              width="9"
                              height="9"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                          </svg>
                        </a-button>

                        <!-- Multi-Window Button (2 Modals) -->
                        <a-button
                          type="primary"
                          size="small"
                          @click="openMultiWindow(2)"
                          :disabled="chatModeLocked || hasMessageBeenSent"
                        >
                          <svg
                            role="img"
                            aria-label="multi-window"
                            focusable="false"
                            data-icon="multi-window"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="gd_design_icon gd_design_icon-multi-window"
                            width="16"
                            height="16"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="12"
                              height="12"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                            <rect
                              x="10"
                              y="10"
                              width="12"
                              height="12"
                              rx="2"
                              stroke="currentColor"
                              stroke-width="1.5"
                              fill="none"
                            />
                          </svg>
                        </a-button>
                      </div>
                      <a-popover trigger="click" show-arrow>
                        <!-- v-if="
                          model_big_choose == 'gpt' &&
                          counter.setting.market_plugins_open == '1'
                        " -->
                        <a-button
                          type="text"
                          size="mini"
                          class="plugins-market z-10 left-1"
                          shape="circle"
                        >
                          <svg
                            t="1704607963876"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="12025"
                            width="28"
                            height="28"
                          >
                            <path
                              d="M571.392 87.074133l-0.631467 0.8704-356.9152 465.92c-10.222933 14.4384-12.544 32.512-3.669333 48.503467l2.013867 3.310933c8.618667 14.677333 23.808 22.766933 40.891733 22.766934l190.122667-0.017067-45.841067 270.08-0.631467 2.679467c-4.437333 21.128533 6.144 39.5776 24.832 48.401066l2.372267 1.024 0.529067 0.324267c5.12 2.696533 10.7008 4.215467 16.4352 4.642133l3.464533 0.136534c13.755733 0 26.368-5.410133 36.078933-15.121067a34.133333 34.133333 0 0 0 3.7376-4.437333L812.032 472.576a34.133333 34.133333 0 0 0 5.632-13.090133c2.048-10.376533 2.048-20.48-0.375467-30.173867a34.133333 34.133333 0 0 0-2.645333-7.133867l-1.6384-3.003733c-8.6528-14.557867-23.773867-22.596267-40.789333-22.596267l-162.833067-0.017066 46.165333-272.093867a34.133333 34.133333 0 0 0 0.477867-5.700267l-0.068267-3.072c-0.9216-18.312533-9.984-34.2016-26.760533-41.2672l-1.143467-0.426666-1.006933-0.597334c-19.694933-10.581333-41.984-4.539733-55.671467 13.6704z m2.833067 108.5952l-38.894934 229.3248-0.341333 2.491734a34.133333 34.133333 0 0 0 33.9968 37.358933l164.898133-0.017067-254.856533 360.379734 38.229333-225.1776 0.341334-2.491734a34.133333 34.133333 0 0 0-33.979734-37.376H294.980267l279.2448-364.4928z"
                              fill="#444444"
                              p-id="12026"
                            ></path>
                            <path
                              d="M828.672 559.616a34.133333 34.133333 0 0 1 30.122667 54.698667l-99.874134 135.0656-55.7568-39.389867 100.608-136.055467 0.256-0.3584a34.048 34.048 0 0 1 24.644267-13.943466z"
                              fill="#165dff"
                              p-id="12027"
                            ></path>
                          </svg>
                        </a-button>

                        <template #content>
                          <div
                            class="plugin-market !border-none bg-white rounded-lg"
                          >
                            <div class="flex items-center justify-between mb-4">
                              <h3 class="text-lg font-medium text-gray-900">
                                插件市场
                              </h3>
                              <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500"
                                  >深度思考</span
                                >
                                <a-switch
                                  v-model="deep_thinking"
                                  @change="toggleDeepThinking"
                                  >深度思考</a-switch
                                >
                              </div>
                            </div>
                            <a-card
                              v-for="(p, p_index) in plugins_list"
                              :key="p_index"
                              class="mb-3 hover:bg-gray-50 duration-300"
                              :bodyStyle="{ padding: '12px' }"
                            >
                              <div class="flex items-center justify-between">
                                <span class="flex items-center space-x-2">
                                  <div v-html="p.icon" class="w-6 h-6"></div>
                                  <a-typography-text class="font-medium">{{
                                    p.title
                                  }}</a-typography-text>
                                </span>
                                <a-button
                                  type="primary"
                                  :status="
                                    plugins_select == p.id
                                      ? 'success'
                                      : 'normal'
                                  "
                                  size="small"
                                  class="min-w-[60px] ml-8"
                                  @click="
                                    plugins_select == p.id
                                      ? (plugins_select = false)
                                      : getPlugins(p.id)
                                  "
                                >
                                  {{
                                    plugins_select == p.id ? "已启用" : "启用"
                                  }}
                                </a-button>
                              </div>
                            </a-card>
                          </div>
                        </template>
                      </a-popover>
                      <a-textarea
                        placeholder="shift+enter换行"
                        v-model="ruleForm.message_input"
                        :class="model_big_choose == 'gpt' ? 'voice-c' : ''"
                        :auto-size="{
                          minRows: 1,
                          maxRows: 5,
                        }"
                        @keydown.enter.native.prevent="check_sub()"
                        show-word-limit
                      />
                      <icon-voice
                        v-if="counter.setting.voice_is_open == 1"
                        :class="send_loading ? 'voice-icon-6' : 'voice-icon'"
                        class="absolute z-10 cursor-pointer"
                        @click="voice_dialog = true"
                        size="18"
                      />

                      <client-only>
                        <a-space>
                          <a-button
                            class="ml-1"
                            @click="check_sub()"
                            type="primary"
                            :loading="send_loading"
                          >
                            <icon-send class="text-lg" />
                          </a-button>
                        </a-space>
                      </client-only>
                    </a-form-item>
                    <Nfooter />
                  </a-form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- chat-body end -->
      </a-spin>
    </div>
    <a-modal
      v-model:visible="notice"
      @ok="save_notice()"
      :hide-cancel="true"
      ok-text="已查阅"
    >
      <template #title> 本站公告 </template>
      <a-skeleton :animation="true" v-if="normal_message.length == 0">
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <a-skeleton-line :rows="3" />
        </a-space>
      </a-skeleton>
      <div v-else>
        <a-timeline>
          <a-timeline-item
            v-for="(n_t, n_index) in normal_message"
            :label="n_t.created_at"
            lineType="dashed"
            :key="n_index"
          >
            <div v-html="n_t.title" class="mb-0"></div>
            <a-typography-text
              type="secondary"
              :style="{ fontSize: '12px', marginTop: '4px' }"
              v-html="n_t.info"
            >
            </a-typography-text>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
    <a-modal v-model:visible="voice_dialog" :footer="false" simple>
      <div class="voice-header items-center flex justify-between">
        <div class="voice-title">
          <h4 class="d-sm-inline-block">语音对话</h4>
          | <span class="text-gray-500">静待回答</span>
        </div>
        <div class="voice-right">
          <a-button type="text" size="small" @click="toggleVoiceMode">
            {{
              voiceMode === "text"
                ? "Switch to Voice Response"
                : "Switch to Speech-to-Text"
            }}
          </a-button>
          <a-dropdown @select="handleSelectRole">
            <!--找到voice_role中的value等于voice_role_choose的值-->
            <div class="flex voice-role cursor-pointer">
              <img
                :src="
                  voice_role.find((item) => item.value === voice_role_choose)
                    .image
                "
                alt=""
                class="w-6 mr-2"
              />
              <div>
                {{
                  voice_role.find((item) => item.value === voice_role_choose)
                    .label
                }}
                <icon-caret-down />
              </div>
            </div>
            <template #content>
              <a-doption
                :value="item.value"
                v-for="(item, index) in voice_role"
                :key="index"
              >
                <template #icon>
                  <img :src="item.image" alt="" class="w-6" />
                </template>
                <template #default>{{ item.label }}</template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="voice-system-say">
        <div class="circle">
          <div class="inner-circle">
            <video
              class="voice-video"
              autoplay=""
              muted=""
              playsinline=""
              loop=""
            >
              <source src="@/assets/images/voice.mp4" type="video/mp4" />
            </video>
          </div>
          <div class="ripple"></div>
          <div class="ripple"></div>
          <div class="ripple"></div>
        </div>
      </div>
      <h4 class="text-center font-18">{{ transcribedText }}</h4>
      <div class="voice-user-say flex justify-center p-4">
        <a-space>
          <button
            class="px-3 pt-2 pb-2 bg-boli"
            :disabled="voice_load"
            v-if="!voice_open"
            @click="startRecording"
          >
            <icon-voice />开始录音
          </button>
          <button
            class="px-3 pt-2 pb-2 bg-boli"
            :disabled="voice_load"
            v-else
            @click="stopRecording"
          >
            <icon-voice />停止录音
          </button>
          <button
            class="px-3 pt-2 pb-2 bg-boli flex items-center"
            @click="voice_change()"
          >
            <Icon name="solar:bill-list-outline" class="mr-1" />对话列表
          </button>
        </a-space>
        <a-drawer
          :width="340"
          :mask-closable="false"
          :mask="false"
          :visible="voice_list"
          @ok="handleCancelVoice"
          @cancel="handleCancelVoice"
        >
          <template #title> 语音对话列表 </template>
          <a-spin :loading="voice_set_loading">
            <div class="voice-list-check" v-if="voice_list_arr.length > 0">
              <a-alert>语音对话上下文选择</a-alert>
              <a-checkbox-group class="w-full" v-model="checkedValue">
                <template v-for="(item, index) in voice_list_arr" :key="index">
                  <a-checkbox :value="item.id" class="my-2 w-full">
                    <template #checkbox="{ checked }">
                      <a-space
                        align="start"
                        class="custom-checkbox-card w-full"
                        :class="{ 'custom-checkbox-card-checked': checked }"
                      >
                        <div className="custom-checkbox-card-mask">
                          <div className="custom-checkbox-card-mask-dot" />
                        </div>
                        <div>
                          <div className="custom-checkbox-card-title">
                            {{ item.question }}
                          </div>
                          <a-typography-text
                            type="secondary"
                            v-html="item.answer"
                          >
                          </a-typography-text>
                        </div>
                      </a-space>
                    </template>
                  </a-checkbox>
                </template>
              </a-checkbox-group>
              <a-pagination
                size="small"
                :total="voice_count"
                :current="voice_page"
                :page-size="voice_limit"
                class="justify-content-center mb-2"
                background
                @change="VoicehandleCurrentChange"
                :hide-on-single-page="true"
              />
            </div>
            <a-empty v-else>暂无对话</a-empty>
          </a-spin>
        </a-drawer>
      </div>
    </a-modal>
    <a-modal v-model:visible="dialog_scene" class="mb_dialog">
      <a-modal
        v-model:visible="scene_preset"
        title="场景预设"
        append-to-body
        class="mb_dialog"
      >
        <a-form :model="SceneForm">
          <a-form-item
            :hide-label="true"
            :hide-asterisk="true"
            v-for="(domain, index) in SceneForm.domains"
            :field="`domains[${index}].value`"
            :key="index"
          >
            <a-space>
              <a-select v-model="domain.sel">
                <a-option
                  v-for="item in domainOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </a-select>
              <a-textarea
                auto-size
                placeholder="预设内容"
                v-model="domain.value"
              />
              <a-button
                type="primary"
                @click="removeDomain(domain)"
                :style="{ marginLeft: '10px' }"
              >
                <icon-delete />
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
        <div>
          <a-button @click="addDomain">添加场景</a-button>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <a-button type="primary" @click="scene_preset = false">
              完成
            </a-button>
          </span>
        </template>
      </a-modal>
      <template #title> 预设配置 </template>
      <a-tabs class="w-full" type="capsule" size="large">
        <a-tab-pane key="key" title="基础配置">
          <div class="space-y-3 pt-4">
            <h6 class="mb-3">大模型选择</h6>
            <a-radio-group
              class="mb-3 flex-wrap"
              @change="big_model_change"
              v-model="model_big_choose"
              type="button"
            >
              <a-radio
                v-for="(models, m_index) in big_model_list"
                :key="m_index"
                :value="models.type"
              >
                <div class="flex items-center gap-1">
                  <a-image :src="models.icon" class="w-5" alt="" />
                  {{ models.title }}
                </div>
              </a-radio>
            </a-radio-group>

            <h6 class="mb-3">模型选择</h6>
            <a-radio-group
              class="mb-3 flex-wrap"
              @change="small_model_change"
              v-model="model_is_select"
              type="button"
            >
              <a-radio
                v-for="(mod, mod_index) in model_list"
                :key="mod_index"
                :value="mod.model"
              >
                <a-popover v-if="mod.model_vip_limit?.length > 0">
                  <template #content>
                    <div>
                      <p>模型VIP限制</p>
                      <div class="grid grid-cols-2 gap-2">
                        <a-tag
                          color="orange"
                          v-for="(mods, mods_index) in mod.model_vip_limit"
                          :key="mods_index"
                          >{{ mods.vip_s.title }}</a-tag
                        >
                      </div>
                    </div>
                  </template>
                  <div class="flex items-center gap-1">
                    {{ mod.title }}
                    <svg
                      t="1727938938116"
                      class="icon"
                      viewBox="0 0 1080 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="12439"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M949.191111 701.098667a476.046222 476.046222 0 0 0 57.173333-226.929778c0-261.12-208.611556-472.746667-465.92-472.746667s-465.92 211.626667-465.92 472.746667c0 82.261333 20.764444 159.573333 57.173334 226.986667h817.493333z"
                        fill="#3A75EF"
                        p-id="12440"
                      ></path>
                      <path
                        d="M814.08 705.706667a360.789333 360.789333 0 0 0 79.872-226.929778c0-198.144-158.833778-359.310222-354.076444-359.310222-195.242667 0-354.076444 161.166222-354.076445 359.310222 0 86.016 29.980444 164.977778 79.815111 226.929778h548.465778z"
                        fill="#FFFFFF"
                        fill-opacity=".4"
                        p-id="12441"
                      ></path>
                      <path
                        d="M591.815111 625.777778H481.052444L358.4 314.140444h113.265778l65.706666 202.126223h1.877334l65.706666-202.126223h109.511112z"
                        fill="#FFFFFF"
                        p-id="12442"
                      ></path>
                      <path
                        d="M130.446222 928.028444h819.996445v-226.929777H130.446222z"
                        fill="#FFE69F"
                        p-id="12443"
                      ></path>
                      <path
                        d="M130.446222 928.028444v-132.380444H0l74.524444 113.493333L0 1022.577778h167.708444v-94.549334zM1080.888889 795.648h-130.446222v132.380444h-37.262223v94.549334H1080.888889l-74.524445-113.436445zM391.395556 795.648H316.757333a18.773333 18.773333 0 0 1-18.659555-18.887111 18.773333 18.773333 0 0 1 18.659555-18.944h74.524445a18.773333 18.773333 0 0 1 18.659555 18.944 18.773333 18.773333 0 0 1-18.659555 18.887111M577.706667 795.648H465.92a18.773333 18.773333 0 0 1-18.659556-18.887111 18.773333 18.773333 0 0 1 18.659556-18.944h111.786667a18.773333 18.773333 0 0 1 18.659555 18.944 18.773333 18.773333 0 0 1-18.659555 18.887111M484.522667 871.310222H316.871111a18.773333 18.773333 0 0 1-18.659555-18.887111 18.773333 18.773333 0 0 1 18.659555-18.944h167.708445a18.773333 18.773333 0 0 1 18.659555 18.944 18.773333 18.773333 0 0 1-18.659555 18.887111M764.074667 871.310222h-37.262223a18.773333 18.773333 0 0 1-18.659555-18.887111 18.773333 18.773333 0 0 1 18.659555-18.944h37.262223a18.773333 18.773333 0 0 1 18.659555 18.944 18.773333 18.773333 0 0 1-18.659555 18.887111M652.288 871.310222H559.104a18.773333 18.773333 0 0 1-18.659556-18.887111 18.773333 18.773333 0 0 1 18.659556-18.944h93.184a18.773333 18.773333 0 0 1 18.602667 18.944 18.773333 18.773333 0 0 1-18.602667 18.887111M764.074667 795.648h-93.184a18.773333 18.773333 0 0 1-18.659556-18.887111 18.773333 18.773333 0 0 1 18.659556-18.944h93.184a18.773333 18.773333 0 0 1 18.659555 18.944 18.773333 18.773333 0 0 1-18.659555 18.887111"
                        fill="#F0C419"
                        p-id="12444"
                      ></path>
                    </svg>
                  </div>
                </a-popover>
                <span v-else>
                  {{ mod.title }}
                  <a-badge
                    v-if="mod.model_vip_limit?.length > 0"
                    :content="mod.model_vip_limit"
                    class="ml-1"
                  />
                </span>
              </a-radio>
            </a-radio-group>
            <a-empty v-if="model_list.length == 0">暂无模型</a-empty>

            <h6 class="mb-3">知识库选择</h6>
            <div class="knowledge_choose">
              <div
                class="knowledge_list"
                v-if="now_choose_knowledge.length > 0"
              >
                <a-row :gutter="20">
                  <a-col
                    :span="12"
                    v-for="(n_t, n_index) in now_choose_knowledge"
                    :key="n_index"
                  >
                    <a-card
                      hoverable
                      class="w-100"
                      :style="{ marginBottom: '20px' }"
                    >
                      <div
                        :style="{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }"
                      >
                        <span
                          :style="{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#1D2129',
                          }"
                        >
                          <svg
                            t="1692008373063"
                            class="icon mr-2"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="4045"
                            width="24"
                            height="24"
                          >
                            <path
                              d="M372.363636 744.727273h-76.101818a54.225455 54.225455 0 0 1-50.036363-30.487273 40.727273 40.727273 0 0 1-4.887273-23.272727 151.738182 151.738182 0 0 0-23.272727-82.152728 152.436364 152.436364 0 0 0-20.945455-24.901818 351.883636 351.883636 0 0 1-41.890909-56.087272 302.545455 302.545455 0 0 1-27.927273-54.69091A180.363636 180.363636 0 0 1 116.363636 418.909091a246.923636 246.923636 0 0 1 6.050909-61.44 222.021818 222.021818 0 0 1 38.167273-84.712727A268.8 268.8 0 0 1 261.585455 186.181818a240.174545 240.174545 0 0 1 54.690909-18.385454 286.952727 286.952727 0 0 1 69.818181-5.585455 256 256 0 0 1 93.09091 21.178182 251.810909 251.810909 0 0 1 52.363636 32.349091 281.6 281.6 0 0 1 60.974545 67.723636 229.934545 229.934545 0 0 1 31.185455 76.334546 222.254545 222.254545 0 0 1 4.654545 66.792727 184.32 184.32 0 0 1-13.963636 55.621818 312.32 312.32 0 0 1-44.683636 77.265455 328.145455 328.145455 0 0 1-25.134546 28.858181 114.269091 114.269091 0 0 0-23.272727 34.676364 165.701818 165.701818 0 0 0-14.196364 40.261818c-1.163636 8.610909-1.163636 16.989091-2.094545 25.367273a124.741818 124.741818 0 0 1-2.56 18.385455 51.665455 51.665455 0 0 1-24.901818 29.323636 58.88 58.88 0 0 1-29.323637 7.214545z m-26.996363-512c-7.68 0-15.592727 1.396364-23.272728 2.792727a151.738182 151.738182 0 0 0-52.596363 18.850909 171.752727 171.752727 0 0 0-39.330909 31.418182 165.003636 165.003636 0 0 0-30.72 45.149091A169.658182 169.658182 0 0 0 186.181818 397.963636a19.549091 19.549091 0 1 0 39.098182 2.094546v-9.774546a116.363636 116.363636 0 0 1 7.447273-34.676363 131.956364 131.956364 0 0 1 46.545454-59.578182 118.458182 118.458182 0 0 1 66.792728-24.436364 85.178182 85.178182 0 0 0 13.265454-1.163636 16.523636 16.523636 0 0 0 13.498182-10.938182 25.6 25.6 0 0 0 0-13.265454 16.523636 16.523636 0 0 0-14.894546-13.498182z m-73.541818 581.818182h201.076363a15.127273 15.127273 0 0 1 15.825455 13.730909v42.356363a15.127273 15.127273 0 0 1-15.825455 13.730909h-201.076363a15.127273 15.127273 0 0 1-15.825455-13.730909v-42.356363a15.127273 15.127273 0 0 1 15.825455-13.730909z"
                              fill="#3F58FD"
                              opacity=".3"
                              p-id="4046"
                            ></path>
                            <path
                              d="M605.090909 804.538182h-90.298182A63.767273 63.767273 0 0 1 455.447273 768a50.734545 50.734545 0 0 1-5.818182-26.763636 186.181818 186.181818 0 0 0-27.927273-99.374546 181.992727 181.992727 0 0 0-24.669091-30.254545 415.883636 415.883636 0 0 1-49.803636-67.723637 378.181818 378.181818 0 0 1-33.28-66.56 226.443636 226.443636 0 0 1-11.403636-68.421818 298.123636 298.123636 0 0 1 7.214545-74.705454 266.24 266.24 0 0 1 46.545455-101.003637 319.767273 319.767273 0 0 1 119.621818-103.796363 291.374545 291.374545 0 0 1 65.163636-23.272728 331.170909 331.170909 0 0 1 81.687273-6.516363 281.134545 281.134545 0 0 1 170.356363 65.629091 338.850909 338.850909 0 0 1 72.378182 82.152727 279.272727 279.272727 0 0 1 37.003637 93.090909 276.014545 276.014545 0 0 1 5.12 80.058182 235.054545 235.054545 0 0 1-16.523637 67.490909 389.12 389.12 0 0 1-83.083636 128.232727 147.083636 147.083636 0 0 0-27.229091 42.123637 202.24 202.24 0 0 0-16.756364 48.872727c-1.629091 10.24-1.629091 20.48-2.56 30.487273a147.781818 147.781818 0 0 1-3.258181 23.272727 60.043636 60.043636 0 0 1-29.556364 35.374545 66.327273 66.327273 0 0 1-34.443636 9.076364z m-18.618182-626.734546c-9.774545 0-19.549091 1.861818-29.090909 3.490909a192.930909 192.930909 0 0 0-65.396363 23.272728A209.454545 209.454545 0 0 0 442.181818 243.665455a194.327273 194.327273 0 0 0-37.934545 55.854545 211.781818 211.781818 0 0 0-16.756364 82.850909 25.134545 25.134545 0 0 0 8.378182 19.781818 23.272727 23.272727 0 0 0 20.712727 5.818182 25.134545 25.134545 0 0 0 19.549091-23.272727V372.363636a144.523636 144.523636 0 0 1 8.610909-43.054545A164.538182 164.538182 0 0 1 502.458182 256a146.850909 146.850909 0 0 1 82.850909-30.021818l16.756364-1.396364a20.48 20.48 0 0 0 16.523636-13.730909 25.134545 25.134545 0 0 0 0-16.523636 20.48 20.48 0 0 0-18.152727-16.523637zM488.727273 861.090909h232.727272a18.152727 18.152727 0 0 1 18.152728 18.152727v56.32a18.385455 18.385455 0 0 1-18.152728 18.618182H488.727273a18.385455 18.385455 0 0 1-18.152728-18.385454v-56.785455A18.152727 18.152727 0 0 1 488.727273 861.090909z"
                              fill="#3F58FD"
                              p-id="4047"
                            ></path>
                          </svg>

                          <a-typography-text>{{ n_t.title }}</a-typography-text>
                        </span>
                        <icon-delete @click="delnow_know(n_t.id)"></icon-delete>
                      </div>
                    </a-card>
                  </a-col>
                </a-row>
                <a-button type="primary" class="mb-2" @click="add_knowledge()"
                  >选择知识库</a-button
                >
              </div>
              <a-empty v-else description="未选择知识库">
                <a-button type="primary" @click="add_knowledge()"
                  >选择知识库</a-button
                >
              </a-empty>
            </div>
            <a-modal
              v-model:visible="knowledge_add"
              title="添加知识库"
              append-to-body
              class="mb_dialog"
            >
              <a-spin class="w-full" :loading="know_loading">
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
                <a-tabs v-model="know_tab" type="capsule" class="mb-3">
                  <a-tab-pane key="me" title="私有">
                    <a-checkbox-group
                      class="w-full"
                      v-model="know_check"
                      @change="changeRadio"
                      v-if="knowledge_list.length > 0"
                    >
                      <a-row :gutter="10" class="w-full">
                        <template
                          v-for="(k, k_index) in knowledge_list"
                          :key="k_index"
                        >
                          <a-col :span="12">
                            <a-checkbox :value="k.id" class="w-75 mb-2">
                              <template #checkbox="{ checked }">
                                <a-space
                                  align="start"
                                  class="custom-checkbox-card"
                                  :class="{
                                    'custom-checkbox-card-checked': checked,
                                  }"
                                >
                                  <div className="custom-checkbox-card-mask">
                                    <div
                                      className="custom-checkbox-card-mask-dot"
                                    />
                                  </div>
                                  <div>
                                    <div className="custom-checkbox-card-title">
                                      {{ k.title }}
                                    </div>
                                    <a-typography-text type="secondary">
                                      {{
                                        k.description
                                          ? k.description
                                          : "暂无描述"
                                      }}
                                    </a-typography-text>
                                  </div>
                                </a-space>
                              </template>
                            </a-checkbox>
                          </a-col>
                        </template>
                      </a-row>
                    </a-checkbox-group>
                    <a-empty v-else description="暂无知识库">
                      <a-button type="primary" @click="add_knowledge_go()"
                        >添加知识库</a-button
                      >
                    </a-empty>
                    <a-pagination
                      class="mt-2"
                      :current="k_page"
                      :page-size="k_limit"
                      background
                      hide-on-single-page
                      :total="know_count"
                      @change="handleCurrentChangeKnowledge"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="all" title="公共">
                    <a-checkbox-group
                      class="w-full"
                      v-model="know_check"
                      @change="changeRadio"
                      v-if="knowledge_public_list.length > 0"
                    >
                      <a-row :gutter="10" class="w-full">
                        <template
                          v-for="(k, k_index) in knowledge_public_list"
                          :key="k_index"
                        >
                          <a-col :span="12">
                            <a-checkbox :value="k.id" class="w-75 mb-2">
                              <template #checkbox="{ checked }">
                                <a-space
                                  align="start"
                                  class="custom-checkbox-card"
                                  :class="{
                                    'custom-checkbox-card-checked': checked,
                                  }"
                                >
                                  <div className="custom-checkbox-card-mask">
                                    <div
                                      className="custom-checkbox-card-mask-dot"
                                    />
                                  </div>
                                  <div>
                                    <div className="custom-checkbox-card-title">
                                      {{ k.title }}
                                    </div>
                                    <a-typography-text type="secondary">
                                      {{
                                        k.description
                                          ? k.description
                                          : "暂无描述"
                                      }}
                                    </a-typography-text>
                                  </div>
                                </a-space>
                              </template>
                            </a-checkbox>
                          </a-col>
                        </template>
                      </a-row>
                    </a-checkbox-group>
                    <a-empty v-else description="暂无公开知识库"> </a-empty>
                    <a-pagination
                      class="mt-2"
                      :current="public_page"
                      :page-size="public_limit"
                      background
                      hide-on-single-page
                      :total="knowledge_public_count"
                      @change="handleCurrentChangeKnowledgePublic"
                    />
                  </a-tab-pane>
                </a-tabs>
              </a-spin>
            </a-modal>
            <a-collapse class="mb-3 better_preview">
              <template #expand-icon="{ active }">
                <icon-face-smile-fill v-if="active" />
                <icon-face-frown-fill v-else />
              </template>
              <a-collapse-item header="高级设置" key="1">
                <template #expand-icon="{ active }">
                  <icon-double-down v-if="active" />
                  <icon-double-right v-else />
                </template>
                <div class="normal_setting">
                  <div class="flex items-center justify-between">
                    <div class="w-[150px]">
                      <p>上下文数量</p>
                    </div>
                    <div class="flex w-[200px] items-center">
                      <a-slider
                        :default-value="Number(counter.setting.chat_up_limit)"
                        v-model="answer_num"
                        :max="15"
                        :step="1"
                        :show-ticks="true"
                      />
                    </div>
                  </div>
                  <p class="mt-2 text-xs text-slate-500">
                    更多的上下文会使问答有联动性，能够结合上下精准回答
                  </p>
                  <div class="flex items-center justify-between mt-4">
                    <div class="w-[150px]">
                      <p>话题精准度</p>
                    </div>
                    <div class="flex w-[200px] items-center">
                      <a-slider
                        :default-value="answer_tem"
                        v-model="answer_tem"
                        :max="2"
                        :step="0.1"
                        :show-ticks="true"
                      />
                    </div>
                  </div>
                  <p class="mt-2 text-xs text-slate-500">
                    正常数值0.8,数值越高每次回答内容更随机
                  </p>
                </div>
              </a-collapse-item>
              <a-collapse-item header="语音设置" key="2">
                <template #expand-icon="{ active }">
                  <icon-double-down v-if="active" />
                  <icon-double-right v-else />
                </template>
                <a-list>
                  <a-list-item
                    class="bg-white"
                    v-for="(item, idx) in voice_role"
                    :key="idx"
                  >
                    <a-list-item-meta
                      class="mr-20"
                      :title="item.label"
                      :description="item.description"
                    >
                      <template #avatar>
                        <a-avatar shape="square">
                          <img alt="avatar" :src="item.image" />
                        </a-avatar>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a-button
                        type="primary"
                        @click="voice_role_change(item.value)"
                        >{{
                          chat_speak == item.value ? "使用中" : "使用"
                        }}</a-button
                      >
                    </template>
                  </a-list-item>
                </a-list>
              </a-collapse-item>
            </a-collapse>
          </div>
        </a-tab-pane>
        <a-tab-pane key="scene" title="高级配置">
          <div class="space-y-3 pt-4">
            <a-row :gutter="20" class="w-full">
              <a-col :span="19">
                <a-input-search
                  v-model="scene_search"
                  placeholder="请输入场景名称"
                  @press-enter="scene_insearch()"
                  @search="scene_insearch()"
                />
              </a-col>
              <a-col :span="5">
                <a-button type="primary" @click="scene_preset = true"
                  >预设场景</a-button
                >
              </a-col>
            </a-row>

            <a-list :loading="scene_loading" :bordered="false">
              <a-list-item
                @click="selectedItem(oc.Instruction, oc.preset, oc.id)"
                class="cursor-pointer"
                v-for="(oc, oc_index) in scene_model"
                :key="oc_index"
              >
                <a-list-item-meta :description="oc.Instruction">
                  <template #title>
                    <div class="flex">
                      <h6 class="mr-2">{{ oc.title }}</h6>
                      <a-tooltip :content="'浏览量：' + oc.view">
                        <svg
                          t="1698473052037"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="36217"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M754.133333 242.773333c-10.88-10.88-26.666667-14.933333-41.386666-10.88-14.72 4.053333-26.24 15.786667-30.08 30.506667-2.986667 11.306667-21.333333 69.973333-40.32 130.133333-48.64-69.333333-119.04-181.12-138.026667-271.146666-1.28-8.533333-5.333333-16.853333-12.16-23.466667a42.666667 42.666667 0 0 0-60.16 0.213333l-0.426667 0.426667c-88.96 90.666667-161.28 261.12-155.093333 395.306667-19.2-24.96-33.28-49.066667-36.906667-67.84-3.626667-18.346667-18.56-32.213333-37.12-34.346667-18.56-2.133333-36.266667 8.106667-43.733333 25.173333-30.08 67.626667-42.666667 142.506667-36.053333 218.24 17.28 134.826667 117.546667 244.906667 261.333333 287.146667 37.12 11.093333 75.52 16.853333 114.346667 17.066667 147.413333 0 325.973333-85.76 382.293333-249.813334 71.68-208-48.426667-369.28-126.506667-446.72z m46.293334 418.346667C757.546667 785.92 612.906667 853.333333 498.986667 853.333333c-30.506667-0.213333-61.013333-4.693333-90.453334-13.44-87.04-25.386667-185.6-95.573333-200.746666-214.186666-2.346667-26.453333-1.493333-53.333333 2.133333-79.573334 49.066667 64.426667 114.346667 120.106667 125.013333 128.853334 14.72 12.373333 36.053333 13.226667 51.84 2.346666 15.786667-11.093333 22.186667-31.146667 15.786667-49.28l-30.933333-86.613333c-28.373333-79.146667 7.466667-221.653333 74.24-323.84 56.96 141.653333 173.226667 286.933333 178.986666 294.186667 9.813333 12.16 25.6 18.133333 40.96 15.146666 15.36-2.773333 27.946667-14.08 32.853334-29.013333 3.84-11.946667 26.026667-81.493333 43.946666-138.666667 53.12 71.04 100.693333 177.066667 57.813334 301.866667z"
                            p-id="36218"
                            fill="#8a8a8a"
                          ></path>
                        </svg>
                        {{ oc.view }}
                      </a-tooltip>
                    </div>
                  </template>
                  <template #avatar>
                    <a-avatar shape="square" :imageUrl="oc.icon"> </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
              <a-pagination
                class="mt-2"
                :current="s_page"
                :page-size="s_limit"
                background
                hide-on-single-page
                :total="scene_count"
                @change="handleCurrentChangeScene"
              />
              <a-empty v-show="scene_count == 0" description="暂无数据" />
            </a-list>
          </div>
        </a-tab-pane>
      </a-tabs>

      <template #footer>
        <span class="dialog-footer">
          <a-button type="primary" @click="dialog_scene = false">
            配置完成
          </a-button>
        </span>
      </template>
    </a-modal>
    <a-drawer
      v-model:visible="drawer"
      placement="left"
      class="drawer_index"
      unmountOnClose
      :header="false"
    >
      <a-space class="p-2 flex justify-between w-full">
        <h1 class="m-0 font-bold">Message</h1>
        <div class="message_action">
          <a-button class="rounded mr-2" type="primary" @click="add_new_chat()">
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
          <a-popconfirm
            content="此操作将永久删除所有会话,确定要删除吗?"
            @ok="delete_all"
            type="warning"
          >
            <a-button class="rounded">
              <template #icon>
                <icon-delete />
              </template>
            </a-button>
          </a-popconfirm>
        </div>
      </a-space>
      <a-space class="w-full flex justify-between search_space" wrap>
        <a-input-search
          class="ml-2 mr-0 rounded"
          v-model="qs_input"
          @search="qs_search"
          @keydown.enter.native="qs_search"
          placeholder="搜索..."
        />
        <a-button class="rounded mr-2" @click="all_message()">
          <template #icon>
            <icon-loop />
          </template>
        </a-button>
      </a-space>
      <a-spin :loading="left_loding" tip="Loading..">
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
        <div v-if="messages.length > 0" class="chat_list_message p-2">
          <ul class="chat-list mb-2">
            <div class="bot_info">
              <li
                class="online list-animation-bottomIn"
                :class="[
                  ms_active == item[item.length - 1].session_id ? 'active' : '',
                  'delay-' + index,
                ]"
                v-for="(item, index) in messages"
                :key="index"
              >
                <div class="hover_action">
                  <a-space>
                    <icon-edit
                      @click="change_sname(item[item.length - 1].session_id)"
                    />
                    <a-popconfirm
                      content="此操作将永久删除当前会话,确定要删除吗?"
                      @ok="delete_msg(item[item.length - 1].session_id)"
                      type="warning"
                    >
                      <icon-delete />
                    </a-popconfirm>
                  </a-space>
                </div>
                <div
                  class="card bg-boli mb-2"
                  @click="check_message(item[item.length - 1].session_id)"
                >
                  <div class="card-body">
                    <div class="media">
                      <div class="avatar me-3">
                        <a-avatar
                          v-if="item[item.length - 1].icon"
                          @click="send_avatar()"
                          shape="square"
                          :imageUrl="item[item.length - 1].icon"
                        >
                        </a-avatar>
                        <a-avatar @click="send_avatar()" v-else>
                          <img :src="counter.setting.ai_chat_normal" alt="" />
                        </a-avatar>
                      </div>
                      <div class="media-body overflow-hidden">
                        <div class="d-flex align-items-center mb-1">
                          <h6
                            class="text-truncate mb-0 me-auto"
                            v-if="item[item.length - 1].message_b"
                          >
                            {{ item[item.length - 1].message_b }}
                          </h6>
                          <h6 class="text-truncate mb-0 me-auto" v-else>
                            {{
                              item[item.length - 1].question
                                ? item[item.length - 1].question
                                : "新会话"
                            }}
                          </h6>
                        </div>
                        <div
                          class="text-truncate h-20"
                          v-html="
                            item[item.length - 1].message
                              ? item[item.length - 1].message.replace(
                                  /\n/g,
                                  '<br />'
                                )
                              : '暂无消息'
                          "
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          </ul>
          <a-modal
            v-model:visible="avatar_select"
            title="头像预设"
            :footer="false"
          >
            <div class="avatar_preset" v-if="all_avatar_preset.length > 0">
              <a-space class="flex-wrap justify-between">
                <a-avatar
                  class="cursor-pointer"
                  :size="64"
                  v-for="(a_item, a_index) in all_avatar_preset"
                  :imageUrl="a_item.avatar"
                  width="200"
                  @click="change_avatar(a_item.id)"
                />
              </a-space>
            </div>
            <a-empty v-else></a-empty>
          </a-modal>
        </div>
        <a-empty v-else />
        <a-pagination
          size="small"
          :total="ms_count"
          :current="page"
          :page-size="limit"
          class="justify-content-center mb-2 mt-2"
          background
          simple
          @change="handleCurrentChange"
          :hide-on-single-page="true"
        />
      </a-spin>
      <a-modal v-model:visible="beizhu_info" title="修改备注" @ok="handle_send">
        <a-input v-model="beizhu" />
      </a-modal>

      <template #footer>
        <div class="mb-3 dark:border-t-neutral-800">
          <div class="p-2 bg-n-6 rounded-xl">
            <a-trigger :trigger="['click', 'hover', 'focus']" v-if="token">
              <div class="flex items-center px-2.5 py-2.5 pb-4.5">
                <div class="relative w-10 h-10">
                  <a-avatar>
                    <img
                      :src="user_info.avatar"
                      alt="avatar"
                      class="rounded-full w-10 h-10"
                    />
                  </a-avatar>
                  <div
                    class="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 rounded-full border-4 border-n-6 bg-green-300 top-1 border-green-300"
                  ></div>
                </div>
                <div class="ml-1 mr-2">
                  <div class="base2 font-semibold text-n-1 text-truncate">
                    {{ user_info.name }}
                  </div>
                  <div class="caption1 font-semibold text-n-3/50 text-truncate">
                    {{ counter.setting.money_name_set }}:{{ user_info.money }}
                  </div>
                </div>
                <div
                  class="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
                >
                  {{ vip_level }}
                </div>
              </div>
              <template #content>
                <div class="nav-wraper">
                  <div class="user-info-box">
                    <div class="user-dis">
                      <a-avatar
                        :imageUrl="user_info.avatar"
                        class="rounded-full w-10 h-10"
                      >
                      </a-avatar>
                      <span class="nickname flex-wrap ml-1">
                        <span>{{ user_info.name }}</span>
                        <div
                          class="shrnik-0 px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
                        >
                          {{ vip_level }}
                        </div>
                      </span>
                    </div>
                    <div class="use-info user-type">
                      <span class="number">问答 </span><span>{{ user_qs }}</span
                      ><span>{{ last_msg }}/{{ total_msg }}次 </span>
                      <a-tag class="ml-1" color="#165dff" size="small">{{
                        check_vip_type(vip_type)
                      }}</a-tag>
                    </div>
                    <div class="use-info user-type">
                      <span class="number">绘画 </span
                      ><span>{{ last_draw }}/{{ total_draw }}次 </span>
                      <a-tag class="ml-1" color="#165dff" size="small">{{
                        check_vip_type(vip_type)
                      }}</a-tag>
                    </div>
                    <div class="use-info">
                      <span class="number">{{
                        counter.setting.money_name_set
                      }}</span
                      ><span>{{ user_info.money }}</span>
                    </div>
                    <div class="quit" @click="quit_out()">
                      <div name="quit" class="i-svg quit-icon-blue">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="Group 1000007605">
                            <rect
                              id="Rectangle 10"
                              x="15.0001"
                              y="9.41418"
                              width="2"
                              height="6"
                              rx="1"
                              transform="rotate(-45 15.0001 9.41418)"
                              fill="#057cff"
                            ></rect>
                            <rect
                              id="Rectangle 11"
                              x="19.2427"
                              y="10.8284"
                              width="2"
                              height="6"
                              rx="1"
                              transform="rotate(45 19.2427 10.8284)"
                              fill="#057cff"
                            ></rect>
                            <rect
                              id="Rectangle 12"
                              x="19"
                              y="11"
                              width="2"
                              height="11"
                              rx="1"
                              transform="rotate(90 19 11)"
                              fill="#057cff"
                            ></rect>
                            <path
                              id="Rectangle 11218"
                              d="M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17"
                              stroke="#057cff"
                              stroke-width="2"
                              stroke-linecap="round"
                            ></path>
                          </g>
                        </svg>
                      </div>
                      退出登录
                    </div>
                  </div>
                </div>
              </template>
            </a-trigger>

            <div class="flex items-center px-2.5 py-2.5 pb-4.5" v-else>
              <div class="relative w-10 h-10">
                <a-avatar :style="{ backgroundColor: '#3370ff' }">
                  <IconUser />
                </a-avatar>
                <div
                  class="absolute -right-0.75 -bottom-0.75 w-4.5 h-4.5 rounded-full border-4 border-n-6 bg-green-300 top-1 border-green-300"
                ></div>
              </div>
              <div class="ml-1 mr-2">
                <div class="base2 font-semibold text-n-1 text-truncate">
                  请先登录
                </div>
              </div>
              <div
                class="shrnik-0 ml-auto self-start px-3 bg-primary-2 rounded-lg caption1 font-bold text-n-7 pack_tag_vip"
              >
                {{ vip_level }}
              </div>
            </div>
            <a-button
              @click="login_dialog_click()"
              class="w-full"
              v-if="!token"
            >
              用户登录
            </a-button>
            <a-button class="w-full" v-else @click="charge()">
              <div v-if="counter.setting.show_limit_front == '1'">
                VIP剩余
                <a-tag color="arcoblue" class="ml-1 mr-1"> {{ last_msg }}</a-tag
                >次问答
              </div>
              <div v-else>升级会员</div>
            </a-button>
          </div>
        </div>
      </template>
    </a-drawer>
    <Login :login_dialog="login_dialog" @handleCancel="handleCancel" />
    <a-modal v-model:visible="dialogFormVisible" title="充值">
      <Charge
        :dialogFormVisible="dialogFormVisible"
        @handleCancels="handleCancels"
        @payment-success="handlePaymentSuccess"
      />
    </a-modal>
    <!-- <Charge
      :dialogFormVisible="dialogFormVisible"
      @handleCancels="handleCancels"
      @payment-success="handlePaymentSuccess"
    /> -->
    <a-modal
      v-model:visible="img_download"
      class="message_export_modal"
      :footer="false"
    >
      <template #title> 导出聊天记录 </template>
      <div class="export_message">
        <div class="flex justify-content-center">
          <a-space>
            <a-button
              @click="save_message_img('PNG')"
              type="primary"
              status="success"
            >
              <template #icon>
                <icon-download />
              </template>
              导出PNG
            </a-button>
            <a-button
              @click="save_message_img('JPG')"
              type="primary"
              status="warning"
            >
              <template #icon>
                <icon-download />
              </template>
              导出JPG
            </a-button>
            <a-button @click="reduce_chat()" type="primary">
              <template #icon>
                <icon-share-internal />
              </template>
              生成聊天链接
            </a-button>
          </a-space>
        </div>

        <div class="main all_message_export">
          <div class="chat-body bg-white border mt-2 h-full">
            <div class="chat-content overflow-visible">
              <div class="pb-32 sm:py-6 relative" ref="poster">
                <a-card hoverable class="m-2">
                  <div
                    :style="{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }"
                  >
                    <span
                      :style="{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#1D2129',
                      }"
                    >
                      <span class="mr-2" style="font-size: 40px">🥰</span>
                      <a-typography-text>{{
                        counter.setting.title
                      }}</a-typography-text>
                    </span>
                    <div class="flex flex-column">
                      <a-tag size="small" type="outline" class="mb-2">
                        模型：{{ model_is_select }}
                      </a-tag>
                      <a-tag size="small" type="outline" class="mb-2">
                        消息：{{ me_message.length * 2 }}
                      </a-tag>
                      <a-tag size="small" type="outline" class="mb-2">
                        时间：{{
                          me_message.length > 0
                            ? me_message[me_message.length - 1].created_at
                            : ""
                        }}
                      </a-tag>
                    </div>
                  </div>
                </a-card>

                <div class="container-xxl" v-if="me_message.length > 0">
                  <ul class="list-unstyled pt-5">
                    <!--qs-->

                    <div
                      class="message_s"
                      v-for="(item, index) in me_message"
                      :key="index"
                    >
                      <li class="d-flex message right">
                        <div class="message-body">
                          <span class="date-time text-muted"
                            >{{ item.created_at }}
                          </span>
                          <div
                            class="message-row d-flex align-items-center justify-content-end"
                          >
                            <div
                              class="message-content me_content border p-3"
                              v-if="item.question"
                              v-html="renderMarkdown(item.question)"
                            ></div>
                          </div>
                        </div>
                      </li>

                      <li class="d-flex message">
                        <div class="mr-lg-3 me-2">
                          <span class="mr-1" style="font-size: 40px">🥰</span>
                        </div>

                        <div class="message-body">
                          <span class="date-time text-muted">{{
                            item.created_at
                          }}</span>
                          <div
                            class="message-row relative d-flex flex-column align-items-start"
                          >
                            <div
                              class="message-content p-3"
                              :class="
                                index == me_message.length - 1 && !is_done
                                  ? 'ms-up'
                                  : ''
                              "
                              v-html="
                                item.message
                                  ? renderMarkdown(item.message).replace(
                                      /\\n/g,
                                      '\n'
                                    )
                                  : ''
                              "
                            ></div>
                          </div>
                        </div>
                      </li>
                    </div>
                    <!--qs end-->
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="dialog_html"
      title="代码运行"
      class="message_export_modal"
      :footer="false"
    >
      <iframe
        :key="iframeKey"
        ref="iframes"
        style="width: 100%; height: 400px"
      ></iframe>
    </a-modal>
    <!-- Feedback Modal -->
    <FeedbackModal
      :is-open="isFeedbackModalOpen"
      :feedback-type="feedbackType"
      :reportable-id="selectedReportableId"
      :model-key="modelKey"
      @close="closeFeedbackModal"
      @submit="handleFeedbackSubmit"
    />

    <!-- Selection Modal -->
    <!-- <a-modal
      v-model:visible="showSelectionModal"
      :title="`Select ${selectionCount} Models`"
    >
      <p>Select exactly {{ selectionCount }} models to compare.</p>
      <a-checkbox-group v-model="tempSelectedModels">
        <a-checkbox
          v-for="model in enabledModels"
          :key="model.model_key"
          :value="model.model_key"
        >
          {{ model.model_name }}
        </a-checkbox>
      </a-checkbox-group>
      <template #footer>
        <a-button @click="showSelectionModal = false">Cancel</a-button>
        <a-button
          type="primary"
          @click="confirmSelection"
          :disabled="tempSelectedModels.length !== selectionCount"
        >
          Confirm
        </a-button>
      </template>
    </a-modal> -->
  </main>
</template>

<script lang="ts" setup>
import FeedbackModal from "~/components/chat/FeedbackModal.vue";
import ModelSelectionModal from "~/components/chat/ModelSelectionModal.vue";
import { useCounter } from "~/store/counter";
import { ref } from "vue";
import ClipboardJS from "clipboard";
import hljs from "highlight.js";
import markdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import fileSaver from "file-saver";
import { asBlob } from "html-docx-js-typescript";
import Speech from "speak-tts";
import mermaid from "mermaid";
import Recorder from "recorder-core";
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine"; //如果此格式有额外的编码引擎（*-engine.js）的话，必须要加上
import { Message } from "@arco-design/web-vue";
import MultiWindowChat from "~/components/chat/MultiWindow.vue";
import LoginPromptModal from "~/components/chat/LoginPromptModal.vue";
import {
  fetchModelSettingsMode,
  submitReport,
  submitMessageReport,
  fetchEnabledModels,
} from "~/api/api";
import { useCookie } from "nuxt/app";

import {
  IconEdit,
  IconDelete,
  IconNotification,
  IconSend,
  IconPublic,
  IconUser,
  IconVoice,
  IconCopy,
  IconPlus,
  IconCommand,
  IconRefresh,
  IconCode,
  IconRecordStop,
  IconDoubleDown,
  IconDoubleRight,
  IconShareInternal,
  IconDownload,
  IconFaceFrownFill,
  IconFaceSmileFill,
  IconLeft,
  IconRight,
  IconLoop,
  IconImage,
  IconCaretDown,
  IconList,
} from "@arco-design/web-vue/es/icon";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg } from "html-to-image";
import markdownItMatch from "markdown-it-math";
const img_download = ref(false);
const counter = useCounter();
const chat_open = ref(true);
definePageMeta({
  middleware: ["mustlogin"],
});
const isFeedbackModalOpen = ref(false);
const feedbackType = ref(""); // "positive" or "negative"
const selectedReportableId = ref(null);
const modelKey = ref("ai_chat");
const chatModeLocked = ref(false);

// Ensure sidebar refreshes and ms_active syncs with multi-window sessions
const handleHistoryUpdated = (sessionId) => {
  console.log("History updated for session:", sessionId);
  ms_active.value = sessionId; // Sync active session
  all_message(); // Refresh sidebar history
};

// Handle Thumbs Up
const handleThumbsUp = (id) => {
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
      reportable_type: "Message",
      ai_function: "text",
      user_id: user_info.value.id || null,
      report_type: data.type,
      issue_category: data.issueType || null,
      reason: data.text || "No reason provided",
    };
    console.log("Submitting feedback with payload:", reportData);
    const response = await submitMessageReport(reportData);
    if (response.success) {
      alert("Feedback submitted successfully");
      console.log("Feedback response:", response);
    } else {
      throw new Error(response.error || "Failed to submit feedback");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Failed to submit feedback: " + error.message);
  }
  closeFeedbackModal();
};

// const typewriterEffect = (index: number) => {
//   const fullMessage = me_message.value[index].fullMessage;
//   if (me_message.value[index].isTyping) return; // Prevent multiple typewriter effects
//   me_message.value[index].isTyping = true;

//   let currentMessage = "";
//   let i = 0;
//   let isCodeBlock = false;
//   let codeBlocks = [];
//   let currentSegment = 0;

//   const codeBlockRegex = /```[\s\S]*?```/g;
//   let match;
//   let lastIndex = 0;

//   while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
//     const start = match.index;
//     const end = codeBlockRegex.lastIndex;
//     const codeContent = match[0].replace(/^```|```$/g, "").trim();
//     codeBlocks.push({
//       start,
//       end,
//       content: codeContent,
//       textBefore: fullMessage.slice(lastIndex, start),
//     });
//     lastIndex = end;
//   }

//   if (codeBlocks.length === 0) {
//     codeBlocks.push({
//       start: 0,
//       end: fullMessage.length,
//       content: fullMessage,
//       textBefore: "",
//       isPlainText: true,
//     });
//   } else {
//     if (lastIndex < fullMessage.length) {
//       codeBlocks.push({
//         start: lastIndex,
//         end: fullMessage.length,
//         content: fullMessage.slice(lastIndex),
//         textBefore: "",
//         isPlainText: true,
//       });
//     }
//   }

//   me_message.value[index].isCode = false;
//   me_message.value[index].codeSegments = [];
//   me_message.value[index].textSegments = [];

//   const typeNextSegment = () => {
//     if (currentSegment >= codeBlocks.length) {
//       me_message.value[index].isComplete = true;
//       me_message.value[index].isTyping = false; // Reset typing flag
//       down_message();
//       return;
//     }

//     const segment = codeBlocks[currentSegment];
//     const contentToType = segment.isPlainText
//       ? segment.content
//       : segment.content;
//     isCodeBlock = !segment.isPlainText;

//     me_message.value[index].isCode = isCodeBlock;

//     currentMessage = "";
//     i = 0;

//     if (isCodeBlock) {
//       me_message.value[index].codeSegments[currentSegment] = contentToType;
//       me_message.value[index].textSegments[currentSegment] = segment.textBefore;
//       currentSegment++;
//       typeNextSegment();
//     } else {
//       const typeCharacter = () => {
//         if (i < contentToType.length) {
//           currentMessage += contentToType[i];
//           i++;
//           me_message.value[index].textSegments[currentSegment] =
//             segment.textBefore + currentMessage;
//           me_message.value[index].codeSegments[currentSegment] = "";
//           me_message.value[index].message = currentMessage;
//           setTimeout(typeCharacter, 50); // Add a small delay for smoother rendering
//         } else {
//           me_message.value[index].textSegments[currentSegment] =
//             segment.textBefore + contentToType;
//           currentSegment++;
//           typeNextSegment();
//         }
//       };
//       typeCharacter();
//     }
//   };

//   typeNextSegment();
// };

// const typewriterEffect = (index: number) => {
//   const fullMessage = me_message.value[index].fullMessage;
//   if (me_message.value[index].isTyping) return; // Prevent multiple typewriter effects
//   me_message.value[index].isTyping = true;

//   me_message.value[index].isCode = false;
//   me_message.value[index].codeSegments = [];
//   me_message.value[index].textSegments = [];

//   // Split the message into segments (code blocks and plain text)
//   const codeBlockRegex = /```[\s\S]*?```/g;
//   let codeBlocks = [];
//   let lastIndex = 0;
//   let match;

//   while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
//     const start = match.index;
//     const end = codeBlockRegex.lastIndex;
//     const codeContent = match[0].replace(/^```|```$/g, "").trim();
//     codeBlocks.push({
//       start,
//       end,
//       content: codeContent,
//       textBefore: fullMessage.slice(lastIndex, start),
//     });
//     lastIndex = end;
//   }

//   if (codeBlocks.length === 0) {
//     codeBlocks.push({
//       start: 0,
//       end: fullMessage.length,
//       content: fullMessage,
//       textBefore: "",
//       isPlainText: true,
//     });
//   } else if (lastIndex < fullMessage.length) {
//     codeBlocks.push({
//       start: lastIndex,
//       end: fullMessage.length,
//       content: fullMessage.slice(lastIndex),
//       textBefore: "",
//       isPlainText: true,
//     });
//   }

//   let currentSegment = 0;

//   const typeNextSegment = () => {
//     if (currentSegment >= codeBlocks.length) {
//       messageObj.isTyping = false;
//       messageObj.isComplete = true;
//       // me_message.value[index].isComplete = true;
//       // me_message.value[index].isTyping = false;
//       down_message();
//       return;
//     }

//     const segment = codeBlocks[currentSegment];
//     const isCodeBlock = !segment.isPlainText;
//     me_message.value[index].isCode = isCodeBlock;

//     if (isCodeBlock) {
//       // Display code blocks instantly
//       me_message.value[index].codeSegments[currentSegment] = segment.content;
//       me_message.value[index].textSegments[currentSegment] = segment.textBefore;
//       currentSegment++;
//       setTimeout(typeNextSegment, 0); // Move to next segment immediately
//     } else {
//       // Type plain text word by word
//       const words = segment.content.split(" ");
//       let wordIndex = 0;
//       me_message.value[index].textSegments[currentSegment] = segment.textBefore;
//       me_message.value[index].codeSegments[currentSegment] = "";

//       const typeWord = () => {
//         if (wordIndex < words.length) {
//           const currentText =
//             me_message.value[index].textSegments[currentSegment];
//           me_message.value[index].textSegments[currentSegment] =
//             currentText + (currentText ? " " : "") + words[wordIndex];
//           me_message.value[index].message =
//             me_message.value[index].textSegments[currentSegment];
//           wordIndex++;
//           setTimeout(typeWord, 100); // 100ms per word for faster typing
//         } else {
//           currentSegment++;
//           typeNextSegment();
//         }
//       };
//       typeWord();
//     }
//   };

//   typeNextSegment();
// };
const voice_list = ref(false);
const voice_list_arr = ref([]);
const voice_page = ref(1);
const voice_limit = ref(10);
const voice_count = ref(0);
const hasMessageBeenSent = ref(false);
const voice_get_list = () => {
  voice_set_loading.value = true;
  voice_lists({
    page: voice_page.value,
    limit: voice_limit.value,
  })
    .then((res: any) => {
      voice_set_loading.value = false;
      voice_list_arr.value = res._rawValue.data;
      voice_count.value = res._rawValue.count;
    })
    .catch((err: any) => {
      voice_set_loading.value = false;
      console.log(err);
    });
};
const voice_change = () => {
  voice_list.value = !voice_list.value;
  voice_get_list();
};

const handleCancelVoice = () => {
  voice_list.value = false;
};
const renderMarkdown = (markdown: any) => {
  // 预处理 <think> 标签，使用特殊标记替换，避免被 markdown 转义
  markdown = markdown.replace(
    /<think>([\s\S]*?)<\/think>/g,
    (match: string, content: string) => {
      // 使用 :::THINK_START::: 和 :::THINK_END::: 作为临时标记
      return `:::THINK_START:::${content.trim()}:::THINK_END:::`;
    }
  );

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
          return `<pre class="hljs"><span class="pre_copy">Copy</span><span class="run_code">运行代码</span><code>${
            hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true,
            }).value
          }</code></pre>`;
        } catch (__) {}
      }

      return `<pre class="hljs"><span class="pre_copy">Copy</span><span class="run_code">运行代码</span><code>${markdownIt().utils.escapeHtml(
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

  let renderedMarkdown = md.render(markdown);

  // 将临时标记替换回 HTML
  renderedMarkdown = renderedMarkdown.replace(
    /:::THINK_START:::([\s\S]*?):::THINK_END:::/g,
    (match: string, content: string) => {
      return `<div class="bg-white hover:translate-y-[-2px] transition-all duration-300 shadow-md rounded-2xl border border-gray-200  p-3 my-2"><span class="text-gray-500 font-bold border-b border-b-2 border-blue-500">思考过程</span>：${content}</div>`;
    }
  );

  if (is_done.value) {
    mermaid.initialize({ startOnLoad: true });
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  }

  return renderedMarkdown;
};

useHead({
  title: "AI聊天 - " + counter.setting.title,
  meta: [
    { name: "description", content: counter.setting.description },
    { name: "keywords", content: counter.setting.keywords },
  ],
});

const plugins_select = ref(false);
const plugins_list = ref([
  {
    title: "读取网站关键词",
    icon: '<svg t="1698160339582" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1244" width="28" height="28"><path d="M290.76 275l58.48 26-128 287.928-58.48-25.998zM431.105 271.84l254.514 434.983-55.239 32.32-254.514-434.982zM773.086 440.303l62.12 15.394-68.146 274.984-62.12-15.395z" fill="#3F454B" p-id="1245"></path><path d="M160 528c-61.856 0-112 50.144-112 112s50.144 112 112 112 112-50.144 112-112-50.144-112-112-112z m0 64c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.49-48 48-48zM816 256c-61.856 0-112 50.144-112 112s50.144 112 112 112 112-50.144 112-112-50.144-112-112-112z m0 64c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.49-48 48-48zM368 112c-61.856 0-112 50.144-112 112s50.144 112 112 112 112-50.144 112-112-50.144-112-112-112z m0 64c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.49-48 48-48zM706 672c-61.856 0-112 50.144-112 112s50.144 112 112 112 112-50.144 112-112-50.144-112-112-112z m0 64c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.49-48 48-48z" fill="#397AFF" p-id="1246"></path></svg>\n',
    id: "keywords",
    input_info: "格式如：https://www.baidu.com",
  },
  {
    title: "访问网页内容",
    icon: '<svg t="1698160816213" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1513" width="28" height="28"><path d="M880 112H144c-17.673 0-32 14.327-32 32v592c0 17.673 14.327 32 32 32h736c17.673 0 32-14.327 32-32V144c0-17.673-14.327-32-32-32z m-32 64v528H176V176h672z" fill="#3F454B" p-id="1514"></path><path d="M496.562 707.97a32 32 0 0 1 30.424-0.244l0.452 0.244 256 141c15.48 8.527 21.118 27.988 12.592 43.468-8.441 15.326-27.6 21.004-43.003 12.843l-0.465-0.251L512 772.532 271.438 905.03c-15.325 8.44-34.553 3-43.209-12.13l-0.259-0.462c-8.44-15.325-3-34.553 12.13-43.209l0.462-0.259 256-141z" fill="#3F454B" p-id="1515"></path><path d="M743.454 321.71c6.788-16.318 25.52-24.044 41.837-17.256 16.317 6.788 24.043 25.52 17.255 41.837-44.74 107.549-108.202 168.828-190.53 178.564-32.997 3.903-60.942-4.726-83.892-24.17-15.93-13.495-26.88-28.726-41.863-54.736l-7.598-13.332c-10.223-17.881-16.387-26.83-22.685-32.511-5.25-4.736-9.41-6.098-16.553-5.015-42.556 6.451-94.229 53.636-151.379 144.012-9.446 14.937-29.212 19.389-44.149 9.943-14.937-9.446-19.389-29.212-9.943-44.149C300.11 400.278 364.19 341.765 429.833 331.814c26.705-4.048 49.926 3.551 69.015 20.771 12.467 11.247 21.246 23.749 33.964 45.809l7.966 13.972c23.396 40.876 36.68 52.13 63.72 48.932 55.896-6.61 102.263-51.382 138.956-139.589z" fill="#397AFF" p-id="1516"></path></svg>\n',
    id: "url_read",
    input_info: "格式如：https://www.baidu.com",
  },
  {
    title: "视频内容识别",
    icon: '<svg t="1698509685987" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5475" width="28" height="28"><path d="M512 100v64H200a8 8 0 0 0-7.996 7.75L192 172v680a8 8 0 0 0 7.75 7.996l0.25 0.004h624a8 8 0 0 0 7.996-7.75L832 852V512h64v340c0 39.367-31.594 71.355-70.81 71.99L824 924H200c-39.367 0-71.355-31.594-71.99-70.81L128 852V172c0-39.367 31.594-71.355 70.81-71.99L200 100h312z" fill="#3F454B" p-id="5476"></path><path d="M836.433 115.75l55.134 32.5-224 380-55.134-32.5z" fill="#3F454B" p-id="5477"></path><path d="M652 241v64H272v-64zM539 576v64H272v-64zM448 417v64H272v-64z" fill="#397AFF" p-id="5478"></path></svg>',
    id: "video_read",
    input_info: "格式如：https://www.bilibili.com/video/BV1AN4y1k7Pg",
  },
  {
    title: "图片识别",
    icon: '<svg t="1699704058271" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6026" width="28" height="28"><path d="M676.032 368m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#397AFF" p-id="6027"></path><path d="M374.528 405.888a32 32 0 0 1 45.312-0.96l0.384 0.384 405.76 404.032a32 32 0 0 1-44.736 45.696l-0.384-0.384-382.72-380.928-277.056 289.408a32 32 0 0 1-44.8 1.28l-0.448-0.32a32 32 0 0 1-1.28-44.8l0.32-0.448 299.648-312.96z" fill="#397AFF" p-id="6028"></path><path d="M749.12 509.888a32 32 0 0 1 45.312-0.96l0.384 0.384 147.776 147.008a32 32 0 0 1-44.8 45.76l-0.384-0.384-124.608-124.032-108.672 113.408a32 32 0 0 1-44.864 1.28l-0.384-0.32a32 32 0 0 1-1.344-44.8l0.384-0.448 131.2-136.96z" fill="#397AFF" p-id="6029"></path><path d="M887.04 160H137.92c-39.744 0-72 32.256-72 72v560c0 39.744 32.256 72 72 72H887.04c39.808 0 72-32.256 72-72v-560c0-39.744-32.192-72-72-72z m-749.056 64H887.04c4.48 0 8 3.584 8 8v560a8 8 0 0 1-8 8H137.984a8 8 0 0 1-8-8v-560c0-4.416 3.584-8 8-8z" fill="#3F454B" p-id="6030"></path></svg>',
    id: "image_read",
    input_info: "",
  },
  {
    title: "联网搜索",
    icon: '<svg t="1699805667516" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6026" width="28" height="28"><path d="M564.491 191.135c2.596-17.481 18.872-29.548 36.354-26.952C787.847 191.952 928 353.097 928 544c0 212.077-171.923 384-384 384-122.108 0-234.738-57.42-306.835-153.08-10.637-14.113-7.818-34.178 6.295-44.815 14.114-10.637 34.178-7.819 44.815 6.295C348.405 816.18 442.201 864 544 864c176.731 0 320-143.269 320-320 0-157.484-114.49-290.696-267.895-315.784l-4.661-0.727c-17.481-2.596-29.549-18.872-26.953-36.354z" fill="#3F454B" p-id="6027"></path><path d="M379.787 95L67.585 635.75c-12.317 21.333 3.08 48 27.713 48h624.404c24.634 0 40.03-26.667 27.713-48L435.213 95c-12.317-21.333-43.109-21.333-55.426 0z m27.713 79.999L664.276 619.75H150.723L407.5 174.999z" fill="#397AFF" p-id="6028"></path></svg>',
    id: "online_search",
    input_info: "",
  },
]);
const getPlugins = (id: any) => {
  plugins_select.value = id;
  plugins_list.value.forEach((item: any) => {
    if (item.id == id) {
      ruleForm.message_input = item.input_info;
    }
  });
};
const actions = counter.setting.APP_URL + "/api/upload_model";

const text_imageUrls = ref([]);

const TextSuccess = (currentFile: any) => {
  if (currentFile.response.status !== 200) {
    Message.error("上传失败!");
    return;
  }
  Message.success("上传成功!");
  const imageUrl = currentFile.response.data;
  text_imageUrls.value.push(imageUrl);
  console.log("Uploaded image URL:", imageUrl);
  // Automatically set plugins_select to image_read on image upload
  plugins_select.value = "image_read";
  ruleForm.message_input = "";
  model_is_select.value = "gpt-4o-2024-05-13";
  console.log(
    "Set plugins_select to image_read and model_is_select to gpt-4o-2024-05-13"
  );
};

const beforeUpload = (file: File) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    Message.error("Only JPG/PNG/PDF/DOC/DOCX formats are supported");
    return false;
  }

  if (file.size / 1024 / 1024 > 15) {
    Message.error(`${file.name} 文件大小超过15MB限制`);
    return false;
  }

  return true;
};

const isImage = (url) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const ext = url.split(".").pop().toLowerCase();
  return imageExtensions.includes(ext);
};

const deleteImage = (index) => {
  text_imageUrls.value.splice(index, 1);
};
const now_html_code = ref("");
const dialog_html = ref(false);
const iframes = ref();
const iframeKey = ref(0); // 用于强制重新渲染 iframe

const sidebarRef = ref(null);

watch(dialog_html, (newVal) => {
  iframeKey.value += 1;
  // 当对话框打开关闭时，清空 iframe 内容
  const iframe = iframes.value;
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(""); // 清空内容
  doc.close();
});
const handleClickEvent = (event: any) => {
  if (event.target.classList.contains("run_code")) {
    const codeElement = event.target.nextElementSibling;
    if (codeElement && codeElement.tagName === "CODE") {
      dialog_html.value = true;
      const codeContent = codeElement.innerText;
      now_html_code.value = codeContent;

      nextTick(() => {
        const iframe = iframes.value;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(now_html_code.value);
        doc.close();
      });
    }
  } else if (event.target.classList.contains("pre_copy")) {
    const codeElement = event.target.nextElementSibling.nextElementSibling;
    if (codeElement && codeElement.tagName === "CODE") {
      const codeContent = codeElement.innerText;
      const input = document.createElement("input");
      input.setAttribute("readonly", "readonly");
      input.setAttribute("value", codeContent);
      document.body.appendChild(input);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        Message.success("复制成功");
      } else {
        Message.error("复制失败");
      }
      document.body.removeChild(input);
    }
  }
};

const login_dialog = ref(false);
const login_dialog_click = () => {
  login_dialog.value = true;
};
const scene_preset = ref(false);
const handleCancel = () => {
  login_dialog.value = false;
};
const dialogFormVisible = ref(false);
const charge = () => {
  dialogFormVisible.value = true;
};
const handleCancels = () => {
  dialogFormVisible.value = false;
};
const model_big_choose = ref(
  counter.setting.normal_ai_select ? counter.setting.normal_ai_select : "gpt"
);

// Reference to MultiWindowChat component
const multiWindowRef = ref(null);
const showMultiWindow = ref(false);
const multiWindowDisplayCount = ref(4);
const showLoginModal = ref(false);

const enabledModels = ref([]);
const showModelSelectionModal = ref(false);
const selectionType = ref(0); // 2 for multi, 4 for quad
const selectedModels = ref([]);

// // Load enabled models for multi-window
// const enabledModels = ref([]);
// const loadEnabledModels = async () => {
//   const data = await fetchEnabledModels();
//   enabledModels.value = data.models || [];
// };

// Toggle multi-window
// const button1Action = () => {
//   showMultiWindow.value = !showMultiWindow.value;
// };

const userinfo2 = useCookie("user_info");
const userId = computed(() => userinfo2.value?.id || null);

const openMultiWindow = (count) => {
  if (!token.value) {
    showLoginModal.value = true;
    return;
  }
  selectionType.value = count;
  showModelSelectionModal.value = true;
};

const handleModelSelection = (selected) => {
  if (!Array.isArray(selected)) {
    console.error("Invalid selection from modal:", selected);
    selectedModels.value = [];
  } else {
    selectedModels.value = selected;
    // Generate a temporary session ID instead of persisting immediately
    const tempSessionId = `temp_multi_sess_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 5)}`;
    ms_active.value = tempSessionId; // Set active session
    showMultiWindow.value = true; // Show multi-window UI
    console.log("Temporary multi-window chat initialized:", tempSessionId);
    // Do NOT call add_chat or all_message here; wait for first message
  }
  showModelSelectionModal.value = false; // Close modal
};

const enableEdit = (item) => {
  item.isEditing = true;
  item.editedMessage = item.message; // Copy original message to editable field
};

const saveEdit = (item) => {
  item.isEditing = false;
  updateMessage(item); // Call function to save changes
};

const updateMessage = async (item) => {
  try {
    // Ensure token exists
    if (!token.value) {
      Message.error("Please log in to update messages");
      item.isEditing = false; // Exit editing mode
      item.editedMessage = item.message; // Revert changes
      login_dialog_click(); // Prompt login
      return;
    }

    // Prepare the request
    const response = await fetch(`${window.APP_CONFIG.baseUrl}update_message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message_id: item.id,
        message: item.editedMessage.trim(), // Trim to avoid unnecessary whitespace
      }),
    });

    // Check response status
    if (response.ok) {
      const result = await response.json();
      if (result.status === 200) {
        // Update the local message
        item.message = item.editedMessage; // Keep original update
        item.isEditing = false; // Exit editing mode
        Message.success(result.message || "Message updated successfully");

        // Skip check_message if result indicates no new messages
        console.log(
          "Checking if check_message is needed for session:",
          ms_active.value
        );
        if (
          result.m_last &&
          chatHistory.value.some((msg) => msg.m_last === result.m_last)
        ) {
          console.log("Message list up-to-date, skipping check_message");
        } else {
          console.log("Refreshing message list via check_message");
          await check_message(ms_active.value); // Sync with backend
        }
      } else {
        throw new Error(result.message || "Failed to update message");
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
  } catch (error) {
    Message.error(`Error updating message: ${error.message}`);
    item.editedMessage = item.message; // Revert to original message on failure
    item.isEditing = false; // Exit editing mode
  }
};

// const sendToSingleChat = (text) => {
//   if (!text.trim()) return;
//   send_loading.value = true;
//   me_message.value.push({
//     question: text,
//     created_at: new Date(),
//     qs_token: 0,
//   });
//   // Assuming WebSocket or other logic here (not changed)
//   send_loading.value = false;
// };

// Send to multi-window via MultiWindowChat component
const sendToMultiWindow = async (text) => {
  chatModeLocked.value = true;
  if (!text?.trim()) {
    Message.warning("Please enter a message");
    return;
  }
  if (multiWindowRef.value) {
    let sessionId = ms_active.value;
    if (sessionId.startsWith("temp_multi_sess_")) {
      // Persist the multi-window chat with selected models
      const res = await add_chat({
        is_multi: true,
        models: selectedModels.value.map((m) => m.model_key), // Pass selected models
      });
      sessionId = res._rawValue.data;
      ms_active.value = sessionId;
      console.log(
        "New multi-window chat persisted with session ID:",
        sessionId
      );
    }
    multiWindowRef.value.sendMessage(text || ruleForm.message_input, sessionId);
    ruleForm.message_input = "";
    text_imageUrls.value = [];
    // Refresh sidebar after sending the message
    await all_message();
  } else {
    console.error("multiWindowRef is null");
  }
};

const loadChatSession = (sessionId, isMultiWindow, models, windowCount) => {
  console.log("Loading session:", {
    sessionId,
    isMultiWindow,
    models,
    windowCount,
  });
  ms_active.value = sessionId;

  if (isMultiWindow) {
    selectedModels.value = models.map((modelKey) => ({
      model_key: modelKey,
      model_name:
        enabledModels.value.find((m) => m.model_key === modelKey)?.model_name ||
        modelKey,
    }));
    selectionType.value = windowCount;
    showMultiWindow.value = true;

    console.log("Multi-window setup:", {
      selectedModels: selectedModels.value,
      selectionType: selectionType.value,
      showMultiWindow: showMultiWindow.value,
    });

    const loadHistoryWhenReady = () => {
      if (multiWindowRef.value) {
        console.log("Calling loadHistory for:", sessionId);
        multiWindowRef.value.loadHistory(sessionId);
      } else {
        console.error("multiWindowRef not available yet, retrying...");
        setTimeout(loadHistoryWhenReady, 100);
      }
    };

    nextTick(() => loadHistoryWhenReady());
  } else {
    showMultiWindow.value = false;
    check_message(sessionId);
    all_message(); // Refresh sidebar to update title and latest message
  }
};

// const loadChatSession = (sessionId, isMultiWindow, models, windowCount) => {
//   console.log("Loading session:", {
//     sessionId,
//     isMultiWindow,
//     models,
//     windowCount,
//   });
//   ms_active.value = sessionId;

//   if (isMultiWindow) {
//     selectedModels.value = models.map((modelKey) => ({
//       model_key: modelKey,
//       model_name:
//         enabledModels.value.find((m) => m.model_key === modelKey)?.model_name ||
//         modelKey,
//     }));
//     selectionType.value = windowCount;
//     showMultiWindow.value = true;

//     console.log("Multi-window setup:", {
//       selectedModels: selectedModels.value,
//       selectionType: selectionType.value,
//       showMultiWindow: showMultiWindow.value,
//     });

//     // Call loadHistory after multiWindowRef is ready
//     const loadHistoryWhenReady = () => {
//       if (multiWindowRef.value) {
//         console.log("Calling loadHistory for:", sessionId);
//         multiWindowRef.value.loadHistory(sessionId);
//       } else {
//         console.error("multiWindowRef not available yet, retrying...");
//         setTimeout(loadHistoryWhenReady, 100); // Retry after delay
//       }
//     };

//     nextTick(() => loadHistoryWhenReady());
//   } else {
//     showMultiWindow.value = false;
//     check_message(sessionId); // Single chat uses check_message directly
//   }
// };
const formatMultiWindowTitle = (item) => {
  const modelNames = item.models.map(
    (key) =>
      enabledModels.value.find((m) => m.model_key === key)?.model_name || key
  );
  const windowLabel = item.window_count === 2 ? "Dual" : "Quad";
  return `${windowLabel}-Chat: ${modelNames.join(", ")}`;
};

const token = useCookie("token");

const router = useRouter();
const messages = ref([]) as any;
const ms_active = ref(0);
const me_message = ref([]) as any;
const loadins = ref(false);
const send_loading = ref(false);
const data_load = ref(false);
const scene_model = ref([]) as any;
const m_last = ref({}) as any;
const avatar_select = ref(false);
const page = ref(1);
const limit = ref(8);
const ms_count = ref(0);
const left_loding = ref(false);
const answer_num = ref(
  counter.setting.chat_up_limit ? Number(counter.setting.chat_up_limit) : 3
);
const answer_tem = ref(0.8);
const knowledge_list = ref([]);
const now_choose_knowledge = ref([]);
const knowledge_add = ref(false);
const k_page = ref(1);
const k_limit = ref(6);
const public_page = ref(1);
const public_limit = ref(6);
const know_count = ref(0);
const know_loading = ref(false);
const knowledge_public_list = ref([]);
const knowledge_public_count = ref(0);
const knowledge_list_get = () => {
  know_loading.value = true;
  knowledge_list_gets({
    page: k_page.value,
    limit: k_limit.value,
    public_limit: public_limit.value,
    public_page: public_page.value,
  })
    .then((res: any) => {
      know_loading.value = false;
      knowledge_list.value = res._rawValue.data;
      know_count.value = res._rawValue.count;
      knowledge_public_list.value = res._rawValue.data_public;
      knowledge_public_count.value = res._rawValue.count_public;
    })
    .catch((err: any) => {
      know_loading.value = false;
      console.log(err);
    });
};
const handleCurrentChangeKnowledge = (val: any) => {
  k_page.value = val;
  knowledge_list_get();
};

const VoicehandleCurrentChange = (val: any) => {
  voice_page.value = val;
  voice_get_list();
};

const handleCurrentChangeKnowledgePublic = (val: any) => {
  public_page.value = val;
  knowledge_list_get();
};
const add_knowledge = () => {
  knowledge_add.value = true;
  knowledge_list_get();
};
const handlePaymentSuccess = () => {
  console.log("handlePaymentSuccess triggered in ai_chat.vue");
  get_limit(); // Refresh user data, including balance
};
const changeRadio = (ids: any) => {
  now_choose_knowledge.value = [];
  // ids是个数组
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < knowledge_list.value.length; j++) {
      if (knowledge_list.value[j].id == ids[i]) {
        now_choose_knowledge.value.push(knowledge_list.value[j]);
      }
    }
  }
};
const delnow_know = (id: any) => {
  for (let j = 0; j < now_choose_knowledge.value.length; j++) {
    if (now_choose_knowledge.value[j].id == id) {
      now_choose_knowledge.value.splice(j, 1);
    }
  }
  // know_check.value中的id包含也删除
  for (let j = 0; j < know_check.value.length; j++) {
    if (know_check.value[j] == id) {
      know_check.value.splice(j, 1);
    }
  }
};
const add_knowledge_go = () => {
  router.push("/knowledge");
};
const know_check = ref([]);
const exportPdf = async (info: any) => {
  generatePdf({
    content: info,
  }).then((res: any) => {
    const blob = new Blob([res._rawValue], { type: "application/pdf" });
    // 使用FileSaver.js保存文件并提供下载链接
    saveAs(blob, "example.pdf");
  });
};

const exportWord = (info: any) => {
  asBlob(info).then((blob: any) => {
    fileSaver.saveAs(blob, "answer.docx");
  });
};
import { useRoute } from "vue-router";

const route = useRoute();
onMounted(async () => {
  console.log(
    "ai_chat.vue mounted, multiWindowRef:",
    multiWindowRef.value ? "available" : "null"
  );
  try {
    const response = await fetchEnabledModels();
    if (response.success && Array.isArray(response.data)) {
      enabledModels.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch enabled models:", error);
  }

  // Load the active session from cookie
  // if (activeSession.value) {
  //   ms_active.value = String(activeSession.value); // Ensure it's a string
  // }

  const paymentStatus = route.query.payment;
  if (paymentStatus === "succeeded") {
    Message.success("Payment successful!");
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (paymentStatus === "failed") {
    Message.error("Payment failed");
  }
  try {
    const modeResponse = await fetchModelSettingsMode();
    const mode = Array.isArray(modeResponse) ? modeResponse[0] : modeResponse;
    if (mode === "default") {
      showMultiWindow.value = true;
    }

    await nextTick();
    speechInit();

    if (token.value) {
      await add_new_chat();
      await all_message();
      // if (ms_active.value) {
      //   await check_message(ms_active.value);
      // }
    }
  } catch (error) {
    console.error("Failed to fetch mode or initialize speech:", error);
    await nextTick();
    speechInit();
  }
});
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.payment) {
      router.replace({ query: {} });
    }
  }
);
watch(showMultiWindow, (newVal, oldVal) => {
  console.log("showMultiWindow changed:", {
    newVal,
    oldVal,
    caller: new Error().stack.split("\n")[2].trim(),
  });
  nextTick(() => {
    console.log(
      "After showMultiWindow change, multiWindowRef:",
      multiWindowRef.value ? "available" : "null"
    );
  });
});
const speech = ref();
const all_avatar_preset = ref([]);
const get_avatar = () => {
  get_avatar_preset().then((res: any) => {
    all_avatar_preset.value = res._rawValue.data;
  });
};
const send_avatar = () => {
  avatar_select.value = true;
  get_avatar();
};

const change_avatar = (id: number) => {
  c_avatar_session({
    avatar_preset_id: id,
    session_id: ms_active.value,
  }).then((res: any) => {
    avatar_select.value = false;
    Message.success("头像修改成功");
    all_message();
  });
};
const speechInit = () => {
  speech.value = new Speech();
  speech.value.setLanguage("zh-CN");
  speech.value.init().then(() => {});
};
const chat_speak = ref("normal");
const speak_is_audio = ref(false);
const speak = (info: any) => {
  speech.value.cancel();
  speak_is_audio.value = true;
  if (chat_speak.value == "normal") {
    speech.value
      .speak({
        text: info,
        listeners: {
          onend: () => {
            speech.value.cancel();
          },
        },
      })
      .then(() => {
        speak_is_audio.value = false;
        Message.success("语音播放完成");
      });
  } else {
    ChatranscribeAudio(info);
  }
};

const stop_speak = () => {
  speech.value.cancel();
  speak_is_audio.value = false;
};

const toggleSpeak = (info) => {
  speech.value.cancel();
  speak_is_audio.value = true;
  if (chat_speak.value == "normal") {
    speech.value
      .speak({
        text: info,
        listeners: {
          onend: () => {
            speech.value.cancel();
          },
        },
      })
      .then(() => {
        speak_is_audio.value = false;
        Message.success("语音播放完成");
      });
  } else {
    ChatranscribeAudio(info);
  }
};
const refreshAnswer = (qs) => {
  ruleForm.message_input = qs;
  check_sub();
};

const deleteMessage = (id) => {
  console.log("deleteMessage", id);
};

const last_msg = ref(0);
const last_draw = ref(0);

// const all_message = () => {
//   left_loding.value = true;
//   data_load.value = true;
//   get_message({
//     page: page.value,
//     limit: limit.value,
//   })
//     .then((res: any) => {
//       messages.value = res._rawValue.data;
//       m_last.value = res._rawValue.m_last;
//       ms_count.value = res._rawValue.count;
//       max_session.value = res._rawValue.max_session;
//       left_loding.value = false;
//       data_load.value = false;
//     })
//     .catch((err: any) => {
//       data_load.value = false;
//       left_loding.value = false;
//       console.log(err);
//     });
// };

const all_message = () => {
  left_loding.value = true;
  data_load.value = true;
  return get_message({
    page: 1,
    limit: limit.value,
    has_messages: true,
  })
    .then((res) => {
      console.log("Backend response:", res._rawValue);
      messages.value = [...res._rawValue.data];
      console.log("Messages updated:", messages.value);
      m_last.value = res._rawValue.m_last;
      ms_count.value = res._rawValue.count;
      max_session.value = res._rawValue.max_session;
      left_loding.value = false;
      data_load.value = false;
      // if (!ms_active.value && messages.value.length > 0) {
      //   ms_active.value = String(messages.value[0].session_id); // Ensure it's a string
      // }
    })
    .catch((err) => {
      console.error("Error fetching messages:", err);
      left_loding.value = false;
      data_load.value = false;
    });
};

const all_message_sub = () => {
  return new Promise((resolve, reject) => {
    left_loding.value = true;
    data_load.value = true;
    get_message({
      page: page.value,
      limit: limit.value,
    })
      .then((res: any) => {
        messages.value = res._rawValue.data;
        m_last.value = res._rawValue.m_last;
        ms_count.value = res._rawValue.count;
        max_session.value = res._rawValue.max_session;
        left_loding.value = false;
        data_load.value = false;
        resolve(null);
      })
      .catch((err: any) => {
        data_load.value = false;
        left_loding.value = false;
        console.log(err);
        reject(err);
      });
  });
};

const user_info = ref({}) as any;
const vip_level = ref("free");
const save_message_img = (ext: any) => {
  let node = document.querySelector(".all_message_export");
  // 设置node节点overflow:hidden
  if (ext == "PNG") {
    htmlToImage
      .toPng(<HTMLElement>node, {
        cacheBust: false,
        useCorsEverywhereProxy: true,
      })
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "message.png";
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  } else {
    htmlToImage
      .toJpeg(<HTMLElement>node)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "message.jpeg";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }
};
const total_msg = ref(0);
const total_draw = ref(0);
const vip_type = ref("free");
const user_qs = ref(0);
const user_draw = ref(0);
const get_limit = async () => {
  await get_user_limit()
    .then((res: any) => {
      last_msg.value = res._rawValue.last_msg;
      last_draw.value = res._rawValue.last_draw;
      total_msg.value = res._rawValue.total_msg;
      total_draw.value = res._rawValue.total_draw;
      user_info.value = { ...user_info.value, ...res._rawValue.user_info };
      // user_info.value = res._rawValue.user_info;

      vip_level.value = res._rawValue.vip_level;
      vip_type.value = res._rawValue.vip_type;
      user_qs.value = res._rawValue.user_qs;
      user_draw.value = res._rawValue.user_draw;
      console.log("Updated user_info.money:", user_info.value.money);
    })
    .catch((err: any) => {
      console.log(err);
    });
};
const check_vip_type = (type: string) => {
  if (type == "free") {
    return "免费版";
  } else if (type == "day") {
    return "每日";
  } else if (type == "month") {
    return "每月";
  } else if (type == "total") {
    return "有效期内";
  } else {
    return "免费版";
  }
};
const quit_out = () => {
  token.value = "";

  router.go(0);
};
if (token.value) {
  all_message();
  get_limit();
  knowledge_list_get();
}

const max_session = ref(0);
const s_page = ref(1);
const s_limit = ref(4);
const change_status = ref(true);
const model_list = ref([]) as any;
const model_is_select = ref();
const scene_p_model = ref([]);

const chat_bg_cookie = useCookie("chat_bg");
const bg_change = (bg: any) => {
  chat_bg_cookie.value = bg;
};
const remove_bg = () => {
  chat_bg_cookie.value = "";
};

const chat_bg = ref([]);
const big_model_list = ref([]);
const scene_all = () => {
  get_scene_f({
    page: s_page.value,
    limit: s_limit.value,
  })
    .then((res: any) => {
      scene_model.value = res._rawValue.data;
      scene_p_model.value = res._rawValue.p_data;
      scene_count.value = res._rawValue.count;
      model_list.value = res._rawValue.model;
      chat_bg.value = res._rawValue.chat_bg;
      big_model_list.value = res._rawValue.model;
      model_list.value = res._rawValue.model[0].small_model;
      if (model_list.value.length > 0) {
        model_is_select.value = model_list.value[0].model;
        now_model_title.value = model_list.value[0].title;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
scene_all();

const big_model_change = (val: any) => {
  model_list.value = [];
  for (let i = 0; i < big_model_list.value.length; i++) {
    if (big_model_list.value[i].type == val) {
      model_list.value = big_model_list.value[i].small_model;
      model_is_select.value = model_list.value[0]?.model;
      now_model_title.value = model_list.value[0]?.title;
    }
  }
};

const small_model_change = (val: any) => {
  for (let i = 0; i < model_list.value.length; i++) {
    if (model_list.value[i].model == val) {
      now_model_title.value = model_list.value[i].title;
      model_is_select.value = model_list.value[i].model;
    }
  }
  if (ms_active.value != 0) {
    updata_model_message({
      session_id: ms_active.value,
      model: model_is_select.value,
    })
      .then((res: any) => {
        Message.success("模型切换成功");
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};

const handleCurrentChange = (val: number) => {
  left_loding.value = true;
  if (qs_input.value) {
    searchs({
      search: qs_input.value,
      page: val,
      limit: limit.value,
    })
      .then((res: any) => {
        page.value = val;
        messages.value = res._rawValue.data;
        ms_count.value = res._rawValue.count;
        left_loding.value = false;
        Message.success("搜索完成");
      })
      .catch((err: any) => {
        Message.error(err.message);
        left_loding.value = false;
      });
  } else {
    get_message({
      page: val,
      limit: limit,
    })
      .then((res: any) => {
        page.value = val;
        messages.value = res._rawValue.data;
        ms_count.value = res._rawValue.count;
        left_loding.value = false;
      })
      .catch((err: any) => {
        left_loding.value = false;
        console.log(err);
      });
  }
};

const delete_this = (id: number) => {
  delete_message({
    id: id,
  })
    .then((res: any) => {
      Message.success("删除成功");
      if (me_message.value.length == 1) {
        ms_active.value = 0;
        check_message(ms_active.value);
        all_message();
      } else {
        check_message(ms_active.value);
        all_message();
      }
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
};
const know_tab = ref("me");
const scene_loading = ref(false);
const handleCurrentChangeScene = (val: number) => {
  scene_loading.value = true;
  if (change_status.value) {
    if (scene_search.value) {
      s_page.value = val;
      scene_searchs({
        search: scene_search.value,
        page: val,
        limit: s_limit.value,
      })
        .then((res: any) => {
          s_page.value = val;
          scene_model.value = res._rawValue.data;
          scene_count.value = res._rawValue.count;
          Message.success("搜索完成");
          scene_loading.value = false;
        })
        .catch((err: any) => {
          Message.error(err.message);
          scene_loading.value = false;
        });
    } else {
      get_scene_f({
        page: val,
        limit: s_limit.value,
      })
        .then((res: any) => {
          s_page.value = val;
          scene_model.value = res._rawValue.data;
          scene_count.value = res._rawValue.count;
          scene_loading.value = false;
        })
        .catch((err: any) => {
          console.log(err);
          scene_loading.value = false;
        });
    }
    change_status.value = true;
  }
};

const handleSizeChange = (val: number) => {
  limit.value = val;
  left_loding.value = true;
  get_message({
    page: page.value,
    limit: val,
  })
    .then((res: any) => {
      messages.value = res._rawValue.data;
      ms_count.value = res._rawValue.count;
      left_loding.value = false;
    })
    .catch((err: any) => {
      left_loding.value = false;
      console.log(err);
    });
};

// const check_message = (id) => {
//   ms_active.value = String(id); // Ensure it's a string
//   return new Promise((resolve, reject) => {
//     loadins.value = true;
//     c_message({ session_id: id })
//       .then((res) => {
//         if (res._rawValue.data.some((msg) => msg.is_multi)) {
//           const models = [
//             ...new Set(res._rawValue.data.map((msg) => msg.model)),
//           ];
//           selectedModels.value = models.map((modelKey) => ({
//             model_key: modelKey,
//             model_name:
//               enabledModels.value.find((m) => m.model_key === modelKey)
//                 ?.model_name || modelKey,
//           }));
//           showMultiWindow.value = true;
//           selectionType.value = models.length;
//           nextTick(() => {
//             multiWindowRef.value.loadHistory(id);
//             loadins.value = false;
//             down_message();
//             resolve(null);
//           });
//         } else {
//           me_message.value = res._rawValue.data.map((msg) => {
//             const fullMessage = msg.message || "";
//             let textSegments = [];
//             let codeSegments = [];
//             let codeBlocks = [];
//             let lastIndex = 0;

//             const codeBlockRegex = /```[\s\S]*?```/g;
//             let match;
//             while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
//               const start = match.index;
//               const end = codeBlockRegex.lastIndex;
//               const codeContent = match[0].replace(/^```|```$/g, "").trim();
//               codeBlocks.push({
//                 start,
//                 end,
//                 content: codeContent,
//                 textBefore: fullMessage.slice(lastIndex, start),
//               });
//               lastIndex = end;
//             }

//             if (codeBlocks.length === 0) {
//               codeBlocks.push({
//                 start: 0,
//                 end: fullMessage.length,
//                 content: fullMessage,
//                 textBefore: "",
//                 isPlainText: true,
//               });
//             } else {
//               if (lastIndex < fullMessage.length) {
//                 codeBlocks.push({
//                   start: lastIndex,
//                   end: fullMessage.length,
//                   content: fullMessage.slice(lastIndex),
//                   textBefore: "",
//                   isPlainText: true,
//                 });
//               }
//             }

//             codeBlocks.forEach((block) => {
//               if (block.isPlainText) {
//                 textSegments.push(block.content);
//                 codeSegments.push("");
//               } else {
//                 textSegments.push(block.textBefore);
//                 codeSegments.push(block.content);
//               }
//             });

//             return {
//               ...msg,
//               isThinking: false,
//               isComplete: true,
//               textSegments,
//               codeSegments,
//               fullMessage: msg.message,
//             };
//           });

//           loadins.value = false;
//           down_message();
//           resolve(null);
//         }
//       })
//       .catch((err) => {
//         loadins.value = false;
//         reject(err);
//       });
//   });
// };
// const check_message = async (sessionId) => {
//   const requestId = Math.random().toString(36).substring(2);
//   console.log(`Checking messages for session: ${sessionId}, request ID: ${requestId}`);
//   const response = await fetch(`${window.APP_CONFIG.baseUrl}check_message`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token.value}`,
//       "Content-Type": "application/json",
//     },
//   });
//   const result = await response.json();
//   console.log(`Response for request ${requestId}:`, result);
//   if (result.status === 200) {
//     return result;
//   }
//   throw new Error(result.message || "Failed to fetch messages");
// };
const check_message = (id: string) => {
  ms_active.value = id;
  return new Promise((resolve, reject) => {
    loadins.value = true;
    c_message({ session_id: id })
      .then((res) => {
        console.log("Messages fetched:", res._rawValue.data);
        if (res._rawValue.data.some((msg) => msg.is_multi)) {
          const models = [
            ...new Set(res._rawValue.data.map((msg) => msg.model)),
          ];
          selectedModels.value = models.map((modelKey) => ({
            model_key: modelKey,
            model_name:
              enabledModels.value.find((m) => m.model_key === modelKey)
                ?.model_name || modelKey,
          }));
          showMultiWindow.value = true;
          nextTick(() => {
            multiWindowRef.value.loadHistory(id);
            loadins.value = false;
            down_message();
            resolve(null);
          });
        } else {
          const messageMap = new Map();
          res._rawValue.data.forEach((msg) => {
            const fullMessage = msg.message || "";
            let textSegments = [];
            let codeSegments = [];
            let lastIndex = 0;

            const codeBlockRegex = /```[\s\S]*?```/g;
            let match;
            while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
              const start = match.index;
              const end = codeBlockRegex.lastIndex;
              const codeContent = match[0].replace(/^```|```$/g, "").trim();
              textSegments.push(fullMessage.slice(lastIndex, start));
              codeSegments.push(codeContent);
              lastIndex = end;
            }
            if (lastIndex < fullMessage.length) {
              textSegments.push(fullMessage.slice(lastIndex));
              codeSegments.push("");
            } else if (textSegments.length === 0) {
              textSegments.push(fullMessage);
              codeSegments.push("");
            }

            messageMap.set(msg.id, {
              ...msg,
              isThinking: false,
              isComplete: true,
              textSegments,
              codeSegments,
              fullMessage: msg.message,
            });
          });

          me_message.value = Array.from(messageMap.values());
          console.log("me_message set to:", me_message.value);
          loadins.value = false;
          down_message();
          resolve(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        loadins.value = false;
        reject(err);
      });
  });
};

const showUploadButton = ref(true); // Persistent state for upload button visibility

const copyCode = (code: string) => {
  if (!code) {
    Message.error("No code to copy");
    return;
  }

  // Create a temporary textarea to copy the code to the clipboard
  const textarea = document.createElement("textarea");
  textarea.value = code;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      Message.success("Code copied successfully");
    } else {
      Message.error("Failed to copy code");
    }
  } catch (err) {
    Message.error("Failed to copy code: " + err.message);
  } finally {
    document.body.removeChild(textarea);
  }
};

// In check_messages, ensure the button remains visible
const check_messages = (id: number, append = false) => {
  return new Promise((resolve, reject) => {
    ms_active.value = id;
    c_message({
      session_id: id,
    })
      .then((res: any) => {
        const serverMessages = res._rawValue.data;
        // Skip update if m_last is unchanged
        if (
          res._rawValue.m_last &&
          res._rawValue.m_last === lastMessageId.value
        ) {
          console.log("Messages up-to-date, skipping update for session:", id);
          resolve(null);
          return;
        }
        lastMessageId.value = res._rawValue.m_last;

        // Update messages in a single operation
        if (append) {
          const existingIds = new Set(me_message.value.map((m) => m.id));
          const newMessages = serverMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          me_message.value = [...me_message.value, ...newMessages];
        } else {
          me_message.value = [...serverMessages];
        }

        // Update model-related state
        if (me_message.value.length > 0 && me_message.value[0].model) {
          for (let i = 0; i < big_model_list.value.length; i++) {
            for (
              let j = 0;
              j < big_model_list.value[i].small_model.length;
              j++
            ) {
              if (
                big_model_list.value[i].small_model[j].model ===
                me_message.value[me_message.value.length - 1].model
              ) {
                model_list.value = big_model_list.value[i].small_model;
              }
            }
          }
          model_big_choose.value =
            me_message.value[me_message.value.length - 1].type;
          model_is_select.value =
            me_message.value[me_message.value.length - 1].model;
          now_model_title.value = model_list.value.filter(
            (item: any) =>
              item.model === me_message.value[me_message.value.length - 1].model
          )[0].title;
        }
        console.log("model_changes");
        showUploadButton.value = is_can_upload(model_is_select.value);
        down_message();
        resolve(null);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const add_loading = ref(true);

// const add_new_chat = async () => {
//   showMultiWindow.value = false;
//   selectedModels.value = [];
//   hasMessageBeenSent.value = false;
//   try {
//     const tempSessionId = `temp_sess_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 5)}`;
//     ms_active.value = tempSessionId;
//     me_message.value = [];
//     showMultiWindow.value = false;
//     selectedModels.value = [];
//     chatModeLocked.value = false;
//     ruleForm.message_input = "";
//     text_imageUrls.value = [];

//     console.log("New temporary chat created with session ID:", tempSessionId);
//     // Do not call all_message() here; let submitForm handle session creation
//   } catch (err) {
//     Message.error(err.message);
//   }
// };

//   try {
//     const tempSessionId = `temp_sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
//     ms_active.value = tempSessionId;
//     me_message.value = [];
//     showMultiWindow.value = false;
//     selectedModels.value = [];
//     chatModeLocked.value = false;
//     ruleForm.message_input = "";
//     text_imageUrls.value = [];

//     await all_message(); // Refresh sidebar to show new session

//     console.log("New temporary chat created with session ID:", tempSessionId);
//   } catch (err) {
//     Message.error(err.message);
//   }
// };

//before empty bug
// const add_new_chat = async () => {
//   try {
//     // Generate a temporary session ID client-side, not persisted yet
//     const tempSessionId = `temp_sess_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 5)}`;
//     ms_active.value = tempSessionId; // Set as active session
//     me_message.value = []; // Clear messages for new chat
//     showMultiWindow.value = false; // Ensure single chat mode
//     selectedModels.value = []; // Reset multi-window models
//     chatModeLocked.value = false; // Unlock mode
//     ruleForm.message_input = ""; // Clear input
//     text_imageUrls.value = []; // Clear uploaded images

//     console.log("New temporary chat created with session ID:", tempSessionId);
//     // Do NOT call all_message() or add_chat here; wait for the first message
//   } catch (err) {
//     Message.error(err.message);
//   }
// };
// const add_new_chat = () => {
//   add_chat()
//     .then((res: any) => {
//       all_message();
//       model_list.value = find_big_model(model_is_select.value);
//       check_message(res._rawValue.data);

//       showMultiWindow.value = false;
//       selectedModels.value = [];
//       chatModeLocked.value = false; // Unlock mode for new chat
//       ruleForm.message_input = "";
//       text_imageUrls.value = [];
//       console.log("New chat started. Mode selection is now available.");
//     })
//     .catch((err: any) => {
//       Message.error(err.message);
//     });
// };

//函数 根据小模型找到大模型 并且返回大模型下的small_model数组

const add_new_chat = async () => {
  showMultiWindow.value = false;
  selectedModels.value = [];
  hasMessageBeenSent.value = false;
  try {
    console.log("calling backend to add new session");
    const response = await fetch(
      `https://abdul.synthetixor.com/api/get-new-session-id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${useCookie("token")?.value}`,
        },
      }
    );

    // console.log("this is session_data ", await response);
    if (!response.ok) throw new Error("Failed to get new session ID");
    const data = await response.json();
    const newSessionId = data.session_id;
    console.log("new seesio_chat ", newSessionId);

    ms_active.value = newSessionId;
    me_message.value = [];
    showMultiWindow.value = false;
    selectedModels.value = [];
    chatModeLocked.value = false;
    ruleForm.message_input = "";
    text_imageUrls.value = [];

    console.log("New chat created with session ID:", newSessionId);
  } catch (err) {
    Message.error("Error creating new chat: " + err.message);
  }
};
const find_big_model = (val: any) => {
  for (let i = 0; i < big_model_list.value.length; i++) {
    for (let j = 0; j < big_model_list.value[i].small_model.length; j++) {
      if (big_model_list.value[i].small_model[j].model == val) {
        model_big_choose.value = big_model_list.value[i].type;
        return big_model_list.value[i].small_model;
      }
    }
  }
};

const normal_message = ref([]);
const normal_loading = ref(true);
const get_normal_tips = () => {
  get_normal()
    .then((res: any) => {
      normal_message.value = res._rawValue.data;
      normal_loading.value = false;
    })
    .catch((err: any) => {
      console.log(err);
    });
};
get_normal_tips();

const items = [
  {
    key: "key",
    label: "基础配置",
  },
  {
    key: "scene",
    label: "场景配置",
  },
];

const is_read = useCookie("is_read", { maxAge: 60 * 60 * 24 });

const notice = ref(
  is_read.value == "on" || counter.setting.notice_open != "1" ? false : true
);
const save_notice = () => {
  notice.value = false;
  is_read.value = "on";
};

const down_message = () => {
  setTimeout(() => {
    let chat = document.getElementsByClassName("chat-content")[0];
    chat.style.transition = "1500ms"; // 过渡时间为0.5秒
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
  }, 100);
};

// 发送消息
const ruleForm = reactive({
  message_input: "",
});

const rules = reactive<FormRules>({
  message_input: [{ required: true, message: "请输入内容", trigger: "blur" }],
});

const {
  public: { baseUrl },
} = useRuntimeConfig();

const headers = {
  Authorization: `Bearer ${token.value}`,
  Accept: "text/event-stream",
};
const is_done = ref(true);
const streams = ref();
const up_stop = ref("start");
const formRef = ref();
const isInvalidJSON = (data: string) => {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
};
const stop_stream = () => {
  up_stop.value = "end";
  is_done.value = true;
  send_loading.value = false;
  ruleForm.message_input = "";
};

const refresh_answer = (qs: any) => {
  ruleForm.message_input = qs;
  check_sub();
};
const contentString = ref("");
const activeSession = useCookie("active_session");

//   if (!ruleForm.message_input.trim() && !text_imageUrls.value.length) {
//     Message.warning("Please enter content or upload images");
//     return false;
//   }
//   if (send_loading.value) {
//     Message.warning("Please wait for the previous message to send");
//     return false;
//   }
//   if (!token.value) {
//     Message.warning("Please log in first");
//     login_dialog_click();
//     return false;
//   }

//   // Create and add the new message
//   const newMessage = {
//     session_id: ms_active.value,
//     question: ruleForm.message_input || "",
//     images: [...text_imageUrls.value],
//     message: "",
//     isThinking: true,
//     isComplete: false,
//     fullMessage: "",
//     created_at: new Date().toISOString(),
//     qs_token: 0,
//     answer_token: 0,
//     id: null,
//     textSegments: [],
//     codeSegments: [],
//   };
//   me_message.value.push(newMessage);
//   down_message();

//   const requestBody = {
//         info: newMessage.question,
//         session_id: ms_active.value,
//         scene_preset: SceneForm.domains,
//         model_is_select: model_is_select.value,
//         answer_num: answer_num.value,
//         answer_tem: answer_tem.value,
//         now_choose_knowledge: know_check.value,
//         plugins_select: plugins_select.value,
//         text_imageUrls: newMessage.images,
//         deep_thinking: deep_thinking.value,
//     };
//     console.log("Sending request to send_bot:", JSON.stringify(requestBody, null, 2));

//   // Immediately clear the input field and images
//   ruleForm.message_input = "";
//   text_imageUrls.value = [];

//   // Handle session persistence
//   let sessionId = ms_active.value;
//   if (typeof sessionId !== "string" || sessionId.startsWith("temp_sess_")) {
//     const res = await add_chat({ is_multi: false });
//     sessionId = res._rawValue.data;
//     ms_active.value = sessionId;
//     activeSession.value = sessionId;
//     newMessage.session_id = sessionId; // Update message session ID
//     console.log("New single chat persisted with session ID:", sessionId);
//   }

//   // Send the message
//   send_loading.value = true;
//   try {
//     const res = await fetch(`${window.APP_CONFIG.baseUrl}send_bot`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         info: newMessage.question,
//         session_id: sessionId,
//         scene_preset: SceneForm.domains,
//         model_is_select: model_is_select.value,
//         answer_num: answer_num.value,
//         answer_tem: answer_tem.value,
//         now_choose_knowledge: know_check.value,
//         plugins_select: plugins_select.value,
//         text_imageUrls: newMessage.images,
//         deep_thinking: deep_thinking.value,
//       }),
//     });

//     const responseData = await res.json();
//     console.log("send_bot response:", responseData);
//     if (res.status === 202) {
//       newMessage.id = responseData.message_id;
//       ms_active.value = responseData.session_id;
//       activeSession.value = responseData.session_id;
//       pollForResponse(newMessage.id);
//       await all_message();
//     } else {
//       newMessage.isThinking = false;
//       newMessage.message = responseData.message || "Error occurred";
//       Message.error(responseData.message || "Request failed");
//     }
//   } catch (error) {
//     console.error("Error submitting message:", error);
//     newMessage.isThinking = false;
//     newMessage.message = "Failed to process request";
//     Message.error("Failed to send message: " + error.message);
//   } finally {
//     send_loading.value = false; // Reset loading after API call
//   }
// };

// const submitForm = async () => {
//   // Validate input and plugins
//   if (!ruleForm.message_input.trim() && !text_imageUrls.value.length) {
//     Message.warning("Please enter content or upload images");
//     return false;
//   }
//   if (text_imageUrls.value.length && plugins_select.value !== "image_read") {
//     // Automatically set plugins_select if images are present
//     plugins_select.value = "image_read";
//     model_is_select.value = "gpt-4o-2024-05-13";
//     console.log("Auto-corrected plugins_select to image_read due to image upload");
//   }
//   if (plugins_select.value === "image_read" && !text_imageUrls.value.length) {
//     Message.warning("Please upload at least one image for image recognition");
//     return false;
//   }
//   if (send_loading.value) {
//     Message.warning("Please wait for the previous message to send");
//     return false;
//   }
//   if (!token.value) {
//     Message.warning("Please log in first");
//     login_dialog_click();
//     return false;
//   }

//   const newMessage = {
//     session_id: ms_active.value,
//     question: ruleForm.message_input || "Describe these images.",
//     images: [...text_imageUrls.value],
//     message: "",
//     isThinking: true,
//     isComplete: false,
//     fullMessage: "",
//     created_at: new Date().toISOString(),
//     qs_token: 0,
//     answer_token: 0,
//     id: null,
//     textSegments: [],
//     codeSegments: [],
//   };
//   me_message.value.push(newMessage);
//   down_message();

//   // Log request body for debugging
//   const requestBody = {
//     info: newMessage.question,
//     session_id: ms_active.value,
//     scene_preset: SceneForm.domains,
//     model_is_select: model_is_select.value,
//     answer_num: answer_num.value,
//     answer_tem: answer_tem.value,
//     now_choose_knowledge: know_check.value,
//     plugins_select: plugins_select.value,
//     text_imageUrls: newMessage.images,
//     deep_thinking: deep_thinking.value,
//   };
//   console.log("Sending request to send_bot:", JSON.stringify(requestBody, null, 2));

//   ruleForm.message_input = "";
//   text_imageUrls.value = [];

//   let sessionId = ms_active.value;
//   if (typeof sessionId !== "string" || sessionId.startsWith("temp_sess_")) {
//     const res = await add_chat({ is_multi: false });
//     sessionId = res._rawValue.data;
//     ms_active.value = sessionId;
//     activeSession.value = sessionId;
//     newMessage.session_id = sessionId;
//     console.log("New single chat persisted with session ID:", sessionId);

//     // Add new session to messages.value immediately
//     messages.value.unshift({
//       session_id: sessionId,
//       message_b: newMessage.question,
//       question: newMessage.question,
//       message: "",
//     });
//   } else {
//     // Update existing session with the new question
//     const sessionIndex = messages.value.findIndex(m => m.session_id === ms_active.value);
//     if (sessionIndex !== -1) {
//       messages.value[sessionIndex].question = newMessage.question;
//     }
//   }

//   // Show loading briefly and initiate the request
//   send_loading.value = true;
//   fetch(`${window.APP_CONFIG.baseUrl}send_bot`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token.value}`,
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(requestBody),
//   })
//     .then(async (res) => {
//       const responseData = await res.json();
//       console.log("send_bot response:", responseData);
//       if (res.status === 202) {
//         newMessage.id = responseData.message_id;
//         ms_active.value = responseData.session_id;
//         activeSession.value = responseData.session_id;
//         pollForResponse(newMessage.id);
//       } else {
//         newMessage.isThinking = false;
//         newMessage.message = responseData.message || "Error occurred";
//         Message.error(responseData.message || "Request failed");
//       }
//     })
//     .catch((error) => {
//       newMessage.isThinking = false;
//       newMessage.message = "Failed to process request";
//       Message.error("Failed to send message: " + error.message);
//     });

//   // Hide loading sign immediately after initiating the request
//   send_loading.value = false;
// };

const submitForm = async () => {
  if (!ruleForm.message_input.trim() && !text_imageUrls.value.length) {
    Message.warning("Please enter content or upload images");
    return false;
  }
  if (text_imageUrls.value.length && plugins_select.value !== "image_read") {
    plugins_select.value = "image_read";
    model_is_select.value = "gpt-4o-2024-05-13";
    console.log(
      "Auto-corrected plugins_select to image_read due to image upload"
    );
  }
  if (plugins_select.value === "image_read" && !text_imageUrls.value.length) {
    Message.warning("Please upload at least one image for image recognition");
    return false;
  }
  if (send_loading.value) {
    Message.warning("Please wait for the previous message to send");
    return false;
  }
  if (!token.value) {
    Message.warning("Please log in first");
    login_dialog_click();
    return false;
  }

  const newMessage = {
    session_id: ms_active.value,
    question: ruleForm.message_input || "Describe these images.",
    images: [...text_imageUrls.value],
    message: "",
    isThinking: true,
    isComplete: false,
    fullMessage: "",
    created_at: new Date().toISOString(),
    qs_token: 0,
    answer_token: 0,
    id: null,
    textSegments: [],
    codeSegments: [],
  };
  me_message.value.push(newMessage);
  down_message();

  ruleForm.message_input = "";
  text_imageUrls.value = [];

  const requestBody = {
    info: newMessage.question,
    session_id: ms_active.value,
    scene_preset: SceneForm.domains,
    model_is_select: model_is_select.value,
    answer_num: answer_num.value,
    answer_tem: answer_tem.value,
    now_choose_knowledge: know_check.value,
    plugins_select: plugins_select.value,
    text_imageUrls: newMessage.images,
    deep_thinking: deep_thinking.value,
  };
  console.log(
    "Sending request to send_bot:",
    JSON.stringify(requestBody, null, 2)
  );

  let sessionId = ms_active.value;
  let isNewSession =
    typeof sessionId === "string" && sessionId.startsWith("temp_sess_");

  if (isNewSession) {
    requestBody.session_id = null; // Let backend assign the session ID
  }

  send_loading.value = true;
  try {
    const responseData = await $fetch(`${window.APP_CONFIG.baseUrl}send_bot`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: requestBody,
    });
    console.log("send_bot response:", responseData);

    send_loading.value = false;
    if (responseData.status === 202) {
      newMessage.id = responseData.message_id;
      sessionId = responseData.session_id;
      ms_active.value = sessionId;
      activeSession.value = sessionId;
      newMessage.session_id = sessionId;

      // Update or add session to messages.value with reactive trigger
      const sessionIndex = messages.value.findIndex(
        (m) => m.session_id === sessionId
      );
      if (sessionIndex !== -1) {
        // Update existing session
        messages.value[sessionIndex] = {
          ...messages.value[sessionIndex],
          message_b: newMessage.question,
          question: newMessage.question,
          created_at: new Date().toISOString(),
        };
      } else {
        // Add new session and force reactivity
        messages.value = [
          {
            session_id: sessionId,
            message_b: newMessage.question,
            question: newMessage.question,
            message: "",
            created_at: new Date().toISOString(),
            is_multi_window: false,
            models: [model_is_select.value],
            window_count: 1,
          },
          ...messages.value,
        ];
      }

      pollForResponse(newMessage.id);
    } else {
      newMessage.isThinking = false;
      const typedRespons = responseData as { message?: string };
      newMessage.message = typedRespons.message || "Error occurred";
      Message.error(responseData.message || "Request failed");
    }
  } catch (error) {
    newMessage.isThinking = false;
    newMessage.message = "Failed to process request";
    Message.error("Failed to send message: " + error.message);
  } finally {
    send_loading.value = false;
    ruleForm.message_input = "";
    text_imageUrls.value = [];
    plugins_select.value = false;
  }
};

// const submitForm = async () => {
//   if (!ruleForm.message_input.trim() && !text_imageUrls.value.length) {
//     Message.warning("Please enter content or upload images");
//     return false;
//   }
//   if (text_imageUrls.value.length && plugins_select.value !== "image_read") {
//     plugins_select.value = "image_read";
//     model_is_select.value = "gpt-4o-2024-05-13";
//     console.log(
//       "Auto-corrected plugins_select to image_read due to image upload"
//     );
//   }
//   if (plugins_select.value === "image_read" && !text_imageUrls.value.length) {
//     Message.warning("Please upload at least one image for image recognition");
//     return false;
//   }
//   if (send_loading.value) {
//     Message.warning("Please wait for the previous message to send");
//     return false;
//   }
//   if (!token.value) {
//     Message.warning("Please log in first");
//     login_dialog_click();
//     return false;
//   }

//   const newMessage = {
//     session_id: ms_active.value,
//     question: ruleForm.message_input || "Describe these images.",
//     images: [...text_imageUrls.value],
//     message: "",
//     isThinking: true,
//     isComplete: false,
//     fullMessage: "",
//     created_at: new Date().toISOString(),
//     qs_token: 0,
//     answer_token: 0,
//     id: null,
//     textSegments: [],
//     codeSegments: [],
//   };
//   me_message.value.push(newMessage);
//   down_message();

//   ruleForm.message_input = "";
//   text_imageUrls.value = [];

//   const requestBody = {
//     info: newMessage.question,
//     session_id: ms_active.value,
//     scene_preset: SceneForm.domains,
//     model_is_select: model_is_select.value,
//     answer_num: answer_num.value,
//     answer_tem: answer_tem.value,
//     now_choose_knowledge: know_check.value,
//     plugins_select: plugins_select.value,
//     text_imageUrls: newMessage.images,
//     deep_thinking: deep_thinking.value,
//   };
//   console.log(
//     "Sending request to send_bot:",
//     JSON.stringify(requestBody, null, 2)
//   );

//   let sessionId = ms_active.value;
//   let isNewSession =
//     typeof sessionId === "string" && sessionId.startsWith("temp_sess_");

//   if (isNewSession) {
//     // For new sessions, we'll let send_bot assign the integer session ID
//     requestBody.session_id = null; // Let backend assign the session ID
//   }

//   send_loading.value = true;
//   try {
//     const responseData = await $fetch(`${window.APP_CONFIG.baseUrl}send_bot`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: requestBody,
//     });
//     console.log("send_bot response:", responseData);

//     send_loading.value = false;
//     if (responseData.status === 202) {
//       newMessage.id = responseData.message_id;
//       sessionId = responseData.session_id;
//       ms_active.value = sessionId;
//       activeSession.value = sessionId;
//       newMessage.session_id = sessionId;

//       // Update or add session to messages.value
//       const sessionIndex = messages.value.findIndex(
//         (m) => m.session_id === sessionId
//       );
//       if (sessionIndex !== -1) {
//         // Update existing session
//         if (!messages.value[sessionIndex].message_b) {
//           messages.value[sessionIndex].message_b = newMessage.question;
//           messages.value[sessionIndex].question = newMessage.question;
//         }
//         messages.value[sessionIndex].created_at = new Date().toISOString();
//       } else {
//         // Add new session
//         messages.value.unshift({
//           session_id: sessionId,
//           message_b: newMessage.question,
//           question: newMessage.question,
//           message: "",
//           created_at: new Date().toISOString(),
//           is_multi_window: false,
//           models: [model_is_select.value],
//           window_count: 1,
//         });
//       }

//       pollForResponse(newMessage.id);
//     } else {
//       newMessage.isThinking = false;
//       const typedRespons = responseData as { message?: string };
//       newMessage.message = typedRespons.message || "Error occurred";
//       Message.error(responseData.message || "Request failed");
//     }
//   } catch (error) {
//     newMessage.isThinking = false;
//     newMessage.message = "Failed to process request";
//     Message.error("Failed to send message: " + error.message);
//   } finally {
//     send_loading.value = false;
//     ruleForm.message_input = "";
//     text_imageUrls.value = [];
//     plugins_select.value = false;
//   }
// };
// Updated pollForResponse with Typewriter Effect
// const pollForResponse = (messageId) => {
//   const checkResponse = async () => {
//     try {
//       const res = await fetch(
//         `${window.APP_CONFIG.baseUrl}check_message_status/${messageId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token.value}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       const data = await res.json();
//       if (res.status === 200 && data.status === 200) {
//         const messageIndex = me_message.value.findIndex(
//           (m) => m.id === messageId
//         );
//         if (messageIndex !== -1) {
//           if (data.message.status === "completed") {
//             me_message.value[messageIndex].isThinking = false;
//             me_message.value[messageIndex].fullMessage = data.message.message;
//             me_message.value[messageIndex].thinkProcess =
//               data.message.think_content || "";
//             me_message.value[messageIndex].qs_token =
//               data.message.qs_token || 0;
//             me_message.value[messageIndex].answer_token =
//               data.message.answer_token || 0;
//             typewriterEffect(messageIndex);
//             send_loading.value = false;
//             ruleForm.message_input = "";
//             text_imageUrls.value = [];
//             get_limit();
//             clearInterval(pollingInterval);
//           } else if (data.message.status === "failed") {
//             me_message.value[messageIndex].isThinking = false;
//             me_message.value[messageIndex].message = "Processing failed";
//             send_loading.value = false;
//             clearInterval(pollingInterval);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Polling error:", error);
//     }
//   };

//   const pollingInterval = setInterval(checkResponse, 200);
// };

// const typewriterEffect = (index: number) => {
//   const fullMessage = me_message.value[index].fullMessage;
//   const thinkProcess = me_message.value[index].thinkProcess || "";
//   if (me_message.value[index].isTyping) return;
//   me_message.value[index].isTyping = true;

//   me_message.value[index].isCode = false;
//   me_message.value[index].codeSegments = [];
//   me_message.value[index].textSegments = [];

//   const codeBlockRegex = /```[\s\S]*?```/g;
//   let codeBlocks = [];
//   let lastIndex = 0;
//   let match;

//   while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
//     const start = match.index;
//     const end = codeBlockRegex.lastIndex;
//     const codeContent = match[0].replace(/^```|```$/g, "").trim();
//     codeBlocks.push({
//       start,
//       end,
//       content: codeContent,
//       textBefore: fullMessage.slice(lastIndex, start),
//     });
//     lastIndex = end;
//   }

//   if (codeBlocks.length === 0) {
//     codeBlocks.push({
//       start: 0,
//       end: fullMessage.length,
//       content: fullMessage,
//       textBefore: "",
//       isPlainText: true,
//     });
//   } else if (lastIndex < fullMessage.length) {
//     codeBlocks.push({
//       start: lastIndex,
//       end: fullMessage.length,
//       content: fullMessage.slice(lastIndex),
//       textBefore: "",
//       isPlainText: true,
//     });
//   }

//   let currentSegment = 0;
//   const typeNextSegment = () => {
//     if (currentSegment >= codeBlocks.length + (thinkProcess ? 1 : 0)) {
//       me_message.value[index].isComplete = true;
//       me_message.value[index].isTyping = false;
//       down_message();
//       return;
//     }

//     if (currentSegment === codeBlocks.length && thinkProcess) {
//       me_message.value[index].textSegments.push(thinkProcess);
//       me_message.value[index].codeSegments.push("");
//       currentSegment++;
//       setTimeout(typeNextSegment, 0);
//     } else {
//       const segment = codeBlocks[currentSegment];
//       const isCodeBlock = !segment.isPlainText;
//       me_message.value[index].isCode = isCodeBlock;

//       if (isCodeBlock) {
//         me_message.value[index].codeSegments[currentSegment] = segment.content;
//         me_message.value[index].textSegments[currentSegment] =
//           segment.textBefore;
//         currentSegment++;
//         setTimeout(typeNextSegment, 0);
//       } else {
//         const words = segment.content.split(" ");
//         let wordIndex = 0;
//         me_message.value[index].textSegments[currentSegment] =
//           segment.textBefore;
//         me_message.value[index].codeSegments[currentSegment] = "";

//         const typeWord = () => {
//           if (wordIndex < words.length) {
//             const currentText =
//               me_message.value[index].textSegments[currentSegment];
//             me_message.value[index].textSegments[currentSegment] =
//               currentText + (currentText ? " " : "") + words[wordIndex];
//             me_message.value[index].message =
//               me_message.value[index].textSegments[currentSegment];
//             wordIndex++;
//             setTimeout(typeWord, 100);
//           } else {
//             currentSegment++;
//             typeNextSegment();
//           }
//         };
//         typeWord();
//       }
//     }
//   };

//   typeNextSegment();
// };

const pollForResponse = (messageId) => {
  const checkResponse = async () => {
    try {
      const res = await fetch(
        `${window.APP_CONFIG.baseUrl}check_message_status/${messageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (res.status === 200 && data.status === 200) {
        const messageIndex = me_message.value.findIndex(
          (m) => m.id === messageId
        );
        if (messageIndex !== -1 && !me_message.value[messageIndex].isComplete) {
          if (data.message.status === "completed") {
            me_message.value[messageIndex].isThinking = false;
            me_message.value[messageIndex].fullMessage = data.message.message;
            me_message.value[messageIndex].thinkProcess =
              data.message.think_content || "";
            me_message.value[messageIndex].qs_token =
              data.message.qs_token || 0;
            me_message.value[messageIndex].answer_token =
              data.message.answer_token || 0;

            // Update messages.value to reflect the AI reply in the sidebar
            const sessionId = me_message.value[messageIndex].session_id;
            const sessionIndex = messages.value.findIndex(
              (m) => m.session_id === sessionId
            );
            if (sessionIndex !== -1) {
              messages.value[sessionIndex] = {
                ...messages.value[sessionIndex],
                message: data.message.message, // Update the message field with AI reply
                created_at: new Date().toISOString(),
              };
            }

            typewriterEffect(messageIndex);
            send_loading.value = false;
            ruleForm.message_input = "";
            text_imageUrls.value = [];
            get_limit();
            clearInterval(pollingInterval);
          } else if (data.message.status === "failed") {
            me_message.value[messageIndex].isThinking = false;
            me_message.value[messageIndex].message = "Processing failed";
            send_loading.value = false;
            clearInterval(pollingInterval);
          }
        }
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  const pollingInterval = setInterval(checkResponse, 200);
};
const typewriterEffect = (index: number) => {
  if (me_message.value[index].isComplete || me_message.value[index].isTyping)
    return;

  me_message.value[index].isTyping = true;
  me_message.value[index].isCode = false;
  me_message.value[index].codeSegments = [];
  me_message.value[index].textSegments = [];

  const fullMessage = me_message.value[index].fullMessage;
  const thinkProcess = me_message.value[index].thinkProcess || "";
  const codeBlockRegex = /```[\s\S]*?```/g;
  let codeBlocks = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(fullMessage)) !== null) {
    const start = match.index;
    const end = codeBlockRegex.lastIndex;
    const codeContent = match[0].replace(/^```|```$/g, "").trim();
    codeBlocks.push({
      start,
      end,
      content: codeContent,
      textBefore: fullMessage.slice(lastIndex, start),
    });
    lastIndex = end;
  }

  if (codeBlocks.length === 0) {
    codeBlocks.push({
      start: 0,
      end: fullMessage.length,
      content: fullMessage,
      textBefore: "",
      isPlainText: true,
    });
  } else if (lastIndex < fullMessage.length) {
    codeBlocks.push({
      start: lastIndex,
      end: fullMessage.length,
      content: fullMessage.slice(lastIndex),
      textBefore: "",
      isPlainText: true,
    });
  }

  let currentSegment = 0;
  const typeNextSegment = () => {
    if (currentSegment >= codeBlocks.length + (thinkProcess ? 1 : 0)) {
      me_message.value[index].isComplete = true;
      me_message.value[index].isTyping = false;
      down_message();
      return;
    }

    if (currentSegment === codeBlocks.length && thinkProcess) {
      me_message.value[index].textSegments.push(thinkProcess);
      me_message.value[index].codeSegments.push("");
      currentSegment++;
      setTimeout(typeNextSegment, 0);
    } else {
      const segment = codeBlocks[currentSegment];
      const isCodeBlock = !segment.isPlainText;
      me_message.value[index].isCode = isCodeBlock;

      if (isCodeBlock) {
        me_message.value[index].codeSegments[currentSegment] = segment.content;
        me_message.value[index].textSegments[currentSegment] =
          segment.textBefore;
        currentSegment++;
        setTimeout(typeNextSegment, 0);
      } else {
        const words = segment.content.split(" ");
        let wordIndex = 0;
        me_message.value[index].textSegments[currentSegment] =
          segment.textBefore;
        me_message.value[index].codeSegments[currentSegment] = "";

        const typeWord = () => {
          if (wordIndex < words.length) {
            const currentText =
              me_message.value[index].textSegments[currentSegment] || "";
            me_message.value[index].textSegments[currentSegment] =
              currentText + (currentText ? " " : "") + words[wordIndex];
            me_message.value[index].message =
              me_message.value[index].textSegments[currentSegment];
            wordIndex++;
            setTimeout(typeWord, 100);
          } else {
            currentSegment++;
            typeNextSegment();
          }
        };
        typeWord();
      }
    }
  };

  typeNextSegment();
};

const cookie_message = useCookie("message");
if (counter.setting.no_login_aiqs == "1" && !token.value) {
  if (cookie_message.value) {
    me_message.value = cookie_message.value;
  }
}

const is_can_upload = (models: any) => {
  const model = Object.values(model_list.value) as any;
  let bol = true;
  for (let i = 0; i < model.length; i++) {
    if (model[i].model === models) {
      console.log("model ...", model[i].is_upload);
      if (model[i].is_upload === 1) {
        return true;
      } else {
        return false;
      }
    }
  }
  return bol;
  // console.log("false");
  // return false; // Default to false if model not found
};

// audio send

// audio send end
const submitFormNoLogin = async () => {
  if (ruleForm.message_input == "") {
    Message.warning("请输入内容");
    return false;
  }
  if (send_loading.value == true) {
    Message.warning("请等待上一条消息发送完成");
    return false;
  }
  if (event.shiftKey) {
    // 按下shift键，插入换行符
    const textarea = event.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 在光标位置插入换行符
    ruleForm.message_input =
      ruleForm.message_input.substring(0, start) +
      "\n" +
      ruleForm.message_input.substring(end);

    // 更新光标位置
    await nextTick();
    textarea.selectionStart = textarea.selectionEnd = start + 1;

    // 阻止默认行为
    event.preventDefault();
    return false;
  }

  send_loading.value = true;

  me_message.value.push({
    session_id: ms_active.value,
    question: ruleForm.message_input,
    message: "思考中...",
  });
  down_message();

  const res = await fetch(`${window.APP_CONFIG.baseUrl}no_send_bot`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      info: ruleForm.message_input,
      session_id: ms_active.value,
      model_select: model_is_select.value,
      scene_preset: SceneForm.domains,
      answer_tem: answer_tem.value,
    }),
  });

  up_stop.value = "start";
  if (res) {
    me_message.value[me_message.value.length - 1].message = "";
  }
  if (res.status == 500) {
    send_loading.value = false;
    Message.error("服务器错误");
    return false;
  }

  if (res.status == 402) {
    send_loading.value = false;
    me_message.value[me_message.value.length - 1].message =
      "未登录用户提问达到上限,,请登录继续免费使用";
    Message.error("未登录用户提问达到上限,请登录继续免费使用");
    return false;
  }
  if (res.status == 403) {
    send_loading.value = false;
    me_message.value[me_message.value.length - 1].message = "禁止发送违禁词";
    Message.error("禁止发送违禁词");
    return false;
  }
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    let result = new TextDecoder().decode(value);
    // console.log(result);
    let arr = result.split("\n\n").map((str) => str.replace(/\n/g, ""));
    let new_arr: any[] = [];
    // console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      is_done.value = false;
      if (
        (arr[i].slice(-2) == "]}" || arr[i].slice(-2) == "l}") &&
        arr[i].startsWith("data:")
      ) {
        new_arr.push(JSON.parse(arr[i].replace("data:", "")));
      } else if (
        arr[i].startsWith("data:") &&
        (arr[i].slice(-2) != "]}" || arr[i].slice(-2) != "l}")
      ) {
        streams.value = arr[i].replace("data:", "");
      } else if (
        (arr[i].slice(-2) == "]}" || arr[i].slice(-2) == "l}") &&
        arr[i].startsWith("data:") == false
      ) {
        // 与streams.value拼接成一个字符串
        let str = (streams.value += arr[i]);
        new_arr.push(JSON.parse(str.replace("data:", "")));
        streams.value = "";
      } else {
        if (arr[i].includes('"error"')) {
          me_message.value[me_message.value.length - 1].message = JSON.parse(
            arr[i]
          ).error.message;
        }
        streams.value = "";
      }
    }

    // console.log(new_arr)
    for (let i = 0; i < new_arr.length; i++) {
      setTimeout(() => {
        if (new_arr[i].choices[0].delta.content) {
          me_message.value[me_message.value.length - 1].message +=
            new_arr[i].choices[0].delta.content;
        }
        setTimeout(() => {
          down_message();
        }, 2000);
      }, 100);
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
      send_loading.value = false;
      ruleForm.message_input = "";
      cookie_message.value = me_message.value;
    } else {
      send_loading.value = true;
      is_done.value = false;
      onData(result!);
      await read();
    }
  };
  await read();
};

const qs_input = ref("");
const qs_search = () => {
  if (!qs_input.value) {
    Message.warning("请输入内容");
    return;
  }
  searchs({
    search: qs_input.value,
    page: page.value,
    limit: limit.value,
  })
    .then((res: any) => {
      messages.value = res._rawValue.data;
      ms_count.value = res._rawValue.count;
      Message.success("搜索完成");
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
};

const handleCommand = (command: any) => {
  ruleForm.message_input = scene_model.value[command].Instruction;
};

const delete_msg = (id: number) => {
  console.log("deleting message", id);
  del_msg({
    session_id: id,
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      all_message();
      ms_active.value = 0;
      me_message.value = [];
    })
    .catch((err: any) => {
      console.log(err);
    });
};

const delete_all = () => {
  del_all()
    .then((res: any) => {
      Message.success(res._rawValue.message);
      all_message();
      ms_active.value = 0;
      me_message.value = [];
    })
    .catch((err: any) => {
      console.log(err);
    });
  return true;
};

const handleClick = (command: any) => {
  const textarea = document.createElement("textarea");
  textarea.value = command.replace(/&nbsp;/g, " ");
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  Message.success("复制成功");
};

const posterimg = ref();
// 绑定  需要把那个内容生成图片
const poster = ref();

const drawer = ref(false);
const direction = ref("ltr");
const change_side = () => {
  drawer.value = true;
};
const now_model_title = ref("");
const handleSelect = (smallModelID: any) => {
  for (let i = 0; i < model_list.value.length; i++) {
    if (model_list.value[i].id == smallModelID) {
      now_model_title.value = model_list.value[i].title;
      model_is_select.value = model_list.value[i].model;
    }
  }

  // 判断ms_active是否为0
  if (ms_active.value != 0) {
    updata_model_message({
      session_id: ms_active.value,
      model: model_is_select.value,
    })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
const dialog_scene = ref(false);
const scene_search = ref("");
const scene_count = ref(0);
const scene_insearch = () => {
  scene_searchs({
    search: scene_search.value,
    page: s_page.value,
    limit: s_limit.value,
  })
    .then((res: any) => {
      scene_model.value = res._rawValue.data;
      scene_count.value = res._rawValue.count;
      Message.success("搜索完成");
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
};
const scene_id = ref("");
const selectedItem = (item: any, preset: any, ids: any) => {
  ruleForm.message_input = item;
  dialog_scene.value = false;
  scene_id.value = ids;
  update_scene({
    id: ids,
  })
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
  const arrs = JSON.parse(preset);
  SceneForm.domains = [];
  if (arrs == null || arrs == "") {
    return;
  }
  for (let i = 0; i < arrs.length; i++) {
    SceneForm.domains.push({
      key: Date.now(),
      value: arrs[i].content,
      sel: arrs[i].role,
    });
  }
};

const selectedItems = (item: any, preset: any) => {
  ruleForm.message_input = item;
  dialog_scene.value = false;
  SceneForm.domains = [];
  if (preset) {
    for (let i = 0; i < preset.length; i++) {
      SceneForm.domains.push({
        key: Date.now(),
        value: preset[i].content,
        sel: preset[i].role,
      });
    }
  }
};
const change_sname = (id: number) => {
  beizhu_info.value = true;
  ms_active.value = id;
};
const beizhu_info = ref(false);
const beizhu = ref("");
const handle_send = () => {
  if (!beizhu.value) {
    Message.warning("请输入内容");
    return true;
  }
  change_session_name(ms_active.value, beizhu.value);
  beizhu.value = "";
};
const change_session_name = (session_id: any, name: any) => {
  c_session_name({
    session_id: session_id,
    session_name: name,
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      all_message();
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
};

const formRefScene = ref<FormInstance>();
const SceneForm = reactive<{
  domains: DomainItem[];
}>({
  domains: [],
});

interface DomainItem {
  key: number;
  value: string;
  sel: string;
}

const domainOptions = [
  {
    value: "system",
    label: "system",
  },
  {
    value: "user",
    label: "user",
  },
  {
    value: "assistant",
    label: "assistant",
  },
];
const removeDomain = (item: DomainItem) => {
  const index = SceneForm.domains.indexOf(item);
  if (index !== -1) {
    SceneForm.domains.splice(index, 1);
  }
};

const addDomain = () => {
  SceneForm.domains.push({
    key: Date.now(),
    value: "",
    sel: "system",
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

//   const message = ruleForm.message_input.trim();
//   if (!message) {
//     Message.warning("请输入内容");
//     return;
//   }
//   if (send_loading.value) {
//     Message.warning("请等待上一条消息发送完成");
//     return;
//   }
//   if (!token.value && counter.setting.no_login_aiqs != "1") {
//     Message.warning("请先登录");
//     login_dialog_click();
//     return;
//   }

//   if (showMultiWindow.value) {
//     sendToMultiWindow(message);
//     ruleForm.message_input = "";
//     text_imageUrls.value = [];
//   } else {
//     // Single chat submission based on model
//     if (counter.setting.no_login_aiqs == "1" && !token.value) {
//       submitFormNoLogin();
//     } else if (model_big_choose.value == "gpt") {
//       submitForm();
//     } else if (model_big_choose.value == "fly") {
//       submitFormFly();
//     } else if (model_big_choose.value == "baidu") {
//       submitFormBaidu();
//     } else if (model_big_choose.value == "chatglm") {
//       submitFormGLM();
//     } else if (model_big_choose.value == "qwen") {
//       submitFormQwen();
//     } else if (model_big_choose.value == "tencent") {
//       submitFormTencent();
//     } else if (model_big_choose.value == "kimi") {
//       submitFormKimi();
//     } else {
//       submitForm();
//     }
//   }
// };

// const check_sub = async () => {
//   const message = ruleForm.message_input.trim();
//   if (!message) {
//     Message.warning("请输入内容");
//     return;
//   }
//   if (send_loading.value) {
//     Message.warning("请等待上一条消息发送完成");
//     return;
//   }
//   if (!token.value && counter.setting.no_login_aiqs != "1") {
//     Message.warning("请先登录");
//     login_dialog_click();
//     return;
//   }

//   if (showMultiWindow.value) {
//     const text =
//       ruleForm.message_input ||
//       (text_imageUrls.value.length > 0 ? "Describe these images." : "");
//     if (!text && text_imageUrls.value.length === 0) {
//       Message.warning("Please enter a message or upload an image.");
//       return;
//     }

//     // Fetch a new session ID for the multiwindow chat
//     try {
//       const response = await fetch(
//         `https://abdul.synthetixor.com/api/get-new-session-id`,
//         {
//           method: "GET",
//           headers: { Authorization: `Bearer ${useCookie("token")?.value}` },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to get new session ID");
//       const data = await response.json();
//       const newSessionId = data.session_id;
//       console.log("New multiwindow chat session ID:", newSessionId);

//       // Pass the new session ID to the multiwindow component
//       multiWindowRef.value.sendMessage(
//         text,
//         text_imageUrls.value,
//         newSessionId
//       );
//       ruleForm.message_input = "";
//       text_imageUrls.value = [];
//       hasMessageBeenSent.value = true;
//     } catch (error) {
//       console.error("Error fetching new session ID:", error);
//       Message.error("Failed to start new chat session. Please try again.");
//       return;
//     }
//   } else {
//     // Single chat submission based on model
//     if (counter.setting.no_login_aiqs == "1" && !token.value) {
//       await submitFormNoLogin();
//     } else if (model_big_choose.value == "gpt") {
//       await submitForm();
//     } else if (model_big_choose.value == "fly") {
//       await submitFormFly();
//     } else if (model_big_choose.value == "baidu") {
//       await submitFormBaidu();
//     } else if (model_big_choose.value == "chatglm") {
//       await submitFormGLM();
//     } else if (model_big_choose.value == "qwen") {
//       await submitFormQwen();
//     } else if (model_big_choose.value == "tencent") {
//       await submitFormTencent();
//     } else if (model_big_choose.value == "kimi") {
//       await submitFormKimi();
//     } else {
//       await submitForm();
//     }
//   }
// };

const check_sub = async () => {
  const message = ruleForm.message_input.trim();
  if (!message) {
    Message.warning("请输入内容");
    return;
  }
  if (send_loading.value) {
    Message.warning("请等待上一条消息发送完成");
    return;
  }
  if (!token.value && counter.setting.no_login_aiqs != "1") {
    Message.warning("请先登录");
    login_dialog_click();
    return;
  }

  if (showMultiWindow.value) {
    const text =
      ruleForm.message_input ||
      (text_imageUrls.value.length > 0 ? "Describe these images." : "");
    if (!text && text_imageUrls.value.length === 0) {
      Message.warning("Please enter a message or upload an image.");
      return;
    }

    let sessionIdToUse = ms_active.value; // Use the current session ID
    console.log("Current session ID:", sessionIdToUse);

    // Fetch a new session ID only if explicitly starting a new chat (e.g., ms_active is "new")
    if (!sessionIdToUse || sessionIdToUse === "new") {
      try {
        const response = await fetch(
          `https://abdul.synthetixor.com/api/get-new-session-id`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${useCookie("token")?.value}` },
          }
        );
        if (!response.ok) throw new Error("Failed to get new session ID");
        const data = await response.json();
        sessionIdToUse = data.session_id;
        console.log("New multiwindow chat session ID:", sessionIdToUse);
        ms_active.value = sessionIdToUse; // Update ms_active to the new session ID
      } catch (error) {
        console.error("Error fetching new session ID:", error);
        Message.error("Failed to start new chat session. Please try again.");
        return;
      }
    }

    // Send the message with the appropriate session ID
    multiWindowRef.value.sendMessage(
      text,
      text_imageUrls.value,
      sessionIdToUse
    );
    ruleForm.message_input = "";
    text_imageUrls.value = [];
    hasMessageBeenSent.value = true;
  } else {
    // Single chat submission based on model
    if (counter.setting.no_login_aiqs == "1" && !token.value) {
      await submitFormNoLogin();
    } else if (model_big_choose.value == "gpt") {
      await submitForm();
    } else if (model_big_choose.value == "fly") {
      await submitFormFly();
    } else if (model_big_choose.value == "baidu") {
      await submitFormBaidu();
    } else if (model_big_choose.value == "chatglm") {
      await submitFormGLM();
    } else if (model_big_choose.value == "qwen") {
      await submitFormQwen();
    } else if (model_big_choose.value == "tencent") {
      await submitFormTencent();
    } else if (model_big_choose.value == "kimi") {
      await submitFormKimi();
    } else {
      await submitForm();
    }
  }
};
const submitForms = async (url, onData) => {
  if (ruleForm.message_input === "") {
    Message.warning("请输入内容");
    return false;
  }
  if (send_loading.value) {
    Message.warning("请等待上一条消息发送完成");
    return false;
  }
  if (!token.value) {
    Message.warning("请先登录");
    login_dialog_click();
    return false;
  }

  send_loading.value = true;
  me_message.value.push({
    session_id: ms_active.value,
    question: ruleForm.message_input,
    message: "",
    isThinking: true, // Show thinking state initially
    isComplete: false, // Not complete until stream ends
    created_at: new Date().toISOString(),
    qs_token: 0,
    answer_token: 0,
  });
  down_message();

  const formData = new FormData();
  formData.append("info", ruleForm.message_input);
  formData.append("session_id", ms_active.value);
  formData.append("scene_preset", JSON.stringify(SceneForm.domains));
  formData.append("model_is_select", model_is_select.value);
  formData.append("answer_num", answer_num.value.toString());
  formData.append("answer_tem", answer_tem.value.toString());
  formData.append("now_choose_knowledge", JSON.stringify(know_check.value));

  const res = await fetch(`${window.APP_CONFIG.baseUrl}${url}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token.value}` },
    body: formData,
  });

  if (res.status >= 400) {
    const responseData = await res.json();
    me_message.value[me_message.value.length - 1].isThinking = false;
    me_message.value[me_message.value.length - 1].message =
      responseData.message || "发生错误";
    send_loading.value = false;
    Message.error(responseData.message || "发生错误");
    return false;
  }

  const stream = res.body?.getReader();
  const read = async () => {
    const result = await stream?.read();
    if (up_stop.value === "end") {
      stream?.cancel();
      send_loading.value = false;
      ruleForm.message_input = "";
      text_imageUrls.value = [];
      return false;
    }
    if (result?.done) {
      is_done.value = true;
      me_message.value[me_message.value.length - 1].isComplete = true; // Mark as complete
      send_loading.value = false;
      ruleForm.message_input = "";
      text_imageUrls.value = [];
      get_limit();
      if (ms_active.value === 0) {
        await all_message_sub();
        if (ms_active.value === 0) ms_active.value = m_last.value.session_id;
        await check_message(ms_active.value);
      } else {
        await check_messages(ms_active.value);
      }
    } else {
      send_loading.value = true;
      is_done.value = false;
      onData(result);
      await read();
    }
  };
  await read();
};

const submitFormFly = () =>
  submitForms("send_fly_msg", ({ value }) => {
    let result = new TextDecoder().decode(value);
    let arr = result.split("\n\n").map((str) => str.replace(/\n/g, ""));
    let new_arr = [];
    for (let i = 0; i < arr.length; i++) {
      is_done.value = false;
      if (arr[i].slice(-2) == "}}" && arr[i].startsWith("data:")) {
        new_arr.push(JSON.parse(arr[i].replace("data:", "")));
      } else if (arr[i].startsWith("data:") && arr[i].slice(-2) != "]}") {
        streams.value = arr[i].replace("data:", "");
      } else if (arr[i].slice(-2) == "}}" && !arr[i].startsWith("data:")) {
        let str = (streams.value += arr[i]);
        new_arr.push(JSON.parse(str.replace("data:", "")));
        streams.value = "";
      } else {
        if (arr[i].includes('"error"')) {
          me_message.value[me_message.value.length - 1].message = JSON.parse(
            arr[i]
          ).error.message;
        }
        streams.value = "";
      }
    }
    new_arr.forEach((item) => {
      if (item.payload.choices.text[0].content) {
        if (me_message.value[me_message.value.length - 1].message === "") {
          me_message.value[me_message.value.length - 1].isThinking = false; // Hide thinking once content starts
        }
        me_message.value[me_message.value.length - 1].message +=
          item.payload.choices.text[0].content; // Append progressively for typewriter-like effect
        down_message();
      }
      if (item.done) {
        me_message.value[me_message.value.length - 1].isComplete = true; // Mark complete when done
      }
    });
  });

const submitFormBaidu = () =>
  submitForms("run_baidu_send", ({ value }) => {
    let result = new TextDecoder().decode(value);
    let arr = result.split("\n\n").map((str) => str.replace(/\n/g, ""));
    let new_arr = [];
    for (let i = 0; i < arr.length; i++) {
      is_done.value = false;
      if (arr[i].slice(-2) == "}}" && arr[i].startsWith("data:")) {
        new_arr.push(JSON.parse(arr[i].replace("data:", "")));
      } else if (arr[i].startsWith("data:") && arr[i].slice(-2) != "]}") {
        streams.value = arr[i].replace("data:", "");
      } else if (arr[i].slice(-2) == "}}" && !arr[i].startsWith("data:")) {
        let str = (streams.value += arr[i]);
        new_arr.push(JSON.parse(str.replace("data:", "")));
        streams.value = "";
      } else {
        if (arr[i].includes('"error_msg"')) {
          me_message.value[me_message.value.length - 1].message = JSON.parse(
            arr[i]
          ).error_msg;
        }
        streams.value = "";
      }
    }
    new_arr.forEach((item) => {
      if (item.result) {
        if (me_message.value[me_message.value.length - 1].message === "") {
          me_message.value[me_message.value.length - 1].isThinking = false;
        }
        me_message.value[me_message.value.length - 1].message += item.result;
        down_message();
      }
      if (item.done) {
        me_message.value[me_message.value.length - 1].isComplete = true;
      }
    });
  });

const submitFormGLM = () =>
  submitForms("run_chatglm_send", async ({ value }) => {
    let partialData = "";
    const chunk = new TextDecoder().decode(value);
    const lines = (partialData + chunk).split("\n");
    partialData = lines.pop() || "";
    for (const line of lines) {
      if (line.trim() === "data: [DONE]") continue;
      try {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("data:")) {
          const jsonData = trimmedLine.slice(5);
          const json = JSON.parse(jsonData);
          if (json.choices) {
            json.choices.forEach((choice) => {
              const content = choice.delta?.content;
              if (content) {
                if (
                  me_message.value[me_message.value.length - 1].message === ""
                ) {
                  me_message.value[me_message.value.length - 1].isThinking =
                    false;
                }
                me_message.value[me_message.value.length - 1].message +=
                  content;
                down_message();
              }
              if (choice.finish_reason === "stop") {
                me_message.value[me_message.value.length - 1].isComplete = true;
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

const submitFormQwen = () =>
  submitForms("run_ali_send", ({ value }) => {
    let result = new TextDecoder().decode(value);
    let lines = result.split("\n");
    let events = [];
    let currentEvent = "",
      currentID = "",
      currentData = "";
    let combinedText = "";
    lines.forEach((line) => {
      if (line.startsWith("event:")) {
        currentEvent = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("id:")) {
        currentID = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("data:")) {
        currentData += currentData
          ? "\n" + line.slice("data:".length)
          : line.slice("data:".length);
        if (currentEvent && currentData) {
          let text = "";
          try {
            let parsedData = JSON.parse(currentData);
            if (parsedData.output && parsedData.output.text) {
              text = parsedData.output.text;
            }
          } catch (error) {
            console.error("解析 data 字段时出错:", error);
          }
          events.push({
            event: currentEvent,
            id: currentID,
            data: currentData,
            text,
          });
          combinedText += text;
          currentEvent = "";
          currentID = "";
          currentData = "";
        }
      }
    });
    events.forEach((event) => {
      me_message.value[me_message.value.length - 1].message += combinedText;
      setTimeout(() => down_message(), 2000);
    });
  });

const submitFormTencent = () =>
  submitForms("run_hunyuan_send", ({ value }) => {
    let partialData = "";
    const chunk = new TextDecoder().decode(value);
    const lines = (partialData + chunk).split("\n");
    partialData = lines.pop() || "";
    for (const line of lines) {
      try {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("data:")) {
          const jsonData = trimmedLine.slice(5);
          const json = JSON.parse(jsonData);
          if (json.Choices) {
            json.Choices.forEach((choice) => {
              const content = choice.Delta?.Content;
              if (content) {
                me_message.value[me_message.value.length - 1].message +=
                  content;
                setTimeout(() => down_message(), 2000);
              }
              if (choice.finish_reason === "stop") {
                return;
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

const submitFormKimi = () =>
  submitForms("send_kimi", ({ value }) => {
    let partialData = "";
    const chunk = new TextDecoder().decode(value);
    const lines = (partialData + chunk).split("\n");
    partialData = lines.pop() || "";
    for (const line of lines) {
      if (line.trim() === "data: [DONE]") continue;
      try {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("data:")) {
          const jsonData = trimmedLine.slice(5);
          const json = JSON.parse(jsonData);
          if (json.choices) {
            json.choices.forEach((choice) => {
              const content = choice.delta?.content;
              if (content) {
                me_message.value[me_message.value.length - 1].message +=
                  content;
                setTimeout(() => down_message(), 2000);
              }
              if (choice.finish_reason === "stop") {
                return;
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

const colorMode = useColorMode();
const change_theme = (theme: string) => {
  colorMode.preference = theme;
  document.body.setAttribute("arco-theme", theme + "-mode");
  arco_theme.value = theme;
};

const recorder = ref<any>(null);
const transcribedText = ref<string>("请对我说些什么吧~");
const voice_dialog = ref(false);
const voice_open = ref(false);
const voice_load = ref(false);
// const startRecording = () => {
//   recorder.value = Recorder({
//     type: "mp3",
//     sampleRate: 16000,
//     bitRate: 16,
//     onProcess: (
//       buffers: any,
//       powerLevel: number,
//       duration: number,
//       sampleRate: number
//     ) => {
//       // 处理录音数据
//     },
//   });
//   voice_open.value = true;
//   transcribedText.value = "我正在听您说话...";
//   recorder.value.open(() => {
//     recorder.value.start();
//   });
// };

// voice to speach

// Existing imports and setup remain unchanged
// Place these updates after the existing voice-related definitions (around line 2000+)

// Add a flag to determine the mode (voice response vs. speech-to-text)
const startRecording = () => {
  recorder.value = Recorder({
    type: "mp3",
    sampleRate: 16000,
    bitRate: 16,
    onProcess: (buffers, powerLevel, duration, sampleRate) => {
      // Optional: Could visualize recording progress
    },
  });
  voice_open.value = true;
  transcribedText.value = "我正在听您说话...";
  recorder.value.open(
    () => {
      recorder.value.start();
    },
    (error) => {
      Message.error("Failed to access microphone: " + error.message);
    }
  );
};
const voiceMode = ref<"response" | "text">("response"); // Default to voice response

// Function to toggle mode (optional, could be set via UI or config)
const setVoiceModeToText = () => {
  voiceMode.value = "text";
  voice_dialog.value = true; // Open the dialog if not already open
  transcribedText.value = "Ready to record for text input";
};

// Existing startRecording (unchanged, included for context)

// Modified stopRecording to handle both modes
const stopRecording = () => {
  if (recorder.value) {
    recorder.value.stop(
      (blob) => {
        voice_open.value = false;
        if (voiceMode.value === "text") {
          handleTranscriptionToText(blob); // New function for text mode
        } else {
          voice_load.value = true;
          transcribedText.value = "正在识别,请您等待...";
          handleTranscription(blob); // Original voice response logic
        }
      },
      (error) => {
        Message.error("Failed to stop recording: " + error.message);
        voice_open.value = false;
      }
    );
  }
};

// New function to transcribe audio to text
const handleTranscriptionToText = async (blob: Blob) => {
  try {
    transcribedText.value = "Transcribing...";
    const transcription = await speechToText(blob);
    ruleForm.message_input = transcription; // Set to chat input
    transcribedText.value = "Transcription successful. Text added to input.";
    voice_dialog.value = false; // Close dialog after success
    voiceMode.value = "response"; // Reset to default mode
  } catch (error) {
    transcribedText.value = "Transcription failed";
    voice_load.value = false;
  }
};

// New speech-to-text API call function
const speechToText = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("audioData", blob, "audio.mp3");

  try {
    const response = await fetch(
      `${window.APP_CONFIG.baseUrl}/api/speech-to-text`,
      {
        // Added /api/
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        Message.error("Unauthorized. Please log in.");
        login_dialog_click();
        throw new Error("Unauthorized");
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "Transcription failed");
    }

    const data = await response.json();
    return data.transcription || "No transcription received";
  } catch (error) {
    console.error("Error in speech-to-text:", error);
    Message.error(error.message || "Failed to transcribe audio");
    throw error;
  }
};

const toggleVoiceMode = () => {
  voiceMode.value = voiceMode.value === "response" ? "text" : "response";
  if (voiceMode.value === "text") {
    setVoiceModeToText();
  } else {
    transcribedText.value = "请对我说些什么吧~"; // Reset to default
  }
};

const reduce_chat = () => {
  reduce_chat_pro({
    session_id: ms_active.value,
  })
    .then((res: any) => {
      Message.success(res._rawValue.message);
      router.push("/chat/" + res._rawValue.data);
    })
    .catch((err: any) => {
      Message.error(err.message);
    });
};
const checkedValue = ref([]);
const voice_set_loading = ref(false);
const transcribeAudio = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("audioData", blob, "audio.mp3");
  formData.append("voice", voice_role_choose.value);
  formData.append("voice_list", checkedValue.value);
  try {
    const response = await fetch(
      `${window.APP_CONFIG.baseUrl}transcribe-audio`,
      {
        method: "POST",
        headers: headers,
        body: formData,
      }
    );
    if (response.status == 402) {
      voice_load.value = false;
      Message.error("发送次数已达上限或余额不足");
      throw new Error("发送次数已达上限或余额不足");
    }

    if (!response.ok) {
      voice_load.value = false;
      transcribedText.value = "识别失败,请重试";
      if (response.statusText == "Unauthorized") {
        Message.error("请先登录");
        throw new Error("请先登录");
      } else {
        Message.error(response.statusText);
        throw new Error(response.statusText);
      }
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
    voice_get_list();
    voice_load.value = false;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};
const edit_question = (info: any) => {
  ruleForm.message_input = info;
};

const ChatranscribeAudio = async (info: string): Promise<string> => {
  const formData = new FormData();
  formData.append("voice", voice_role_choose.value);
  formData.append("info", info);
  try {
    const response = await fetch(`${window.APP_CONFIG.baseUrl}chat-audio`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      Message.error(response.statusText);
      throw new Error(response.statusText);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
    speak_is_audio.value = false;
    Message.success("语音播放完成");
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};

const handleTranscription = (blob: Blob) => {
  transcribeAudio(blob)
    .then(() => {
      voice_load.value = false;
      transcribedText.value = "您还想问我些什么呢？";
    })
    .catch((error: any) => {
      console.error("Error transcribing audio:", error);
    });
};
const voice_role_choose = ref("alloy");
const voice_role = ref([
  {
    value: "alloy",
    label: "Alloy",
    image: "/images/avatar-1.png",
    description: "Alloy是一个男孩，他是一个有趣的人，他喜欢和人们聊天。",
  },
  {
    value: "echo",
    label: "Echo",
    image: "/images/avatar-2.png",
    description: "Echo是一个柔声男孩，他会为您提供帮助。",
  },
  {
    value: "fable",
    label: "Fable",
    image: "/images/avatar-3.png",
    description: "Fable是一个男人，他是一个严肃的人，他喜欢回答您的问题。",
  },
  {
    value: "onyx",
    label: "Onyx",
    image: "/images/avatar-4.png",
    description:
      "Onyx是一个男孩，也许是个工程师，神秘莫测的他，喜欢和人们聊天。",
  },
  {
    value: "nova",
    label: "Nova",
    image: "/images/avatar-5.png",
    description: "Nova是一个温柔的男人，他很会用温暖话语安慰你。",
  },
  {
    value: "shimmer",
    label: "Shimmer",
    image: "/images/avatar-6.png",
    description: "Shimmer是一个热情女孩，她很乐意帮助您。",
  },
]);
const voice_role_change = (v: string) => {
  chat_speak.value = v;
  Message.success("切换成功");
};
const handleSelectRole = (v: string) => {
  voice_role_choose.value = v;
};

const deep_thinking = ref(false);

const toggleDeepThinking = (val: boolean) => {
  deep_thinking.value = val;
};
</script>
<style scoped lang="scss">
.v-align {
  vertical-align: -2px;
}

.plugin-market {
  border: 1px solid #e5e7eb;
}

.plugin-market :deep(.arco-card) {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.plugin-market :deep(.arco-card:hover) {
  border-color: #165dff;
}

.plugin-market :deep(.arco-btn) {
  border-radius: 4px;
}

.uploaded-file {
  display: inline-block;
  margin-right: 8px;
}

.thumbnail-container {
  position: relative;
  display: inline-block;
}

.thumbnail {
  border-radius: 4px;
}

.file-icon {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  /* Added to position the delete button */
}

/* New styles for the delete button */
.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  /* Center the button on the corner */
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ef4444;
  /* Red-500 */
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #dc2626;
  /* Red-600 */
}

.delete-btn span {
  line-height: 1;
  /* Ensure the X is vertically centered */
}

/* Base AI bubble ai reply css */
// .ai-message-content {
//   white-space: pre-wrap;
//   word-wrap: break-word;
//   max-width: 100%;
//   background-color: #f5f5f5;
//   border-radius: 8px;
//   padding: 12px;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
// }

// .message-body {
//   margin-bottom: 16px;
// }

// .hljs {
//   background: #1e1e1e;
//   color: #d4d4d4;
//   padding: 10px;
//   border-radius: 4px;
// }

// .global-typing-indicator {
//   position: fixed;
//   bottom: 10px;
//   left: 50%;
//   transform: translateX(-50%);
//   z-index: 1000;
// }

// .typing-image {
//   width: 24px;
//   height: 24px;
// }

/* White background during thinking/typing */
// .chat-content {
//   max-width: 800px; /* Matches Grok's typical width */

//   padding: 1rem;
// }

// .ai-message-content {
//   background: #ffffff;
//   border-radius: 8px;
//   padding: 1rem;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// }

// .ai-code-container {
//   background: #1e1e1e; /* Dark theme like Grok */
//   color: #d4d4d4;
//   padding: 1rem;
//   border-radius: 8px;
//   font-family: "Courier New", Courier, monospace;
//   white-space: pre-wrap;
//   margin: 0.5rem 0; /* Separation like Grok */
//   position: relative;
// }

// .ai-code-container code {
//   display: block; /* Ensures proper block rendering */
// }

// .typewriter-text::after {
//   content: "|";
//   animation: blink 1s step-end infinite;
//   margin-left: 2px;
// }

// @keyframes blink {
//   50% {
//     opacity: 0;
//   }
// }

// .thinking-indicator {
//   display: inline-block;
//   width: 1em;
//   height: 1em;
//   border: 2px solid #ccc;
//   border-top-color: #007bff;
//   border-radius: 50%;
//   animation: spin 1s infinite linear;
// }

// @keyframes spin {
//   to {
//     transform: rotate(360deg);
//   }
// }

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.typewriter-text {
  display: block;
  white-space: pre-wrap;
  animation: typing 0.1s steps(1, end);
}

// .typewriter-text::after {
//   content: "|";
//   animation: blink 1s step-end infinite;
//   margin-left: 2px;
// }

// @keyframes blink {
//   50% {
//     opacity: 0;
//   }
// }

.code-block-wrapper {
  display: block;
  position: relative;
  margin: 0.5rem 0;
}

.ai-code-container {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 8px;
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  overflow-x: auto;
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.copy-code-btn:hover {
  background: #0056b3;
}

.thinking-indicator {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
