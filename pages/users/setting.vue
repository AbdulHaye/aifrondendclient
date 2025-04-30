<template>
  <div class="main">
    <div class="editor-panel">
      <div class="h-100 w-100 setting_mod editor-panel__content">
        <h4 class="bg-white p-2 mb-0 px-xl-4 px-lg-4 px-2 w-100">

          个人中心
          <a-tooltip content="退出登录">
            <svg t="1699192784596" @click="sigt_out()" class="icon arco-icon cursor-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8911" width="32" height="32"><path d="M568.6912 38.4C699.712 38.4 806.4 143.0784 806.4 272.8064c0 23.7824-19.0976 43.0592-42.6624 43.0592-21.888 0-39.9232-16.6272-42.3808-38.0416l-0.2944-5.0176c0-78.8992-63.488-143.8336-144-148.0832l-8.3712-0.2176H276.096c-81.6 0-147.8272 62.3104-152.1536 140.1856l-0.2176 8.1152v478.3872c0 78.8992 63.488 143.8336 144 148.0832l8.3712 0.2176H568.704c81.6 0 147.8272-62.3104 152.1536-140.1856l0.2176-8.1152c0-23.7824 19.1104-43.0592 42.6752-43.0592 23.552 0 42.6624 19.2768 42.6624 43.0592 0 126.6432-101.6704 229.4016-228.4032 234.24L568.704 985.6H276.096C148.224 985.6 43.4944 885.8496 38.5792 760.4096L38.4 751.1936V272.8064c0-126.6432 101.6704-229.4016 228.4032-234.24L276.096 38.4H568.704z" fill="#1F1F1F" p-id="8912"></path><path d="M823.1424 371.2c5.12 0 10.0864 1.9712 14.1696 5.632l126.0288 112.64c10.4448 9.3312 12.5568 26.9824 4.736 39.424-1.344 2.1376-2.944 4.032-4.736 5.632l-126.0288 112.64c-10.432 9.3312-25.2416 6.8096-33.0752-5.632a31.872 31.872 0 0 1-4.736-16.896v-65.7536l-346.5728 0.0512C428.992 558.9376 409.6 537.92 409.6 512s19.392-46.9376 43.328-46.9376l346.5856-0.0384V399.36c0-15.552 10.5728-28.16 23.6288-28.16z" fill="#455CED" p-id="8913"></path></svg>
          </a-tooltip>
        </h4>
        <div class="editor-panel__right-panel">
          <a-tabs v-model="c_change" lazy-load destroy-on-hide
                  size="large"
                  @tab-click="change_key_tab"
          >
            <a-tab-pane key="me">
              <template #title>
                <icon-user/>
                个人信息
              </template>

              <div class="row pb-10">
                <a-row class="mb-2 px-3 pr-0 pt-4" :gutter="20">
                  <a-col :xs="24" :lg="6" class="mb-3">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">今日消耗Token</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col flex items-center">
                            <svg t="1704636973283" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3132" width="48" height="48"><path d="M894.958933 362.376533a34.133333 34.133333 0 0 1 53.2992 42.666667c-123.118933 153.838933-261.8368 202.3424-415.7952 143.5136l-6.417066-2.525867-9.659734-3.669333c-158.651733-59.392-269.550933-27.477333-387.328 119.7568a34.133333 34.133333 0 0 1-53.2992-42.6496C210.1248 451.498667 350.3104 409.6 533.794133 476.0064l6.724267 2.491733 10.376533 3.959467c127.1808 50.926933 236.970667 13.755733 344.064-120.081067z" fill="#444444" p-id="3133"></path><path d="M540.381867 585.250133a34.133333 34.133333 0 0 1 36.676266 31.3856c9.659733 124.450133-45.277867 229.8368-172.526933 331.605334a34.133333 34.133333 0 1 1-42.6496-53.2992c110.7968-88.6272 154.862933-173.141333 147.114667-273.015467a34.133333 34.133333 0 0 1 31.3856-36.693333zM618.973867 75.741867a34.133333 34.133333 0 0 1 42.666666 53.2992c-100.420267 80.349867-145.8688 162.286933-141.7728 250.094933a34.133333 34.133333 0 1 1-68.1984 3.191467c-5.2224-112.0256 51.1488-213.640533 167.304534-306.5856z" fill="#444444" p-id="3134"></path><path d="M274.1248 596.138667a34.133333 34.133333 0 0 1 46.08-2.2528l2.184533 1.979733 106.069334 104.8576a34.133333 34.133333 0 0 1-45.806934 50.517333l-2.184533-1.962666-106.069333-104.8576a34.133333 34.133333 0 0 1-0.273067-48.2816zM207.940267 695.3984a34.133333 34.133333 0 0 1 46.08-2.389333l2.184533 1.979733 73.0112 71.799467a34.133333 34.133333 0 0 1-45.6704 50.653866l-2.2016-1.979733-73.0112-71.799467a34.133333 34.133333 0 0 1-0.392533-48.264533zM700.416 202.922667a34.133333 34.133333 0 0 1 46.08-2.389334l2.2016 1.979734 72.994133 71.799466a34.133333 34.133333 0 0 1-45.687466 50.6368l-2.184534-1.979733-72.994133-71.799467a34.133333 34.133333 0 0 1-0.4096-48.264533z" fill="#444444" p-id="3135"></path><path d="M618.274133 266.990933l139.127467 137.898667-24.029867 24.251733a34.133333 34.133333 0 0 1-48.2816 0.2048l-90.624-89.838933a34.133333 34.133333 0 0 1-0.221866-48.2816l24.029866-24.234667z" fill="#165dff" p-id="3136"></path></svg>
                            <span class="h3 mb-0">{{ total_token }}</span>

                          </div>
                          <div>
                            <a-alert type="info" class="mt-2" show-icon>
                              Token主要用于AI对话、AI绘画等
                            </a-alert>
                          </div>
                        </div>
                      </div>

                    </div>
                  </a-col>
                  <a-col :xs="24" :lg="6" class="mb-3">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">昨日消耗Token</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col flex items-center">
                            <svg t="1704637053784" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3501" width="48" height="48"><path d="M681.6768 121.258667c40.226133 0 77.550933 6.0416 111.1552 16.128 18.8416 5.649067 33.092267 11.451733 42.1376 15.957333l2.338133 1.194667-31.778133 60.416-3.8912-1.826134a250.606933 250.606933 0 0 0-28.433067-10.359466 318.3616 318.3616 0 0 0-91.528533-13.243734 330.990933 330.990933 0 0 0-116.309333 21.384534l-4.8128 1.911466a163.003733 163.003733 0 0 0-7.714134 3.328l-0.7168 0.341334-30.634666-60.996267 5.205333-2.474667c9.557333-4.369067 23.552-9.745067 41.335467-15.035733 35.157333-10.461867 73.386667-16.725333 113.646933-16.725333z" fill="#165dff" p-id="3502"></path><path d="M72.465067 719.837867L302.0288 113.032533c21.111467-58.9312 103.389867-59.562667 125.678933-3.805866l1.2288 3.2768 99.84 255.6928a34.133333 34.133333 0 0 1-62.532266 27.272533l-1.058134-2.440533L365.602133 137.898667 136.8576 742.519467H636.928a34.133333 34.133333 0 0 1 34.030933 31.5904l0.1024 2.56a34.133333 34.133333 0 0 1-31.5904 34.030933l-2.56 0.085333H135.850667c-45.704533 0-77.8752-44.322133-64.375467-87.9104l1.024-3.037866z" fill="#444444" p-id="3503"></path><path d="M361.335467 636.603733a34.133333 34.133333 0 0 1 34.048 31.5904l0.085333 2.56v250.8288a34.133333 34.133333 0 0 1-68.164267 2.56l-0.1024-2.56V670.737067a34.133333 34.133333 0 0 1 34.133334-34.133334zM679.355733 274.909867c-147.780267 0-267.554133 119.978667-267.554133 267.946666 0 147.968 119.790933 267.946667 267.554133 267.946667 147.797333 0 267.554133-119.978667 267.554134-267.946667 0-147.968-119.773867-267.946667-267.554134-267.946666z m0 68.266666c110.062933 0 199.287467 89.378133 199.287467 199.68 0 110.2848-89.2416 199.68-199.287467 199.68-110.045867 0-199.287467-89.412267-199.287466-199.68 0-110.2848 89.2416-199.68 199.287466-199.68z" fill="#444444" p-id="3504"></path><path d="M681.6768 636.603733a34.133333 34.133333 0 0 1 34.048 31.5904l0.085333 2.56v250.8288a34.133333 34.133333 0 0 1-68.181333 2.56l-0.085333-2.56V670.737067a34.133333 34.133333 0 0 1 34.133333-34.133334z" fill="#444444" p-id="3505"></path></svg>
                            <span class="h3 mb-0">{{ yes_token }}</span>

                          </div>
                          <div>
                            <a-alert type="info" class="mt-2" show-icon>
                              统计昨日消耗Token包括不限于AI对话、AI绘画等
                            </a-alert>
                          </div>
                        </div>
                      </div>

                    </div>
                  </a-col>
                  <a-col :xs="24" :lg="6" class="mb-3">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">今日会员消耗次数</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col flex items-center">
                            <svg t="1704637769947" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3850" width="48" height="48"><path d="M511.5392 120.712533h-0.170667a125.559467 125.559467 0 0 0-92.091733 39.543467 127.965867 127.965867 0 0 0-34.218667 101.341867l0.682667 5.410133c2.082133 14.336 6.5024 28.0064 13.073067 40.618667l1.553066 2.8672-87.227733 105.864533-136.260267-60.091733a65.757867 65.757867 0 0 0-90.385066 75.912533l103.799466 421.085867a65.757867 65.757867 0 0 0 63.863467 50.005333h515.6864a65.757867 65.757867 0 0 0 63.863467-50.005333l103.867733-421.376a65.757867 65.757867 0 0 0-48.110933-79.581867l-4.232534-0.904533a65.774933 65.774933 0 0 0-37.853866 4.488533l-138.496 60.552533-87.278934-105.898666 1.365334-2.4576c7.338667-14.011733 12.049067-29.354667 13.841066-45.4656a128 128 0 0 0-33.2288-101.376 125.696 125.696 0 0 0-92.040533-40.533334z m-4.078933 65.877334l3.874133-0.119467a59.938133 59.938133 0 0 1 44.100267 19.575467 62.225067 62.225067 0 0 1 16.008533 49.339733 61.764267 61.764267 0 0 1-12.765867 31.522133l-2.798933 3.345067a32.887467 32.887467 0 0 0-0.904533 42.871467l118.954666 144.315733c9.335467 11.332267 25.070933 15.104 38.536534 9.216l161.262933-70.485333-103.8848 421.341866H254.1568L150.340267 416.426667l159.061333 70.161066c13.482667 5.956267 29.269333 2.218667 38.638933-9.1648l118.954667-144.3328c10.325333-12.526933 9.966933-30.72-0.853333-42.837333a62.173867 62.173867 0 0 1-15.6672-35.4304 62.173867 62.173867 0 0 1 16.503466-49.288533 59.562667 59.562667 0 0 1 40.482134-18.944z" fill="#444444" p-id="3851"></path><path d="M322.986667 589.056l42.837333 171.434667h-70.331733l-38.741334-154.862934a34.133333 34.133333 0 0 1 66.235734-16.554666z" fill="#165dff" p-id="3852"></path></svg>
                            <span class="h3 mb-0">{{ last_msg }}/{{
                                me_vip ? me_vip.limit_send : 0
                              }}</span>

                          </div>
                          <div>
                            <a-alert type="info" class="mt-2" show-icon>
                              统计会员消耗次数，不经过比对结果
                            </a-alert>
                          </div>
                        </div>
                      </div>

                    </div>
                  </a-col>
                  <a-col :xs="24" :lg="6" class="mb-3">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">今日{{counter.setting.money_name_set}}消费</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col flex items-center">
                            <svg t="1704637897874" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4113" width="48" height="48"><path d="M887.466667 170.666667H136.533333a68.266667 68.266667 0 0 0-68.266666 68.266666v172.731734a34.133333 34.133333 0 0 0 27.357866 33.450666 68.266667 68.266667 0 0 1 0 133.768534A34.133333 34.133333 0 0 0 68.266667 612.334933V785.066667a68.266667 68.266667 0 0 0 68.266666 68.266666h750.933334a68.266667 68.266667 0 0 0 68.266666-68.266666V612.334933a34.133333 34.133333 0 0 0-27.357866-33.450666 68.266667 68.266667 0 0 1 0-133.768534A34.133333 34.133333 0 0 0 955.733333 411.665067V238.933333a68.266667 68.266667 0 0 0-68.266666-68.266666zM136.533333 238.933333h750.933334v147.9168l-1.3824 0.597334A136.6016 136.6016 0 0 0 805.546667 512l0.068266 4.437333a136.618667 136.618667 0 0 0 80.469334 120.1152l1.3824 0.580267V785.066667H136.533333v-147.933867l1.3824-0.580267A136.6016 136.6016 0 0 0 218.453333 512l-0.068266-4.437333a136.618667 136.618667 0 0 0-80.469334-120.1152L136.533333 386.850133V238.933333z" fill="#444444" p-id="4114"></path><path d="M375.466667 392.533333v238.933334a34.133333 34.133333 0 0 1-34.133334 34.133333h-34.133333V358.4h34.133333a34.133333 34.133333 0 0 1 34.133334 34.133333z" fill="#165dff" p-id="4115"></path></svg>
                            <span class="h3 mb-0">{{today_cost}}</span>

                          </div>
                          <div>
                            <a-alert type="info" class="mt-2" show-icon>
                              统计今日耗费用户额度，非剩余额度值
                            </a-alert>
                          </div>
                        </div>
                      </div>

                    </div>
                  </a-col>
                </a-row>
                <div class="left_set col-4 a-col-12">

                    <div class="mb-2">
                      <div class="card-body">
                        <div class="index_module_card index_module_card_pw60">
                          <div class="index-module_header "><span
                              class="index-module_title">个人信息</span>
                          </div>
                          <div class="index-module_basic">
                            <div class="flex flex-col text-center items-center" >
                              <img :src="me_info.avatar" alt="avatar" class="avatar-150 rounded-full mb-2">
                              <a-upload
                                  class="avatar-uploader"
                                  :action="actions"
                                  :show-file-list="false"
                                  :headers="{'Authorization': 'Bearer ' + token}"
                                  @success="onSuccessUp"
                                  @before-upload="beforeUpload"
                              >
                              </a-upload>
                              <div class="flex mt-2">
                                <svg t="1699192493318" class="icon mr-2" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="41914" width="24" height="24"><path d="M0 0m326.980262 0l653.960525 0q326.980262 0 326.980262 326.980262l0 326.980262q0 326.980262-326.980262 326.980263l-653.960525 0q-326.980262 0-326.980262-326.980263l0-326.980262q0-326.980262 326.980262-326.980262Z" fill="#8E8E8E" p-id="41915"></path><path d="M398.098469 694.833057a471.178558 471.178558 0 0 1-1.634901 50.273216 49.047039 49.047039 0 0 1-12.75223 29.509968 55.750135 55.750135 0 0 1-43.07965 18.39264 64.415112 64.415112 0 0 1-44.714551-18.39264 49.53751 49.53751 0 0 1-13.569681-29.509968 485.483944 485.483944 0 0 1-1.471411-50.273216v-408.725328a127.522302 127.522302 0 0 1 15.204582-79.047478 60.409603 60.409603 0 0 1 43.897101-19.128345 59.019937 59.019937 0 0 1 43.079649 18.392639 50.273215 50.273215 0 0 1 13.569681 30.32742 459.489014 459.489014 0 0 1 1.634901 49.455764z m629.437005-202.727762a300.167881 300.167881 0 0 1-88.202926 233.872632 262.40166 262.40166 0 0 1-182.781966 57.793762h-130.792105a305.563055 305.563055 0 0 1-55.259664-3.515038 61.96276 61.96276 0 0 1-32.698027-21.008482 147.141118 147.141118 0 0 1-11.199074-75.04197v-386.981141a339.242022 339.242022 0 0 1 2.370607-52.970802 52.889057 52.889057 0 0 1 14.387132-28.774263 55.014429 55.014429 0 0 1 30.327419-15.204582 264.200052 264.200052 0 0 1 51.908117-3.188058h128.503243a357.716407 357.716407 0 0 1 108.557447 13.569681 209.349113 209.349113 0 0 1 112.562955 83.379967 332.538927 332.538927 0 0 1 51.908117 197.986549z m-120.573972-1.634902a230.92981 230.92981 0 0 0-50.273215-162.01872 116.650209 116.650209 0 0 0-49.455765-31.14487 321.748578 321.748578 0 0 0-83.788692-8.174506h-79.456204v402.512703h90.982258a183.844652 183.844652 0 0 0 107.739997-25.586206 201.992057 201.992057 0 0 0 63.842896-175.588401z" fill="#FFFFFF" p-id="41916"></path></svg>
                                {{ me_info.id}}
                              </div>
                            </div>
                            <a-form :model="me_info" class="g-3 ai-form" v-if="!now_loading"
                                    layout="vertical">
                              <a-form-item label="昵称:">
                                <a-input placeholder="请输入昵称"
                                         v-model="me_info.name"></a-input>
                              </a-form-item>
                              <a-form-item label="描述:">
                                <a-textarea placeholder="请输入个人描述"
                                            v-model="me_info.description"
                                ></a-textarea>
                              </a-form-item>
                              <a-button type="primary" @click="update_info()"
                                        :loading="up_loading">
                                更新信息
                              </a-button>
                            </a-form>

                          </div>
                          <div class="p-2 w-full bg-white border text-center">
                            注册时间：{{me_info.created_at}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">更改密码</span></div>
                        <div class="index-module_basic">
                          <a-form :model="pass_all" class="g-3 ai-form" layout="vertical">
                            <a-form-item label="旧密码:">
                              <a-input placeholder="请输入旧密码"
                                       v-model="pass_all.old_password"></a-input>
                            </a-form-item>
                            <a-form-item label="新密码:">
                              <a-textarea placeholder="请输入新密码"
                                          v-model="pass_all.new_password"
                              ></a-textarea>
                            </a-form-item>
                            <a-form-item label="确认新密码:">
                              <a-textarea placeholder="请二次输入新密码"
                                          v-model="pass_all.new_password_confirmation"
                              ></a-textarea>
                            </a-form-item>
                            <a-button type="primary" @click="c_pass()"
                                      :loading="pass_loading">
                              修改密码
                            </a-button>
                          </a-form>
                        </div>

                      </div>
                    </div>
                </div>
                <div class="right_set col-8 a-col-12">
                    <a-modal v-model:visible="change_phone_number" class="phone_dialog"
                             title="更新手机号">
                      <a-form :model="phone_form">
                        <a-form-item label="手机号">
                          <a-input v-model="phone_form.phone"
                                   placeholder="请输入手机号" autocomplete="off"/>
                        </a-form-item>
                        <a-form-item label="手机验证码">
                          <a-space>
                            <a-input v-model="phone_form.phone_code"
                                     placeholder="请输入验证码" autocomplete="off">
                            </a-input>
                            <a-button :loading="send_wait" type="primary"
                                      @click="check_verify('phone')">
                              {{ send_code_text }}
                            </a-button>

                          </a-space>
                        </a-form-item>
                      </a-form>
                      <template #footer>
                                                          <span class="dialog-footer">
                                                            <a-button type="primary" @click="c_user_phone()">
                                                              提交
                                                            </a-button>
                                                          </span>
                      </template>
                    </a-modal>
                    <a-modal v-model:visible="change_email_code" class="email_dialog"
                             title="更改邮箱">
                      <a-form :model="email_form">
                        <a-form-item label="邮箱">
                          <a-input v-model="email_form.email" placeholder="请输入新的邮箱"
                                   autocomplete="off"/>
                        </a-form-item>
                        <a-form-item label="邮箱验证码">
                          <a-space>
                            <a-input v-model="email_form.email_code"
                                     placeholder="请输入验证码" autocomplete="off">
                            </a-input>
                            <a-button :loading="send_wait" type="primary"
                                      @click="check_verify('email')">
                              {{ send_code_text }}
                            </a-button>
                          </a-space>

                        </a-form-item>
                      </a-form>
                      <template #footer>
                                                          <span class="dialog-footer">
                                                             <a-button type="primary" @click="c_user_email()">
                                                              提交
                                                            </a-button>
                                                          </span>
                      </template>
                    </a-modal>
                    <a-modal class="pic_cap" v-model:visible="captcha_v" title="图形验证" :footer="false">
                      <div ref="demo"></div>
                    </a-modal>
                    <!--new mode-->
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">基本设置</span></div>
                        <div class="index-module_basic">
                          <div class="index_module_cardItem">
                            <div class="index-module_svgIcon"><img
                                src="@/assets/images/phone_verify.svg"
                                alt=""></div>
                            <div class="index-module_info">
                              <div class="index-module_infoTop"><span
                                  class="index-module_label">安全手机</span><span
                                  class="index-module_bind" v-if="me_info.phone">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>已绑定</span>
                                                                        </span>
                                <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未绑定</span>
                                                                        </span>
                              </div>
                              <div class="index-module_desc"><span
                                  class="index-module_desc">{{
                                  me_info.phone
                                }}</span>
                                可用于身份验证、密码找回、通知接收
                              </div>
                            </div>
                            <div class="index-module_btnWrap">
                              <a-button
                                  @click="change_phone_number = true"
                                  class="index-module_btn"
                                  :type="me_info.phone?'secondary':'primary'"
                              ><span>{{ me_info.phone ? '修改' : '绑定' }}</span>
                              </a-button>
                            </div>
                          </div>
                          <div class="index_module_cardItem">
                            <div class="index-module_svgIcon"><img
                                src="@/assets/images/email_verify.svg"
                                alt=""></div>
                            <div class="index-module_info">
                              <div class="index-module_infoTop"><span
                                  class="index-module_label">安全邮箱</span>
                                <span
                                    class="index-module_bind" v-if="me_info.email">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>已绑定</span>
                                                                        </span>
                                <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未绑定</span>
                                                                        </span>
                              </div>
                              <div class="index-module_desc"><span
                                  class="index-module_desc"></span>
                                {{ me_info.email }}邮箱可用于身份验证、密码找回、通知接收
                              </div>
                            </div>
                            <div class="index-module_btnWrap">
                              <a-button
                                  @click="change_email_code = true"
                                  class="index-module_btn"
                                  :type="me_info.email?'secondary':'primary'"
                              ><span>{{ me_info.email ? '修改' : '绑定' }}</span>
                              </a-button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>


                  <div v-if="counter.setting.three_login_open=='1'">
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">绑定第三方</span></div>
                        <div class="index-module_basic">
                          <div class="index_module_cardItem">
                            <div class="index-module_svgIcon"><img
                                src="@/assets/images/wechat_bind.png"
                                alt=""></div>
                            <div class="index-module_info" v-if="counter.setting.wechat_login=='1'">
                              <div class="index-module_infoTop"><span
                                  class="index-module_label">微信登录</span>
                                <span
                                    class="index-module_bind" v-if="me_info.openid">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>已绑定</span>
                                                                        </span>
                                <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未绑定</span>
                                                                        </span>
                              </div>
                              <div class="index-module_desc"><span
                                  class="index-module_desc"></span>
                                绑定微信快速登录，用户在第三方网站或应用中点击微信登录按钮
                              </div>
                            </div>
                            <div class="index-module_btnWrap">
                              <a-button
                                  @click="me_info.openid?unbind_wechat_s():change_dialog_click()"
                                  class="index-module_btn"
                                  :type="me_info.openid?'secondary':'primary'"
                              ><span>{{ me_info.openid ? '解绑' : '绑定' }}</span>
                              </a-button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </a-tab-pane>
            <a-tab-pane key="wallet">
              <template #title>
                <icon-translate/>
                钱包
              </template>
              <div class="row">

                <div class="col-12 col-md-6">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">{{ counter.setting.money_name_set }}</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col">
                            <span class="h3 mb-0">{{ me_info.money }}</span>

                          </div>
                          <div class="col-auto">
                            <a-space>
                              <a-button
                                  type="primary"
                                  v-if="counter.setting.pay_wechat_open==1 || counter.setting.pay_alipay_open==1 || counter.setting.yzf_open==1"
                                  @click="charge()">充值
                              </a-button>
                              <a-button
                                  type="primary"
                                  status="success"
                                  @click="charge_limit()">购买次数包
                              </a-button>
                            </a-space>

                          </div>
                          <div>
                            <a-alert type="info" class="mt-2" show-icon>
                              {{ counter.setting.money_name_set }}（包含充值+新用户赠送+兑换卡密+签到）可用于购买VIP会员、AI对话、AI绘画等
                            </a-alert>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">卡密兑换</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col mr-2">
                                                            <span class="h3 mb-0">
                                                        <a-input v-model="kami_code"
                                                                 placeholder="请填写卡密信息"></a-input>
                                                    </span>
                          </div>
                          <div class="col-auto">
                            <a-space>
                              <a :href="counter.setting.buy_card"
                                 class="arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-success"
                                 target="_blank"
                              >购买卡密</a>
                              <a-button :loading="kami_loading" type="primary"
                                        @click="change_code()">兑换
                              </a-button>
                            </a-space>

                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="pb-10">
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">购买订单</span>
                        </div>
                        <div class="index-module_basic">

                          <a-table :data="tableData" bordered stripe>
                            <template #columns>
                              <a-table-column data-index="created_at" title="时间"/>
                              <a-table-column data-index="order_id" title="订单编号"/>
                              <a-table-column data-index="amount"
                                              :title="counter.setting.money_name_set"/>
                              <a-table-column title="支付状态">
                                <template #cell="{ record }">
                                  {{ record.status == '0' ? '未支付' : '已支付' }}
                                </template>

                              </a-table-column>
                              <a-table-column title="支付方式">
                                <template #cell="{ record }">
                                  {{ record.way == 'wechat' ? '微信支付' : '支付宝支付' }}
                                </template>
                              </a-table-column>
                            </template>
                          </a-table>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="pb-10">

                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">消耗总览</span>
                        </div>
                        <div class="index-module_basic">

                          <a-table :data="consum" bordered stripe>
                            <template #columns>
                              <a-table-column data-index="id" title="编号"/>
                              <a-table-column :title="'消耗'+counter.setting.money_name_set">
                                <template #cell="{ record }">
                                  <a-tag color="arcoblue">{{ record.balance ? record.balance : '无' }}</a-tag>
                                </template>
                              </a-table-column>
                              <a-table-column title="消耗次数">
                                <template #cell="{ record }">
                                  <a-tag color="green">{{ record.limit ? record.limit : '无' }}</a-tag>
                                </template>
                              </a-table-column>
                              <a-table-column title="类型">
                                <template #cell="{ record }">
                                  {{ consum_type(record.type) }}
                                </template>
                              </a-table-column>
                              <a-table-column data-index="notes" title="描述"/>

                              <a-table-column data-index="created_at" title="时间"/>

                            </template>
                          </a-table>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="vip">
              <template #title>
                <icon-robot-add/>
                VIP会员
              </template>
              <div class="row">
                <div class="col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">总览</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <a-descriptions :column="{xs:1, md:3, lg:4}">
                            <a-descriptions-item label="会员等级">
                              <a-tag color="arcoblue">{{
                                  me_vip ? me_vip.title : '免费会员'
                                }}
                              </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="到期时间">
                              <a-tag color="green">{{
                                  me_vip ? me_vip.expire_time : '永久'
                                }}
                              </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item :label="check_vip_type(vip_type)+'总问答'">
                              <a-tag color="blue">{{
                                  me_vip ? me_vip.limit_send : 0
                                }}
                              </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item :label="check_vip_type(vip_type)+'剩余问答'">
                              <a-tag color="blue">{{ last_msg }}</a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="问答次数包">
                              <a-tag color="blue">{{ user_qs }}</a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item :label="check_vip_type(vip_type)+'总绘画'">
                              <a-tag color="orange">{{
                                  me_vip ? me_vip.limit_draw : 0
                                }}
                              </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item :label="check_vip_type(vip_type)+'剩余绘画'">
                              <a-tag color="orange">{{ last_draw }}</a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="绘画次数包">
                              <a-tag color="orange">{{ user_draw }}</a-tag>
                            </a-descriptions-item>
                          </a-descriptions>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <div class="col-md-3 col-12" v-for="(vs,vs_index) in vip_list"
                         :key="vs_index">
                      <div class="card-body  text-center p-14">
                        <div class="vip_total_info   bg-white p-4 rounded-xl shadow-sm" >
                          <span class="inline-flex  bg-blue-500/20 font-semibold uppercase text-[0.688rem] leading-4 tracking-widest py-1 px-3 rounded-full mb-4">
                            权益会员
                          </span>
                          <h2 class="font-bold uppercase tracking-wide text-center mb-4 text-gray-800 dark:text-slate-400">
                            {{ vs.title }}
                          </h2>
                          <div class="text-base font-medium mb-10 sm:mb-8 lg:mb-10">
                            <span class="flex items-center justify-center">
                              <ins class="text-5xl tracking-tight text-gray-800 font-extrabold no-underline mx-3 dark:text-slate-200">￥{{ vs.discount_price?vs.discount_price:vs.pay_amount }}</ins>
                                <del v-if="vs.discount_price">￥{{ vs.pay_amount }}</del>
                                <span class="text-gray-400">/ {{ vs.end_time }}天</span>

                            </span>
                          </div>
                          <div class="mb-2 sm:mb-0 xl:mb-12 flex flex-col items-center sm:block">
                            <ul role="list" class="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 xl:grid-cols-1">
                              <li class="flex items-center lg:w-64 xl:w-auto text-gray-600 font-semibold  dark:text-slate-500">
                                <svg t="1699188627350" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32794" width="16" height="16"><path d="M0 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#026BFF" p-id="32795"></path><path d="M273.408 540.32a30.464 30.464 0 0 0 0 43.072l136.832 136.864a32 32 0 0 0 45.28 0l299.456-299.488a32 32 0 0 0-45.248-45.248L442.016 643.2a16 16 0 0 1-22.624 0l-102.88-102.88a30.464 30.464 0 0 0-43.104 0z" fill="#FFFFFF" p-id="32796"></path></svg>
                                {{
                                  check_vip_type(vs.type)
                                }}问答：{{ vs.limit_send }}
                                次
                              </li>
                              <li class="flex items-center lg:w-64 xl:w-auto text-gray-600 font-semibold  dark:text-slate-500">
                                <svg t="1699188627350" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32794" width="16" height="16"><path d="M0 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#026BFF" p-id="32795"></path><path d="M273.408 540.32a30.464 30.464 0 0 0 0 43.072l136.832 136.864a32 32 0 0 0 45.28 0l299.456-299.488a32 32 0 0 0-45.248-45.248L442.016 643.2a16 16 0 0 1-22.624 0l-102.88-102.88a30.464 30.464 0 0 0-43.104 0z" fill="#FFFFFF" p-id="32796"></path></svg>
                                {{ check_vip_type(vs.type) }}绘画： {{ vs.limit_draw }} 次
                              </li>
                              <li class="flex items-center lg:w-64 xl:w-auto text-gray-600 font-semibold  dark:text-slate-500">
                                <svg t="1699188627350" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32794" width="16" height="16"><path d="M0 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#026BFF" p-id="32795"></path><path d="M273.408 540.32a30.464 30.464 0 0 0 0 43.072l136.832 136.864a32 32 0 0 0 45.28 0l299.456-299.488a32 32 0 0 0-45.248-45.248L442.016 643.2a16 16 0 0 1-22.624 0l-102.88-102.88a30.464 30.464 0 0 0-43.104 0z" fill="#FFFFFF" p-id="32796"></path></svg>
                                专业售后服务
                              </li>
                              <li class="flex items-center lg:w-64 xl:w-auto text-gray-600 font-semibold  dark:text-slate-500">
                                <svg t="1699188627350" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32794" width="16" height="16"><path d="M0 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#026BFF" p-id="32795"></path><path d="M273.408 540.32a30.464 30.464 0 0 0 0 43.072l136.832 136.864a32 32 0 0 0 45.28 0l299.456-299.488a32 32 0 0 0-45.248-45.248L442.016 643.2a16 16 0 0 1-22.624 0l-102.88-102.88a30.464 30.464 0 0 0-43.104 0z" fill="#FFFFFF" p-id="32796"></path></svg>
                                签到权益
                              </li>
                              <li class="flex items-center lg:w-64 xl:w-auto text-gray-600 font-semibold  dark:text-slate-500">
                                <svg t="1699188627350" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32794" width="16" height="16"><path d="M0 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#026BFF" p-id="32795"></path><path d="M273.408 540.32a30.464 30.464 0 0 0 0 43.072l136.832 136.864a32 32 0 0 0 45.28 0l299.456-299.488a32 32 0 0 0-45.248-45.248L442.016 643.2a16 16 0 0 1-22.624 0l-102.88-102.88a30.464 30.464 0 0 0-43.104 0z" fill="#FFFFFF" p-id="32796"></path></svg>
                                {{
                                  vs.description ? vs.description : '暂无描述'
                                }}
                              </li>
                              <a-button shape="round" type="primary" @click="up_vip_dialog(vs.id)">升级会员</a-button>
                            </ul>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-10">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">会员订单</span>
                      </div>
                      <div class="index-module_basic">

                        <a-table :data="tableVip" bordered stripe>
                          <template #columns>
                            <a-table-column data-index="created_at" title="时间"/>
                            <a-table-column data-index="title" title="标题"/>
                            <a-table-column data-index="order_id" title="订单编号"/>
                            <a-table-column data-index="amount"
                                            :title="counter.setting.money_name_set"/>
                            <a-table-column title="支付状态">
                              <template #cell="{ record }">
                                {{ record.status == '0' ? '未支付' : '已支付' }}
                              </template>
                            </a-table-column>
                            <a-table-column title="支付方式">
                              <template #cell="{ record }">
                                {{
                                  record.way == 'wechat' ? '微信支付' : record.way == 'alipay' ? '支付宝支付' : counter.setting.money_name_set + '支付'
                                }}
                              </template>
                            </a-table-column>
                          </template>
                        </a-table>

                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="invite">
              <template #title>
                <icon-share-alt/>
                邀请码
              </template>
              <div class="row">

                <div class="col-12 col-md-6">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">邀请码</span></div>
                      <div class="index-module_basic">
                        <div class="row align-items-end">
                          <div class="col">
                            <span class="h3 mb-0">{{ invite_code }}</span>
                          </div>
                          <div class="col-auto">
                            <a-space>
                              <a-button
                                  type="primary"
                                  status="warning"
                                  @click="invite_up()">生成邀请码
                              </a-button>
                              <a-button
                                  type="primary"
                                  @click="copy_invite()">复制邀请链接
                              </a-button>
                            </a-space>

                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">邀请二维码</span></div>
                      <div class="index-module_basic">
                        <a-row :gutter="20">
                          <a-col :xs="24" :lg="12">
                            <div class="flex justify-center">
                              <div class="poster poster_invite-1 relative" ref="posterRef">
                                <img src="/images/invite_1.png"  alt="Background Image" />
                                <qrcode-vue class="invite_qrcode-1 absolute" :value="qrLink" :size="90" :bgColor="'#ffffff'" :fgColor="'#000000'" ref="qrcodeRef"></qrcode-vue>
                                <span class="invite_text-1 absolute font-bold font-22 text-white">{{ invite_code }}</span>
                              </div>
                            </div>
                            <a-button class="mt-2 mb-2 w-full" type="primary" @click="downloadPoster('one')">下载海报1号</a-button>

                          </a-col>
                          <a-col :xs="24" :lg="12">
                            <div class="flex justify-center">
                              <div class="poster2 poster_invite-2 relative" ref="posterRef2">
                                <img src="/images/invite_2.png"  alt="Background Image" />
                                <qrcode-vue class="invite_qrcode-2 absolute" :value="qrLink" :size="90" :bgColor="'#ffffff'" :fgColor="'#000000'" ref="qrcodeRef"></qrcode-vue>
                                <span class="invite_text-2 absolute font-bold font-22 text-white">{{ invite_code }}</span>
                              </div>
                            </div>

                            <a-button class="mt-2 w-full" type="primary" @click="downloadPoster('two')">下载海报2号</a-button>

                          </a-col>
                        </a-row>

                      </div>

                    </div>
                  </div>


                </div>
                <div class="col-12 col-md-6">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">邀请奖励</span></div>
                      <div class="index-module_basic">
                        <a-timeline>
                          <a-timeline-item v-for="(ins,ins_index) in invite_set"
                                           :key="ins_index">
                            <a-row :style="{ display: 'inline-flex', alignItems: 'center' }" class="w-full">
                              <div class="flex justify-between w-full">
                                <svg t="1699190009737" class="icon mr-2 v-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34484" width="40" height="40"><path d="M224 640V224a96 96 0 0 1 96-96h384a96 96 0 0 1 96 96V640z" fill="#D0E2FE" p-id="34485"></path><path d="M800 896H224a96 96 0 0 1-96-96V496a32 32 0 0 1 44.3-30l302.8 126.6a95.4 95.4 0 0 0 73.8 0l302.8-126.1a32 32 0 0 1 44.3 30V800a96 96 0 0 1-96 96zM608 256H416a32 32 0 0 0 0 64h192a32 32 0 1 0 0-64zM544 384H480a32 32 0 0 0 0 64h64a32 32 0 1 0 0-64z" fill="#3F86FF" p-id="34486"></path><path d="M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" fill="#FFFFFF" p-id="34487"></path></svg>

                                <div class="invite_info flex-1">
                                  <div :style="{ marginBottom: '12px' }">
                                    邀请人数：{{ ins.invite_c }} 人
                                    <div>
                                      奖励条件：每个邀请用户需充值{{ins.pay_amount}}{{counter.setting.money_name_set}}
                                    </div>
                                    <div :style="{ fontSize: '12px', color: '#4E5969' }">
                                      奖励{{counter.setting.money_name_set}}：<span class="text-blue-500">￥{{ ins.invite_amount }}</span> / 奖励会员： <span class="text-blue-500">{{ ins.vip_info ? ins.vip_info.title : '无' }}</span>
                                    </div>
                                  </div>
                                </div>
                                <a-button type="primary" :loading="invite_loading" @click="teach_user_invite(ins.id)">领取奖励</a-button>
                              </div>


                            </a-row>


                          </a-timeline-item>
                        </a-timeline>
                      </div>

                    </div>

                  </div>

                </div>

                <div class="col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">邀请记录</span>
                      </div>
                      <div class="index-module_basic">

                        <a-table :data="tableInvite" stripe>
                          <template #columns>
                            <a-table-column data-index="created_at" title="时间"/>
                            <a-table-column data-index="invite_user.name" title="下级"/>
                            <a-table-column data-index="user_id" title="下级ID"/>
                            <a-table-column data-index="totalAmount" :title="'充值'+counter.setting.money_name_set"/>
                          </template>
                        </a-table>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </a-tab-pane>
            <a-tab-pane key="signin">
              <template #title>
                <icon-cloud/>
                签到
              </template>
              <div class="row">
                <div class="col-12 col-md-4">
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">
                          <img class="w-80 m-auto" src="@/assets/images/calendar.svg" alt="">
                        </span>
                        </div>
                        <div class="index-module_basic">

                          <ul class="list-group">
                            <li v-for="(si,si_index) in signin_info" :key="si_index"  class="list-group-item items-center flex border-b border-dashed border-slate-200 dark:border-slate-700">
                              <div class="flex items-center my-2">
                                <div class="w-12 h-12 rounded">
                                  <svg t="1699187401772" class="icon mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21054" width="48" height="48"><path d="M508.8256 515.1232m-450.816 0a450.816 450.816 0 1 0 901.632 0 450.816 450.816 0 1 0-901.632 0Z" fill="#E9F4FF" p-id="21055"></path><path d="M720.384 271.4624h-70.4512v-11.4176c0-14.2848-11.9808-25.856-26.7776-25.856-14.7968 0-26.7776 11.5712-26.7776 25.856v11.4176h-177.152v-11.4176c0-14.2848-11.9808-25.856-26.7776-25.856s-26.7776 11.5712-26.7776 25.856v11.4176h-72.704c-40.0384 0-72.448 31.3344-72.448 69.9904v386.2528c0 38.656 32.4608 69.9904 72.448 69.9904h427.4176c40.0384 0 72.448-31.3344 72.448-69.9904V341.4528c0-38.656-32.4096-69.9904-72.448-69.9904z m-63.8464 274.9952l-170.1888 162.816a30.75072 30.75072 0 0 1-43.0592-0.512l-92.672-93.3376c-11.9808-12.032-11.8784-31.488 0.1536-43.4688 12.032-11.9808 31.488-11.8784 43.4688 0.1536l71.4752 71.8848 148.4288-141.9776a30.67904 30.67904 0 0 1 43.4176 0.9728c11.6736 12.288 11.2128 31.744-1.024 43.4688z m78.336-153.344c0 9.6768-8.1408 17.5104-18.1248 17.5104H296.6528c-10.0352 0-18.1248-7.8336-18.1248-17.5104v-48.64c0-9.6768 8.1408-17.5104 18.1248-17.5104h69.0688v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856s26.7776-11.5712 26.7776-25.856v-15.2064h177.2032v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856 14.7968 0 26.7776-11.5712 26.7776-25.856v-15.2064h66.816c10.0352 0 18.1248 7.8336 18.1248 17.5104v48.64z" fill="#2595E8" p-id="21056"></path><path d="M792.832 341.4528c0-38.656-32.4608-69.9904-72.448-69.9904h-70.4512v-11.4176c0-14.2848-11.9808-25.856-26.7776-25.856-14.7968 0-26.7776 11.5712-26.7776 25.856v11.4176h-177.152v-11.4176c0-14.2848-11.9808-25.856-26.7776-25.856s-26.7776 11.5712-26.7776 25.856v11.4176h-72.704c-40.0384 0-72.448 31.3344-72.448 69.9904v386.2528c0 38.656 32.4608 69.9904 72.448 69.9904h252.3648c110.4384-43.3664 199.5776-129.024 247.5008-237.056V341.4528z m-136.2944 205.0048l-170.1888 162.816a30.75072 30.75072 0 0 1-43.0592-0.512l-92.672-93.3376c-11.9808-12.032-11.8784-31.488 0.1536-43.4688 12.032-11.9808 31.488-11.8784 43.4688 0.1536l71.4752 71.8848 148.4288-141.9776a30.67904 30.67904 0 0 1 43.4176 0.9728c11.6736 12.288 11.2128 31.744-1.024 43.4688z m78.336-153.344c0 9.6768-8.1408 17.5104-18.1248 17.5104H296.6528c-10.0352 0-18.1248-7.8336-18.1248-17.5104v-48.64c0-9.6768 8.1408-17.5104 18.1248-17.5104h69.0688v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856s26.7776-11.5712 26.7776-25.856v-15.2064h177.2032v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856 14.7968 0 26.7776-11.5712 26.7776-25.856v-15.2064h66.816c10.0352 0 18.1248 7.8336 18.1248 17.5104v48.64z" fill="#3A9CED" p-id="21057"></path><path d="M257.3312 668.6208c44.3904 0 87.296-6.4512 127.7952-18.432l-34.56-34.7648c-11.9808-12.032-11.8784-31.488 0.1536-43.4688 12.032-11.9808 31.488-11.8784 43.4688 0.1536l53.9136 54.2208c94.976-44.4416 171.9296-120.9856 216.832-215.7056H296.6528c-10.0352 0-18.1248-7.8336-18.1248-17.5104v-48.64c0-9.6768 8.1408-17.5104 18.1248-17.5104h69.0688v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856s26.7776-11.5712 26.7776-25.856v-15.2064h177.2032v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856 14.7968 0 26.7776-11.5712 26.7776-25.856v-15.2064h44.9024c4.5056-18.0736 7.8848-36.608 10.1376-55.4496h-54.9888V260.096c0-14.2848-11.9808-25.856-26.7776-25.856-14.7968 0-26.7776 11.5712-26.7776 25.856v11.4176H419.2256V260.096c0-14.2848-11.9808-25.856-26.7776-25.856s-26.7776 11.5712-26.7776 25.856v11.4176h-72.704c-40.0384 0-72.448 31.3344-72.448 69.9904v325.6832c12.1344 0.9216 24.4224 1.4336 36.8128 1.4336z" fill="#59ADF8" p-id="21058"></path><path d="M425.1136 410.624H296.6528c-10.0352 0-18.1248-7.8336-18.1248-17.5104v-48.64c0-9.6768 8.1408-17.5104 18.1248-17.5104h69.0688v15.2064c0 14.2848 11.9808 25.856 26.7776 25.856s26.7776-11.5712 26.7776-25.856v-15.2064h86.784c13.056-17.5616 24.832-36.096 35.2256-55.4496H419.2256V260.096c0-14.2848-11.9808-25.856-26.7776-25.856s-26.7776 11.5712-26.7776 25.856v11.4176h-72.704c-40.0384 0-72.448 31.3344-72.448 69.9904v161.1264A449.47968 449.47968 0 0 0 425.1136 410.624z" fill="#6BC2FC" p-id="21059"></path></svg>
                                </div>
                                <div class="ml-2">
                                  <a class="cursor-pointer hover:text-gray-900 focus:text-gray-500 text-gray-800 dark:text-gray-100 focus:outline-none">
                                    <h5 class=" font-medium text-sm">{{ si.title }}</h5>
                                  </a>
                                  <p class="focus:outline-none text-gray-500 dark:text-gray-400 text-xs font-medium">
                                    获得{{counter.setting.money_name_set}}：<span class="text-blue-500">￥{{
                                      si.balance
                                    }}</span>
                                    / 获得会员：<span class="text-blue-500">{{
                                      si.vip_info ? si.vip_info.title : '暂无'
                                    }}</span>
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <a-button :disabled="is_signin" size="large"  class="w-100" v-if="is_signin">已经签到</a-button>
                        <a-button v-else type="primary" size="large" class="w-100" @click="go_signin()"
                                  :loading="signin_loading">
                          <template #icon>
                            <icon-location />
                          </template>
                          立即签到
                        </a-button>
                      </div>



                    </div><!--end card-body-->
                </div>
                <div class="col-12 col-md-8">
                  <div class="card-body">
                    <a-calendar class="bg-white mb-2">
                    </a-calendar>

                  </div>

                </div>
                <div class="col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header "><span
                          class="index-module_title">签到记录</span>
                      </div>
                      <div class="index-module_basic">

                        <a-table :data="sign_me_info" stripe style="width: 100%">
                          <template #columns>
                            <a-table-column data-index="created_at" title="时间"/>
                            <a-table-column data-index="balance"
                                            :title="counter.setting.money_name_set"/>
                            <a-table-column title="会员名称">
                              <template #cell="{ record }">
                                {{ record.vip_info ? record.vip_info.title : '暂无' }}
                              </template>
                            </a-table-column>
                            <a-table-column data-index="description" title="描述"/>
                          </template>
                        </a-table>

                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </a-tab-pane>
            <a-tab-pane key="task" v-if="counter.setting.task_open=='1'">
              <template #title>
                <icon-layers/>
                任务
              </template>
              <div class="mr-4 ml-4">
                <a-alert>每日任务：每天只能完成一次，成长任务：自注册后只可完成一次</a-alert>

              </div>

              <div class="row pb-10">
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">每日任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.day_send_guanzhu }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/guanzhu.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">关注作者</span>

                              <span
                                  class="index-module_bind" v-if="task_list.fans>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              在平台上关注任意一个作者即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('fans')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.fans > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">每日任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.day_send_draw }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/like.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">点赞绘画</span>
                              <span
                                  class="index-module_bind" v-if="task_list.like>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              点赞其他用户发布的任意一个作品即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('like')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.like > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">每日任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.day_send_edraw }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/ai_draw.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">创作作品</span>
                              <span
                                  class="index-module_bind" v-if="task_list.ai_draw>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              创作任意一个作品即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('ai_draw')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.like > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">每日任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.day_send_app }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/ai_application.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">创作小应用</span>
                              <span
                                  class="index-module_bind" v-if="task_list.ai_app>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              创建一个AI小应用并通过审核即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('ai_app')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.ai_app > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">成长任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.total_edit_user }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/edit.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">完善资料</span>
                              <span
                                  class="index-module_bind" v-if="task_list.users>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              完善个人资料，上传头像即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('users')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.users > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-6 a-col-12">
                  <div class="card-body">
                    <div class="index_module_card index_module_card_pw60">
                      <div class="index-module_header relative"><span
                          class="index-module_title">成长任务</span>
                        <div class="flex absolute right-5 top-5 align-items-center">
                          <svg t="1691509461424" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="65316" width="24" height="24">
                            <path
                                d="M512 36.571429c262.582857 0 475.428571 212.845714 475.428571 475.428571S774.582857 987.428571 512 987.428571 36.571429 774.582857 36.571429 512 249.417143 36.571429 512 36.571429z m70.546286 226.450285c-28.470857-56.941714-108.653714-58.093714-139.245715-3.474285l-1.828571 3.474285-39.405714 78.793143a134.710857 134.710857 0 0 1-55.094857 57.545143l-5.138286 2.706286-78.811429 39.387428c-56.941714 28.470857-58.093714 108.672-3.474285 139.227429l3.474285 1.846857 78.811429 39.405714a134.710857 134.710857 0 0 1 57.508571 55.094857l2.724572 5.156572 39.387428 78.774857c28.470857 56.96 108.653714 58.130286 139.245715 3.474286l1.828571-3.474286 39.405714-78.774857a134.710857 134.710857 0 0 1 55.094857-57.526857l5.138286-2.724572 78.811429-39.405714c56.941714-28.452571 58.093714-108.635429 3.474285-139.227429l-3.474285-1.828571-78.811429-39.405714a134.729143 134.729143 0 0 1-57.508571-55.113143l-2.724572-5.138286-39.387428-78.811428z m-13.385143 260.699429a21.302857 21.302857 0 0 1 28.672-9.398857c10.514286 5.339429 14.701714 18.212571 9.380571 28.745143a120.832 120.832 0 0 1-107.885714 66.450285 120.813714 120.813714 0 0 1-106.715429-64.237714 21.412571 21.412571 0 0 1 8.777143-28.946286 21.302857 21.302857 0 0 1 28.873143 8.813715 78.171429 78.171429 0 0 0 138.898286-1.426286z"
                                fill="#1677FF" p-id="65317"></path>
                          </svg>
                          {{ counter.setting.total_bind_user }}
                        </div>
                      </div>
                      <div class="index-module_basic">
                        <div class="index_module_cardItem">
                          <div class="index-module_svgIcon"><img
                              src="@/assets/images/task/safe.png"
                              alt=""></div>
                          <div class="index-module_info">
                            <div class="index-module_infoTop"><span
                                class="index-module_label">绑定邮箱/手机号</span>
                              <span
                                  class="index-module_bind" v-if="task_list.user_bind>0">
                                                                            <img
                                                                                src="@/assets/images/success.svg"
                                                                                alt="">

                                                                            <span>完成</span>
                                                                        </span>
                              <span class="index-module_unbind" v-else>
                                                                            <img
                                                                                src="@/assets/images/warning.svg"
                                                                                alt="">
                                                                            <span>未完成</span>
                                                                        </span>
                            </div>
                            <div class="index-module_desc"><span
                                class="index-module_desc"></span>
                              绑定邮箱或手机号即可完成任务
                            </div>
                          </div>
                          <div class="index-module_btnWrap">
                            <a-button
                                @click="complete_task('user_bind')"
                                class="index-module_btn"
                                type="primary"
                            ><span>{{ task_list.user_bind > 0 ? '立即领取' : '未完成' }}</span>
                            </a-button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="pb-10">
                    <div class="card-body">
                      <div class="index_module_card index_module_card_pw60">
                        <div class="index-module_header "><span
                            class="index-module_title">任务记录</span>
                        </div>
                        <div class="index-module_basic">
                          <a-table :data="task_table" bordered stripe>
                            <template #columns>
                              <a-table-column data-index="created_at" title="时间"/>
                              <a-table-column data-index="title" title="任务名称"/>
                              <a-table-column data-index="amount"
                                              :title="'获取'+counter.setting.money_name_set"/>
                              <a-table-column data-index="description" title="描述"/>
                            </template>
                          </a-table>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="api_manage" v-if="counter.setting.api_manage_open=='1'">
              <template #title>
                <icon-thunderbolt />
                开放平台
              </template>
              <div class="mr-4 ml-4">
                <a-alert>开放平台：针对用户POST进行问答流式输出对话</a-alert>

              </div>

              <div class="bg-white rounded-lg shadow-md p-6 m-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-semibold">API 管理平台</h1>
        <div class="flex items-center gap-2">
          <a-button type="primary" @click="dialogFormVisibleApikey=true">创建API密钥</a-button>
        </div>
      </div>
      <a-modal v-model:visible="dialogFormVisibleApikey" title="创建API密钥">
        <a-alert class="mb-2">速率为每分钟QS</a-alert>
        <a-form :model="formApieky" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="API速率">
            <a-input-number v-model="formApieky.rate" />
          </a-form-item>
        </a-form>
        <template #footer>
          <a-space>
            <a-button @click="dialogFormVisibleApikey = false">取消</a-button>
            <a-button type="primary" @click="createAPIKey">创建</a-button>
          </a-space>
        </template>
      </a-modal>


      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-100 p-4 rounded-lg text-center">
          <h2 class="text-lg font-semibold mb-2">如何使用API</h2>
          <p class="text-sm text-gray-500 mb-4">
            创建属于你自己的API密钥，然后使用我们的API文档来开始使用API
          </p>
          <button class="bg-blue-600 text-white py-2 px-4 rounded-lg" @click="checkDialog=true">查看文档</button>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg text-center">
          <h2 class="text-lg font-semibold mb-2">开发者工具</h2>
          <p class="text-sm text-gray-500 mb-4">
            使用我们的开发者工具来测试你的API密钥，查看请求和响应
          </p>
          <button class="bg-blue-600 text-white py-2 px-4 rounded-lg" @click="submitForm()" :loading="send_loading">测试接口</button>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <div class="flex items-center gap-4">
          <i class="fas fa-lock text-blue-500 text-2xl"></i>
          <div>
            <h3 class="text-lg font-semibold">测试返回结果</h3>
            <div class="text-sm text-gray-500" v-html="renderMarkdown(me_message)"></div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">接口信息</h3>

      </div>
      <a-table :columns="columns" :data="api_list">
        <template #action="{record}">
          <a-space>
            <a-button type="primary" status="danger" @click="deleteApikey(record.id)">删除</a-button>
          </a-space>
        </template>
      </a-table>


    </div>
            </a-tab-pane>
          </a-tabs>
        </div>

      </div>
    </div>
    <a-modal v-model:visible="checkDialog" title="API文档">
      <div class="flex flex-col">
        <div class="post-apikey">
          <a-tag color="orange">POST</a-tag>
          <a-tag class="ml-2">请求地址:{{full_url}}/api/send_apikey_bot</a-tag>
        </div>
        <div class="header-apikey mt-2">
          <a-tag color="blue">Header</a-tag>
          <a-tag class="ml-2">NiceApiKey: 你的API密钥</a-tag>
        </div>
        <div class="body-apikey mt-2">
          <a-tag color="green">Body</a-tag>
          <a-tag class="ml-2">{
            "info": "你的问题",
            "model": "模型名称"
          }</a-tag>
        </div>
      </div>

    </a-modal>
      <a-modal v-model:visible="dialogFormVisible"
               :title="counter.setting.money_name_set+'充值'">
          <a-spin :loading="qr_load">
              <div class="qr_fing relative">
                  <div class="absolute pay_over" v-if="qr_show && pay_now_type!='paying'">
                      <h4 class="text-white" v-if="pay_now_type=='success'">
                          <p class="text-green-400 text-center">
                              <icon-check/>
                          </p>
                          支付成功
                      </h4>
                      <h4 class="text-white" v-else-if="pay_now_type=='time_out'">
                          <p class="text-red-400 text-center">
                              <icon-close/>
                          </p>
                          超时未支付
                      </h4>
                  </div>
                  <qrcode-vue v-if="qr_show" :value="pay_scan" size="240"
                              class="mt-2 mb-2 m-auto d-sm-block">

                  </qrcode-vue>
                  <h4 class="text-center time_in" v-if="qr_show">
                      「
                      <a-countdown
                          :value="Date.now() + 5 * 60 * 1000"
                          format="HH:mm:ss"
                          :now="Date.now()"
                          :start="start"
                          @finish="handleFinish"
                      />
                      」
                  </h4>
              </div>
          </a-spin>

          <a-form :model="form">
              <a-form-item label="充值">
                  <a-input-number :step="0.01" v-model="form.amount" autocomplete="off"
                                  :precision="2"
                                  :min="parseFloat(counter.setting.min_recharge)"
                                  placeholder="请输入充值金额"/>
              </a-form-item>
              <a-form-item label="支付方式">
                  <a-radio-group v-model="form.pay_type">
                      <a-radio v-if="counter.setting.pay_wechat_open==1" value="wechat">微信
                      </a-radio>
                      <a-radio v-if="counter.setting.pay_alipay_open==1" value="alipay">支付宝
                      </a-radio>
                      <a-radio v-if="counter.setting.yzf_open==1 && counter.setting.yzf_wechat_open=='1'" value="yzf_wechat">微信
                      </a-radio>
                      <a-radio v-if="counter.setting.yzf_open==1 && counter.setting.yzf_alipay_open=='1'" value="yzf_alipay">支付宝
                      </a-radio>
                  </a-radio-group>
              </a-form-item>

          </a-form>
          <template #footer>
                                      <span class="dialog-footer">
                                          <a-space>
                                              <a-button type="primary" @click="send_charge()" :loading="charge_loading">
                                          立即充值
                                        </a-button>
                                          <a-button type="primary" status="warning" @click="dialogm()">
                                              完成支付
                                          </a-button>
                                          </a-space>

                                      </span>
          </template>
      </a-modal>
      <a-modal v-model:visible="dialogVip"
               class="vip_mb"
               title="会员升级"
      >
          <a-alert show-icon>
              选择好VIP套餐后，点击立即升级生成二维码支付！
          </a-alert>

          <a-spin :loading="qr_load">
              <div class="qr_fing relative">
                  <div class="absolute pay_over" v-if="qr_show && pay_now_type!='paying'">
                      <h4 class="text-white" v-if="pay_now_type=='success'">
                          <p class="text-green-400 text-center">
                              <icon-check/>
                          </p>
                          支付成功
                      </h4>
                      <h4 class="text-white" v-else-if="pay_now_type=='time_out'">
                          <p class="text-red-400 text-center">
                              <icon-close/>
                          </p>
                          超时未支付
                      </h4>
                  </div>
                  <qrcode-vue v-if="qr_show" :value="pay_scan" size="240"
                              class="mt-2 mb-2 m-auto d-sm-block">

                  </qrcode-vue>
                  <h4 class="text-center time_in" v-if="qr_show">
                      「
                      <a-countdown
                          :value="Date.now() + 5 * 60 * 1000"
                          format="HH:mm:ss"
                          :now="Date.now()"
                          :start="start"
                          @finish="handleFinish"
                      />
                      」
                  </h4>
              </div>
          </a-spin>

          <a-form :model="form">
              <a-form-item label="购买会员">
                  <a-radio-group @change="changeRadio" v-model="form.vip_type">
                      <template v-for="(item,index) in vip_list" :key="index">
                          <a-radio :value="item.id" class="w-40">
                              <template #radio="{ checked }">
                                  <a-space
                                      align="start"
                                      class="custom-radio-card"
                                      :class="{ 'custom-radio-card-checked': checked }"
                                  >
                                      <div className="custom-radio-card-mask">
                                          <div className="custom-radio-card-mask-dot"/>
                                      </div>
                                      <div>
                                          <div>
                                              {{ item.end_time }} 天
                                          </div>
                                          <div className="custom-radio-card-title mt-2">
                                              {{ item.title }}
                                          </div>
                                          <div>
                                              <p>{{ check_vip_type(item.type) }}问答:{{ item.limit_send }}</p>
                                              {{ check_vip_type(item.type) }}绘画:{{ item.limit_draw }}
                                          </div>

                                          <a-typography-text type="secondary" >
                                            <div v-if="item.discount_price">
                                              <del>￥{{ item.pay_amount }}</del> ￥ {{item.discount_price}}
                                            </div>
                                            <div v-else>
                                              ￥{{ item.pay_amount }}
                                            </div>
                                          </a-typography-text>
                                      </div>
                                  </a-space>
                              </template>
                          </a-radio>

                      </template>
                  </a-radio-group>
              </a-form-item>
              <a-form-item label="支付方式">
                  <a-radio-group v-model="form.pay_type">
                      <a-radio v-if="counter.setting.pay_wechat_open==1" value="wechat">微信
                      </a-radio>
                      <a-radio v-if="counter.setting.pay_alipay_open==1" value="alipay">支付宝
                      </a-radio>
                      <a-radio v-if="counter.setting.yzf_open==1 && counter.setting.yzf_wechat_open=='1'" value="yzf_wechat">微信
                      </a-radio>
                      <a-radio v-if="counter.setting.yzf_open==1 && counter.setting.yzf_alipay_open=='1'" value="yzf_alipay">支付宝
                      </a-radio>
                      <a-radio value="balance">{{ counter.setting.money_name_set }}</a-radio>
                  </a-radio-group>
              </a-form-item>
              <a-form-item label="优惠卷">
                  <a-input v-model="form.kami" placeholder="请输入优惠卷码"></a-input>
              </a-form-item>
          </a-form>
          <template #footer>
                                      <span class="dialog-footer">
                                          <a-space>
                                              <a-button type="primary" @click="up_to_vip()">立即升级</a-button>
                                                <a-button type="primary" status="warning" plain @click="dialogv()">
                                                  完成支付
                                                </a-button>
                                          </a-space>

                                      </span>
          </template>
      </a-modal>
    <a-modal class="msgbox" v-model:visible="chargeDialog" title="次数包">

      <a-form :model="form">
        <a-form-item label="购买">
          <a-radio-group @change="changeLimitRadio" v-model="form.limit_bag_id">
            <template v-for="(item,index) in limit_list" :key="index">
              <a-radio  :value="item.id" class="w-40">
                <template #radio="{ checked }">
                  <a-space
                      align="start"
                      class="custom-radio-card"
                      :class="{ 'custom-radio-card-checked': checked }"
                  >
                    <div className="custom-radio-card-mask">
                      <div className="custom-radio-card-mask-dot" />
                    </div>
                    <div>
                      <div className="custom-radio-card-title mt-2">
                        {{ item.title }}
                      </div>
                      <div>
                        <p>问答:{{item.qs}}</p>
                        绘画:{{item.draw}}
                      </div>

                      <a-typography-text type="secondary">
                        ￥{{ item.cost }}
                      </a-typography-text>
                    </div>
                  </a-space>
                </template>
              </a-radio>

            </template>
          </a-radio-group>              </a-form-item>
        <a-form-item label="支付方式">
          <a-radio-group v-model="form.pay_type">
            <a-radio value="balance">{{counter.setting.money_name_set}}</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
      <template #footer>
        <a-space class="dialog-footer">
          <a-button type="primary" @click="buy_limit_bag()" :loading="charge_loading">
            立即充值
          </a-button>
          <a-button type="primary" plain @click="dialogm()">
            完成支付
          </a-button>
        </a-space>
      </template>
    </a-modal>
      <Wechat :change_wechat="change_wechat" @handleCancel="handleCancel"/>
  </div>



</template>
<script setup lang="ts">
import markdownIt from "markdown-it";

definePageMeta({
  middleware: ['islogin']
})
import {ref, reactive,onMounted} from 'vue'
import {useCounter} from '~/store/counter'
import QrcodeVue from 'qrcode.vue'
import {Message, Notification, Descriptions} from "@arco-design/web-vue";

import {
  IconMobile,
  IconRelation,
  IconFire,
  IconMessage,
  IconHighlight,
  IconUser,
  IconTranslate,
  IconLayers,
  IconShareAlt,
  IconCloud,
  IconImport,
  IconMenuUnfold,
  IconMenuFold,
  IconCheck,
  IconClose,
  IconDelete,
  IconRobotAdd,
  IconLocation,
  IconHome
} from "@arco-design/web-vue/es/icon";


const collapsed = ref(false);
const pay_now_type = ref('paying')
const onCollapse = () => {
  collapsed.value = !collapsed.value;
};
const counter = useCounter()
const start = ref(false);
const handleFinish = () => {
  pay_now_type.value = 'time_out'
};
useHead({
  title: '个人中心 - ' + counter.setting.title,
  meta: [
    {name: 'description', content: counter.setting.description},
    {name: 'keywords', content: counter.setting.keywords}
  ]
})

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

const full_url = ref('') as any
if (process.client) {
  full_url.value = window.location.origin
} else {
  full_url.value = ''
}
const change_wechat = ref(false)
const change_dialog_click = () => {
  change_wechat.value = true
}
const scene_preset = ref(false)
const handleCancel = () => {
  change_wechat.value = false
}
const token = useCookie('token')
const counter_remove = useCookie('counter')
const router = useRouter()
const user_info = useCookie('user_info')
const actions = counter.setting.APP_URL + '/api/upload_avatar'
const c_change = ref('me')
const me_info = ref({
  name: '',
  phone: '',
  description: '',
})
const tableData = ref([])
const tableVip = ref([])
const s_loading = ref(false)
const up_loading = ref(false)
const now_loading = ref(true)
const me_vip = ref({})
const invite_set = ref([])
const sigt_out = () => {
  token.value = ''
  user_info.value = ''
  Message.success('退出成功')
  router.push('/')
}
const unbind_wechat_s = ()=>{
  unbind_wechat().then((res:any)=>{
    if(res._rawValue.status==200){
      Message.success('解绑成功')
      now_user()
    }
  }).catch((err:any)=>{
    console.log(err)
  })
}
const demo = ref(null)
const dingVerify = () => {
  _dx.Captcha(demo.value, {
    // appId, 在控制台应用管理或应用配置模块获取
    appId: counter.setting.dingxiang_id,
    apiServer: counter.setting.dingxiang_api,
    style: "embed",
    width: '100%',
    // apiServer域名地址在控制台页面->无感验证->应用管页面左上角获取，必须填写完整包括https://。
    success: (token: any) => {
      // 获取验证码token，用于后端校验，注意获取token若是sl开头的字符串，则是前端网络不通生成的降级token,请检查前端网络及apiServer地址。
      onSuccess();
    },
    fail: (code: any, msg: any) => {
      // 用户关闭验证码弹窗，进行自定义处理
      onFail();
    }
  });
}
const sign_all = ref([])
import cap_1 from '~/assets/images/captcha-1.png'
import cap_2 from '~/assets/images/captcha.png'
import cap_3 from '~/assets/images/captcha-2.png'
import {
  buy_limit_bags,
  charge_limit_bag,
  teach_invite,
  unbind_wechat,
  user_api_create,
  user_api_list,
  yzf_pay
} from "~/utils/api";

const imgs = ref([
  cap_1,
  cap_2,
  cap_3
])
const msg = ref("");
const block = ref();

const onAgain = () => {
  Message.error("检测到非人为操作的哦！ try again");
  // 刷新
  block.value?.refresh();
};
const captcha_v = ref(false)
const verify_code = ref('')
const flesh_type = ref('email')
const check_verify = (type: any) => {
  flesh_type.value = type
  if (type == 'email') {
    if (email_form.email == '') {
      Message.error('请填写邮箱')
      return
    }
    if (counter.setting.register_slide_open == '1') {

      generate_cap({
        type: 'email',
        email: email_form.email
      }).then((res: any) => {
        if (res._rawValue.status == 200) {
          block.value?.refresh();
          captcha_v.value = true
          verify_code.value = res._rawValue.data
          dingVerify()
        }
      }).catch((err: any) => {
        console.log(err)
      })
    } else {
      send_e_code();
    }

  } else {
    if (phone_form.phone == '') {
      Message.error('请填写手机号')
      return
    }
    if (counter.setting.register_slide_open == '1') {
      generate_cap({
        type: 'phone',
        phone: phone_form.phone
      }).then((res: any) => {
        if (res._rawValue.status == 200) {
          block.value?.refresh();
          captcha_v.value = true
          verify_code.value = res._rawValue.data
          dingVerify()
        }
      }).catch((err: any) => {
        console.log(err)
      })
    } else {
      send_p_code();
    }

  }
}
const onSuccess = (times: number) => {
  captcha_v.value = false
  if (flesh_type.value == 'email') {
    send_e_code();
  } else {
    send_p_code();
  }
};

const onFail = () => {
  Message.error("验证不通过");
};

const onRefresh = () => {
  Message.info("刷新图形");
};

const handleClick = () => {
  // 刷新
  block.value?.refresh();
  msg.value = "";
};
const formatTime = (time: any) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return `${year}-${month}-${day}`
}
const last_msg = ref(0)
const last_draw = ref(0)
const is_signin = ref(false)
const vip_type = ref('free')
const total_token  = ref(0)
const yes_token = ref(0)
const today_cost = ref(0)
const user_qs = ref(0)
const user_draw = ref(0)
const now_user = () => {
  s_loading.value = true
  now_loading.value = true
  get_user().then((res: any) => {
    me_info.value = res._rawValue.data
    me_vip.value = res._rawValue.vip
    tableData.value = res._rawValue.order
    tableVip.value = res._rawValue.v_order
    invite_code.value = res._rawValue.data.invite_code
    tableInvite.value = res._rawValue.invite_meta
    invite_set.value = res._rawValue.invite_set
    sign_all.value = res._rawValue.sign
    last_msg.value = res._rawValue.last_msg
    last_draw.value = res._rawValue.last_draw
    vip_type.value = res._rawValue.vip_type
    total_token.value = res._rawValue.total_token
    yes_token.value = res._rawValue.yes_token
    today_cost.value = res._rawValue.today_cost
    user_qs.value = res._rawValue.user_qs
    user_draw.value = res._rawValue.user_draw
    s_loading.value = false
    now_loading.value = false
    qrLink.value = full_url.value + '/login?invite_code=' + invite_code.value
  }).catch((err: any) => {
    s_loading.value = false
    now_loading.value = false
    console.log(err)
  })
}
now_user()
const invite_loading= ref(false)
const teach_user_invite=  (ids:any)=>{
  invite_loading.value = true
  teach_invite({
    invite_id:ids
  }).then((res:any)=>{
    Message.success('领取成功')
    invite_loading.value = false
    now_user()
  }).catch((err:any)=>{
    console.log(err)
    invite_loading.value = false
  })
}
const check_vip_type = (type: string) => {
  if (type == 'free') {
    return '免费'
  } else if (type == 'day') {
    return '每日'
  } else if (type == 'month') {
    return '每月'
  } else if (type == 'total') {
    return '有效期内'
  } else {
    return '免费'
  }
}
const signins_check = () => {
  signin_check().then((res: any) => {
    is_signin.value = res._rawValue.data
  }).catch((err: any) => {
    console.log(err)
  })
}
signins_check()
const vip_list = ref([])
const vip_tab_list = ref([])
const get_vip = () => {
  get_vip_show().then((res: any) => {
    vip_list.value = res._rawValue.data
    vip_tab_list.value = res._rawValue.data
    vip_ids.value = res._rawValue.data[0].id
    vip_now_money.value = res._rawValue.data[0].pay_amount
  }).catch((err: any) => {
    Message.error('获取失败')
  })
}
get_vip()
const consum_type = (type: any) => {
  switch (type) {
    case 'gpt':
      return '聊天'
    case 'draw':
      return '绘画'
    case 'midjourney':
      return 'Midjourney'
    case 'app':
      return '小应用'
    case 'mindmap':
      return '思维导图'
    case 'write':
      return 'AI写作'
    case 'pdf':
      return 'PDF转换'
    case 'fly':
      return '星火'
    case 'baidu':
      return '百度'
    case 'qwen':
      return '通义千问'
    case 'chatglm':
      return '智谱'
    case 'tencent':
      return '混元'
    case 'kimi':
      return 'Kimi'
  }
}
const consum = ref([])
const all_limit_get = () => {
  get_consum_limit().then((res: any) => {
    consum.value = res._rawValue.data
  }).catch((err: any) => {
    console.log(err)
  })
}
all_limit_get()
const change_set = (options: string) => {
  c_change.value = options
}


const update_info = () => {
  up_loading.value = true
  update_user({
    name: me_info.value.name,
    description: me_info.value.description,
  }).then((res: any) => {
    // now_user()
    up_loading.value = false
    Message.success('修改成功')
  }).catch((err: any) => {
    up_loading.value = false
    console.log(err)
  })
}
const pass_loading = ref(false)
const pass_all = ref({
  old_password: '',
  new_password: '',
  new_password_confirmation: '',
})
const computed_register= (user_time: any, days: any)=>{
  // 获取当前日期
  let currentDate = new Date();
  let userDate = typeof user_time === 'string' ? new Date(user_time) : user_time;

// 计算 dateVar 和当前日期之间的毫秒数差
  let diff = currentDate.getTime() - userDate.getTime();

// 将毫秒数差转换为天数
  let diffDays = diff / (1000 * 60 * 60 * 24);
// 判断 dateVar 是否在 numVar 天内
  if (diffDays <= days) {
    return true
  } else {
    return false
  }
}
const c_pass = () => {
  pass_loading.value = true
  if (pass_all.value.old_password == '') {
    Message.error('请输入旧密码')
    pass_loading.value = false
    return false
  }
  if (pass_all.value.new_password == '') {
    Message.error('请输入新密码')
    pass_loading.value = false
    return false
  }
  if (pass_all.value.new_password_confirmation == '') {
    Message.error('请输入确认密码')
    pass_loading.value = false
    return false
  }
  if (pass_all.value.new_password != pass_all.value.new_password_confirmation) {
    Message.error('两次密码不一致')
    pass_loading.value = false
    return false
  }
  change_password({
    password: pass_all.value.old_password,
    new_password: pass_all.value.new_password,
  }).then((res: any) => {
    pass_loading.value = false
    Message.success('修改成功')
    pass_all.value = {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    }
  }).catch((err: any) => {
    pass_loading.value = false
    console.log(err)
  })
}

const dialogFormVisible = ref(false)
const form = reactive({
  amount: counter.setting.min_recharge ? parseInt(counter.setting.min_recharge) : 1,
  pay_type: counter.setting.pay_wechat_open == 1 ? 'wechat' : (counter.setting.pay_alipay_open == 1 ? 'alipay' : 'balance'),
  vip_type: 1,
  kami: '',
  limit_bag_id:'',
})
const charge = () => {
  dialogFormVisible.value = true
}
const pay_scan = ref('')
const charge_loading = ref(false)
const qr_load = ref(false)
const qr_show = ref(false)
let time_check_status = ref('') as any
const send_charge = () => {
  if (form.amount == 0) {
    Message.error('请输入充值' + counter.setting.money_name_set)
    return
  }
  clearInterval(time_check_status.value)
  charge_loading.value = true
  qr_load.value = true
  qr_show.value = true
  const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);

  if (form.pay_type == 'alipay') {
    alipay({
      amount: form.amount,
      type: 'charge',
      is_mobile: isMobile && counter.setting.alipay_wap_open == '1' ? 1 : 0

    }).then((res: any) => {
      if (isMobile && counter.setting.alipay_wap_open == '1') {
        console.log('mobile')
        window.location.href = res._rawValue.pay_url
      } else {
        console.log('pc')
        start.value = true
        pay_now_type.value = 'paying'
        pay_scan.value = res._rawValue.qr_code
        time_check_status.value = setInterval(() => {
          check_order_status({
            order_id: res._rawValue.order_id
          }).then((res: any) => {
            if (res._rawValue.status == 200) {
              clearInterval(time_check_status.value)
              pay_now_type.value = 'success'
              now_user()
              dialogFormVisible.value = false
              Message.success('充值成功')
              start.value = false
            }
          }).catch((err: any) => {
            clearInterval(time_check_status.value)
            console.log(err)
          })
        }, 5000)
      }
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  } else if (form.pay_type == 'wechat') {
    wechat({
      amount: form.amount,
      type: 'charge',
      is_mobile: isMobile && counter.setting.wechat_wap_open == '1' ? 1 : 0
    }).then((res: any) => {
      if (isMobile && counter.setting.wechat_wap_open == '1') {
        console.log('mobile')
        window.location.href = res._rawValue.pay_url
      } else {
        console.log('pc')
        start.value = true
        pay_now_type.value = 'paying'
        pay_scan.value = res._rawValue.qr_code
        time_check_status.value = setInterval(() => {
          check_order_status({
            order_id: res._rawValue.order_id
          }).then((res: any) => {
            if (res._rawValue.status == 200) {
              clearInterval(time_check_status.value)
              pay_now_type.value = 'success'
              now_user()
              dialogFormVisible.value = false
              Message.success('充值成功')
              start.value = false
            }
          }).catch((err: any) => {
            clearInterval(time_check_status.value)
            console.log(err)
          })
        }, 5000)
      }
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false

      console.log(err.message)
    })
  } else if (form.pay_type == 'yzf_alipay') {
    qr_load.value = false
    qr_show.value = false
    yzf_pay({
      amount: form.amount,
      type: 'charge',
      pay_type: 'alipay',
    }).then((res: any) => {
      const form = document.createElement('div');
      form.innerHTML = res._rawValue.data;
      document.body.appendChild(form);
      document.getElementById("dopay")?.submit();
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false

      console.log(err.message)
    })
  } else if (form.pay_type == 'yzf_wechat') {
    qr_load.value = false
    qr_show.value = false
    yzf_pay({
      amount: form.amount,
      type: 'charge',
      pay_type: 'wxpay',
    }).then((res: any) => {
      const form = document.createElement('div');
      form.innerHTML = res._rawValue.data;
      document.body.appendChild(form);
      document.getElementById("dopay")?.submit();
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false

      console.log(err.message)
    })
  }

}
// VIP bug
const dialogVip = ref(false)
const up_vip_dialog = (v_id:any) => {
  dialogVip.value = true
  vip_ids.value = v_id
  form.vip_type = v_id
  let index = vip_list.value.findIndex(item => item.id === v_id);

  // 检查是否找到了元素
  if (index !== -1) {
    vip_now_money.value = vip_list.value[index].pay_amount;
  } else {
    console.log("没有找到具有指定 id 的元素");
  }
}
const invite_code = ref('')

const qrLink = ref(full_url.value + '/login?invite_code=' + invite_code.value); // 你的链接
const posterRef = ref(null);
const posterRef2 = ref(null);
const qrcodeRef = ref(null);
const change_key_tab = async (key: any) => {
  c_change.value = key

  if (key == 'task') {
    now_task()
  }
}
const task_list = ref({})
const task_table = ref([])
const now_task = () => {
  now_user_task().then((res: any) => {
    task_list.value = res._rawValue.data
    task_table.value = res._rawValue.task_log
  }).catch((err: any) => {
    console.log(err)
  })
}
const complete_task = (type: any) => {
  complete_user_task({
    type: type
  }).then((res: any) => {
    Message.success('领取成功')
    now_task()
  }).catch((err: any) => {
    console.log(err)
  })
}

const up_to_vip = () => {
  if (vip_ids.value == '') {
    Message.error('请选择VIP套餐')
    return
  }
  clearInterval(time_check_status.value)
  charge_loading.value = true
  qr_load.value = true
  qr_show.value = true
  const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);

  if (form.pay_type == 'alipay') {
    alipay({
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      type: 'vip',
      coupon: form.kami,
      is_mobile: isMobile && counter.setting.alipay_wap_open == '1' ? 1 : 0
    }).then((res: any) => {
      if (isMobile && counter.setting.alipay_wap_open == '1') {
        console.log('mobile')
        window.location.href = res._rawValue.pay_url
      } else {
        console.log('pc')
        start.value = true
        pay_now_type.value = 'paying'
        pay_scan.value = res._rawValue.qr_code
        time_check_status.value = setInterval(() => {
          check_order_status({
            order_id: res._rawValue.order_id
          }).then((res: any) => {
            if (res._rawValue.status == 200) {
              clearInterval(time_check_status.value)
              pay_now_type.value = 'success'
              now_user()
              dialogVip.value = false
              Message.success('升级VIP成功')
              start.value = false
            }
          }).catch((err: any) => {
            clearInterval(time_check_status.value)
            console.log(err)
          })
        }, 5000)
      }
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  } else if (form.pay_type == 'wechat') {
    wechat({
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      type: 'vip',
      coupon: form.kami,
      is_mobile: isMobile && counter.setting.wechat_wap_open == '1' ? 1 : 0

    }).then((res: any) => {
      if (isMobile && counter.setting.wechat_wap_open == '1') {
        console.log('mobile')
        window.location.href = res._rawValue.pay_url
      } else {
        console.log('pc')
        start.value = true
        pay_now_type.value = 'paying'
        pay_scan.value = res._rawValue.qr_code
        time_check_status.value = setInterval(() => {
          check_order_status({
            order_id: res._rawValue.order_id
          }).then((res: any) => {
            if (res._rawValue.status == 200) {
              clearInterval(time_check_status.value)
              pay_now_type.value = 'success'
              now_user()
              dialogVip.value = false
              Message.success('升级VIP成功')
              start.value = false
            }
          }).catch((err: any) => {
            clearInterval(time_check_status.value)
            console.log(err)
          })
        }, 5000)
      }
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  } else if (form.pay_type == 'balance') {
    qr_load.value = false
    qr_show.value = false
    buy_vip({
      v_id: vip_ids.value,
      coupon: form.kami,
    }).then((res: any) => {
      charge_loading.value = false
      Message.success(res._rawValue.message)
      dialogVip.value = false
      now_user()
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  } else if (form.pay_type == 'yzf_wechat') {
    qr_load.value = false
    qr_show.value = false
    yzf_pay({
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      type: 'vip',
      coupon: form.kami,
      pay_type: 'wxpay',
    }).then((res: any) => {
      const form = document.createElement('div');
      form.innerHTML = res._rawValue.data;
      document.body.appendChild(form);
      document.getElementById("dopay")?.submit();
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  } else if (form.pay_type == 'yzf_alipay') {
    qr_load.value = false
    qr_show.value = false
    yzf_pay({
      v_id: vip_ids.value,
      amount: vip_now_money.value,
      type: 'vip',
      coupon: form.kami,
      pay_type: 'alipay',
    }).then((res: any) => {
      const form = document.createElement('div');
      form.innerHTML = res._rawValue.data;
      document.body.appendChild(form);
      document.getElementById("dopay")?.submit();
      charge_loading.value = false
      qr_load.value = false
    }).catch((err: any) => {
      charge_loading.value = false
      qr_load.value = false
      qr_show.value = false
      console.log(err.message)
    })
  }
}
counter
const remove_setting = () => {
  counter_remove.value = ''
  Message.success('清除成功')

}
const vip_ids = ref('')
const vip_now_money = ref(0)
const changeRadio = (ids: string) => {
  vip_list.value.forEach((item: any) => {
    if (item.id == ids) {
      vip_ids.value = item.id
      vip_now_money.value = item.pay_amount
    }
  })
}
const tableInvite = ref([])
const copy_invite = () => {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', full_url.value + '/login?invite_code=' + invite_code.value)
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    Message.success('复制成功')
  }
  document.body.removeChild(input)
}
const invite_up = () => {
  invite_code_send().then((res: any) => {
    invite_code.value = res._rawValue.data
    Message.success(
        '邀请码已更新'
    )
  }).catch((err: any) => {
    console.log(err)
  })
}
const kami_code = ref('')
const kami_loading = ref(false)
const change_code = () => {
  if (kami_code.value == '') {
    Message.error('请输入卡密')
    return
  }
  kami_loading.value = true
  kami_send({
    code: kami_code.value,
  }).then((res: any) => {
    Notification.success({
      title: '成功',
      content: res._rawValue.info,
    })
    kami_code.value = ''
    kami_loading.value = false
    now_user()
  }).catch((err: any) => {
    kami_loading.value = false
    console.log(err)
  })
}

const onSuccessUp = (currentFile) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error('上传失败!')
    return
  }
  Message.success('上传成功!')
  now_user()
};
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isGIF = file.type === 'image/gif';
  const isLt2M = file.size / 1024 / 1024 < 5;

  if (!isJPG && !isPNG && !isGIF) {
    Message.error('上传图片只能是 JPG/PNG/GIF 格式!')
    return false
  }
  if (!isLt2M) {
    Message.error('上传图片大小不能超过 5MB!')
    return false
  }
  return true
};
const change_phone_number = ref(false)
const change_email_code = ref(false)
const phone_form = reactive({
  phone: '',
  phone_code: '',
})
const email_form = reactive({
  email: '',
  email_code: '',
})
const c_user_phone = () => {
  if (phone_form.phone == '') {
    Message.error('请输入手机号')
    return
  }
  if (phone_form.phone_code == '') {
    Message.error('请输入验证码')
    return
  }
  change_phone_number.value = true
  change_phone({
    phone: phone_form.phone,
    code: phone_form.phone_code,
  }).then((res: any) => {
    Message.success('修改成功')
    change_phone_number.value = false
    now_user()
  }).catch((err: any) => {
    console.log(err)
  })
}
const send_wait = ref(false)
const send_code_text = ref('发送验证码')
const send_p_code = () => {
  if (phone_form.phone == '') {
    Message.error('请输入手机号')
    return
  }
  send_wait.value = true
  send_phone_code({
    phone: phone_form.phone,
    verify_code: verify_code.value
  }).then((res: any) => {
    send_wait.value = true
    let time = 60
    const timer = setInterval(() => {
      time--
      send_code_text.value = time + 's'
      if (time == 0) {
        send_wait.value = false
        send_code_text.value = '发送验证码'
        clearInterval(timer)
      }
    }, 1000)
    Message.success('发送成功')
  }).catch((err: any) => {
    send_wait.value = false
    console.log(err)
  })
}

const send_e_code = () => {
  if (email_form.email == '') {
    Message.error('请输入邮箱')
    return
  }
  send_wait.value = true
  send_email({
    email: email_form.email,
    verify_code: verify_code.value
  }).then((res: any) => {
    send_wait.value = true
    let time = 60
    const timer = setInterval(() => {
      time--
      send_code_text.value = time + 's'
      if (time == 0) {
        send_wait.value = false
        send_code_text.value = '发送验证码'
        clearInterval(timer)
      }
    }, 1000)
    Message.success('发送成功')
  }).catch((err: any) => {
    send_wait.value = false
    console.log(err)
  })
}

const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'APIKey',
        dataIndex: 'apikey',
      },
      {
        title: '请求速率/分',
        dataIndex: 'rate',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        dataIndex: 'action',
        slotName:'action'
      }
    ];

const c_user_email = () => {
  if (email_form.email == '') {
    Message.error('请输入邮箱')
    return
  }
  if (email_form.email_code == '') {
    Message.error('请输入验证码')
    return
  }
  change_email_code.value = true
  change_email({
    email: email_form.email,
    code: email_form.email_code,
  }).then((res: any) => {
    Message.success('修改成功')
    change_email_code.value = false
    now_user()
  }).catch((err: any) => {
    console.log(err)
  })
}

const formApieky = reactive({
  rate: 1,
})

const dialogFormVisibleApikey = ref(false)
const api_list = ref([])
const now_api_key = ref('')
const get_user_apilist = () => {
  user_api_list().then((res: any) => {
    api_list.value = res._rawValue.data
    if (api_list.value.length > 0) {
      console.log(api_list.value[0].apikey)
      now_api_key.value = api_list.value[0].apikey
    }
  }).catch((err: any) => {
    console.log(err)
  })
}
get_user_apilist()
const createAPIKey = () => {
  user_api_create({
    rate: formApieky.rate
  }).then((res: any) => {
    Message.success('创建成功')
    dialogFormVisibleApikey.value = false
    get_user_apilist()
  }).catch((err: any) => {
    console.log(err)
  })
}

const deleteApikey = (id: any) => {
  delete_apikey({
    id: id
  }).then((res: any) => {
    Message.success('删除成功')
    get_user_apilist()
  }).catch((err: any) => {
    console.log(err)
  })
}

const send_loading = ref(false)
const me_message = ref('')
const up_stop = ref('start')
const is_done = ref(false)
const checkDialog = ref(false)

const isInvalidJSON = (data: string) => {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
};
const submitForm = async () => {
  send_loading.value = true;

  me_message.value='思考中...';
  const headers ={
    "Content-Type": "application/json",
    "NiceApiKey" : now_api_key.value
  }
  const res = await fetch(`/api/send_apikey_bot`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      info: "测试一下",
      model:"gpt-3.5-turbo"

    }),
  });

  up_stop.value = "start";
  if (res){
    me_message.value = '';
  }

  if (
      res.status == 500 ||
      res.status == 401 ||
      res.status == 405 ||
      res.status == 402 ||
      res.status == 403
  ) {
    const responseData = await res.json();
    send_loading.value = false;
    Message.error(responseData.message);
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
        me_message.value[me_message.value.length - 1].message =
            json.error.message;
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
                me_message.value += content;
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
      send_loading.value = false;
    } else {
      send_loading.value = true;
      is_done.value = false;
      onData(result!);
      await read();
    }
  };
  await read();
};




const dialogv = () => {
  dialogVip.value = false
  now_user()
  pay_now_type.value = 'paying'
  qr_show.value = false
  start.value = false
  clearInterval(time_check_status.value)
}

const dialogm = () => {
  dialogFormVisible.value = false
  chargeDialog.value = false
  now_user()
  pay_now_type.value = 'paying'
  qr_show.value = false
  start.value = false
  clearInterval(time_check_status.value)
}

const signin_loading = ref(false)
const go_signin = () => {
  signin_loading.value = true
  signin_me().then((res: any) => {
    Message.success('签到成功')
    signin_loading.value = false
    now_user()
  }).catch((err: any) => {
    signin_loading.value = false
    console.log(err)
  })
}
const signin_info = ref([])
const sign_me_info = ref([])
const get_sign = () => {
  get_signin_info().then((res: any) => {
    signin_info.value = res._rawValue.sign_info
    sign_me_info.value = res._rawValue.data
  }).catch((err: any) => {
    console.log(err)
  })
}
get_sign()



import html2canvas from 'html2canvas';
import hljs from "highlight.js";
import markdownItMatch from "markdown-it-math";
import mermaid from "mermaid";

const downloadPoster = (nums:string) => {
  let posterElement = posterRef.value;
  if (nums == 'one'){
    posterElement = posterRef.value;
  }else{
    posterElement = posterRef2.value;
  }

  if (posterElement) {
    html2canvas(posterElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'poster.png';
      link.click();
    });
  }
};

const chargeDialog = ref(false)
const charge_limit = () =>{
  chargeDialog.value = true
  form.pay_type = 'balance'
}


const limit_list = ref([])
const buy_limit_bag = () => {
  charge_loading.value= true
  buy_limit_bags({
    id: form.limit_bag_id,
  }).then((res:any) => {
    Message.success(res._rawValue.message)
    charge_loading.value= false
    dialogFormVisible.value = false
  }).catch((err:any) => {
    charge_loading.value= false
    console.log(err)
  })
}
const get_limit_bag = () => {
  charge_limit_bag().then((res:any)=>{
    limit_list.value = res._rawValue.data
    form.limit_bag_id = res._rawValue.data[0]?.id
  }).catch((err:any)=>{
    console.log(err)
  })
}
get_limit_bag()
const changeLimitRadio = (e:any) => {
  form.limit_bag_id = e
}
</script>


