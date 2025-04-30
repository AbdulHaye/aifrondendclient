

<template>
    <div class="member-draws flex w-full">
        <div class="member_square w-100 flex" v-if="now_user_info">
            <div class="ai-header" style="top: 0px; height: 60px;">
                <div class="ai-header__left" @click="change_drawer()">
                    <icon-menu-unfold size="24"/>
                </div>
                <div class="ai-header__logo ai-header__logo--mobile"><span><a class="ai-header__link"><img
                    :src="counter.setting.logo" style="width: 40px;"></a></span>
                </div>
                <div class="ai-header__right">

                </div>
            </div>
            <div class="member_left_intro">
                <aside class="personalSider"><div class="squar_bg" :style="{backgroundImage:'url('+now_user_bg+')'}"></div><div class="homeBgCover__1IIeD"></div><div class="userInfo__2Gan4"><div class="spaceTitleBox__LG8dI"><div class="positionDiv__QPQK4"><div class="divTextArea__nJ-4S scrollHidden__2aT0V maxHeight108__1_zra cursor-text__XBIKX spaceTitle__3vLR0">
                    {{ now_user_info.name }}
                    的灵感空间
                </div>
                </div>
                </div>
                    <p class="a_c">{{ now_user_info.description }}</p>
                    <div class="userInfo_name">
                        <div class="userImage">
                            <div class="avatarImgBox undefined" style="width: 36px; height: 36px;"><img
                                class="avatarImg"
                                :src="now_user_info.avatar">
                            </div>
                        </div>
                        <h1 is="ellipsis-heading1" data-length="14">{{ now_user_info.name }}</h1></div>
                </div>
                    <div class="infolist_me">
                        <div class="infolist_me_info">
                            <div class="infolist_me_info_item"><h3>关注</h3>
                                <p>{{ follow }}</p></div>
                            <div class="infolist_me_info_item"><h3>获赞</h3>
                                <p>{{ all_like }}</p></div>
                            <div class="infolist_me_info_item"><h3>粉丝</h3>
                                <p>{{ fans }}</p>
                            </div>

                        </div>
                        <div v-if="is_login" class="m-2 w-100">
                            <a-upload
                                class="avatar-uploader w-100"
                                :action="actions"
                                :show-file-list="false"
                                :headers="{'Authorization': 'Bearer ' + token}"
                                @success="onSuccess"
                                @before-upload="beforeUpload"
                            >

                            </a-upload>
                        </div>
                        <div  v-else>
                            <a-button shape="round" type="primary" class="m-2" @click="follow_user()">
                                立即关注
                            </a-button>
                        </div>

                    </div>
                </aside>
            </div>
            <client-only>
                <div class="member_right_info vh-100 overflow-auto w-100 m-auto">
                    <a-tabs>

                        <a-tab-pane key="1">
                            <template #title>
                                <icon-dice /> 作品
                            </template>

                            <a-spin dot :loading="change_load">
                                <div class="draw_group pb-10" v-if="public_draw?.length > 0">

                                    <Waterfall :list="public_draw" :loadProps="loadProps" :crossOrigin=false :width=410 :hasAroundGutter=false :breakpoints="breakpoints">
                                        <template #default="{ item, url, index }">
                                            <div class="water_fall u-img relative item list-animation-bottomIn"
                                                 :class="'delay-'+index"
                                                 @click="draw_dialog_check(index,'work')">
                                                <LazyImg :url="item.image" :loadProps="loadProps" />
                                                <div class="bottom_draw_info">
                                                    <h5 class="text-white text-truncate mb-1">{{item.name}}</h5>
                                                    <p class="text-white text-truncate mb-1 opacity-70">
                                                        <a-avatar :size="24">
                                                            <img :src="item.get_userinfo.avatar" />
                                                        </a-avatar>
                                                        <span class="ml-1">{{ item.get_userinfo.name }}</span>

                                                    </p>
                                                    <p class="text-white text-truncate opacity-70">{{item.created_at}}</p>

                                                </div>
                                                <div class="round_bottom">
                                                    <div class="num_info cursor-pointer mr-2" @click="send_drawlike(item.id,'star')">
                                                        <icon-heart />
                                                        <span class="ml-1">
                                            {{item.ai_drawlike_count}}
                                        </span>
                                                    </div>
                                                    <div class="num_info cursor-pointer" @click="send_drawlike(item.id,'like')">
                                                        <icon-thumb-up />
                                                        <span class="ml-1">
                                            {{item.like_count}}
                                        </span>
                                                    </div>
                                                </div>
                                            </div>


                                        </template>
                                    </Waterfall>

                                    <a-row :gutter="20" >
                                        <div class="mt-10 flex justify-center w-full mb-4">
                                            <a-button class="load_more" :loading="load_more_loading" @click="load_more()">
                                                <template #icon>
                                                    <icon-refresh />
                                                </template>
                                                加载更多
                                            </a-button>
                                        </div>

                                    </a-row>

                                </div>
                                <a-empty description="暂无数据哦~" v-else />
                            </a-spin>


                        </a-tab-pane>

                        <a-tab-pane key="2">
                            <template #title>
                                <icon-heart /> 喜欢
                            </template>
                            <a-spin dot :loading="change_load">
                                <div class="draw_group pb-10" v-if="like_draw?.length > 0">

                                    <Waterfall :list="like_draw" :loadProps="loadProps" :crossOrigin=false :width=400 :hasAroundGutter=false :breakpoints="breakpoints">
                                        <template #item="{ item, url, index }">
                                            <div class="water_fall u-img relative item list-animation-bottomIn"
                                                 :class="'delay-'+index"
                                                 @click="draw_dialog_check(index,'like')">
                                                <LazyImg :url="item.image" :loadProps="loadProps" />
                                                <div class="bottom_draw_info">
                                                    <h5 class="text-white text-truncate mb-1">{{item.name}}</h5>
                                                    <p class="text-white text-truncate mb-1 opacity-70">
                                                        <a-avatar :size="24">
                                                            <img :src="item.get_userinfo.avatar" />
                                                        </a-avatar>
                                                        <span class="ml-1">{{ item.get_userinfo.name }}</span>

                                                    </p>
                                                    <p class="text-white text-truncate opacity-70">{{item.created_at}}</p>

                                                </div>
                                                <div class="round_bottom">
                                                    <div class="num_info cursor-pointer mr-2" @click="send_drawlike(item.id,'star')">
                                                        <icon-heart />
                                                        <span class="ml-1">
                                            {{item.ai_drawlike_count}}
                                        </span>
                                                    </div>
                                                    <div class="num_info cursor-pointer" @click="send_drawlike(item.id,'like')">
                                                        <icon-thumb-up />
                                                        <span class="ml-1">
                                            {{item.like_count}}
                                        </span>
                                                    </div>
                                                </div>
                                            </div>


                                        </template>
                                    </Waterfall>

                                    <a-row :gutter="20" >
                                        <div class="mt-10 flex justify-center w-full mb-4">
                                            <a-button class="load_more" :loading="load_more_loading" @click="load_like_more()">
                                                <template #icon>
                                                    <icon-refresh />
                                                </template>
                                                加载更多
                                            </a-button>
                                        </div>

                                    </a-row>

                                </div>
                                <a-empty description="暂无数据哦~" v-else />
                            </a-spin>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </client-only>
            <a-modal :header=false :footer=false v-model:visible="draw_dialog" simple class="draws_dialog">
                <div class="flex draw_all_info h-100 overflow-hidden">
                    <div class="left_draw_image text-center ">
                        <a-image
                            :src="draw_info.image"
                        />
                        <div class="draw_dialog_left_point" @click="change_nextor_prev('prev')">
                            <div class="sc-cVtpRj dLvaiq" style="width: 28px; height: 28px; transform: rotate(180deg);">
                                <div class="baseIcon">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.02081 26.0416L21.0416 14.0208C16.3472 9.32639 13.7152 6.69442 9.02081 2"
                                              stroke="white" stroke-width="4"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="draw_dialog_right_point" @click="change_nextor_prev('next')">
                            <div class="sc-cVtpRj dLvaiq" style="width: 28px; height: 28px;">
                                <div class="baseIcon">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.02081 26.0416L21.0416 14.0208C16.3472 9.32639 13.7152 6.69442 9.02081 2"
                                              stroke="white" stroke-width="4"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right_draw_info p-4 flex-1">
                        <h4>作品介绍</h4>
                        <div class="flex right_all_info flex-column justify-between">
                            <div class="draw_info_item">
                                <div class="draw_dialog_card">
                                    <div class="draw_dialog_card_title">
                                        <h3>生成描述词</h3>
                                        <div class="draw_dialog_card_icon"
                                             @click="code_copy()"
                                             style="width: 20px; height: 20px; position: relative; opacity: 0.5;">
                                            <icon-copy />
                                        </div>
                                    </div>
                                    <p class="draw_dialog_card_des">
                                        {{draw_info.title}}
                                    </p>
                                    <a-button @click="cost_draw()" type="primary" size="mini" class="pl-2" v-if="draw_info.cost">
                                        <template #icon>
                                            <icon-gift />
                                        </template>
                                        支付 {{draw_info.cost}} {{counter.setting.money_name_set}}查看
                                    </a-button>
                                    <div class="inline" v-if="draw_info.vip_set">
                                        或
                                        <a-space>
                                            <a-tag color="arcoblue" v-for="(v,vindex) in draw_info.vip_set" :key="vindex">
                                                {{ v }}
                                            </a-tag>
                                        </a-space>

                                    </div>
                                </div>
                                <div class="draw_dialog_card">
                                    <div class="draw_dialog_card_title">
                                        <p>画面尺寸</p>
                                        <p>
                                            {{draw_info.width}} x {{draw_info.height}}
                                        </p>
                                    </div>
                                    <div class="draw_dialog_card_title">
                                        <p>模型选择</p>
                                        <p>
                                            {{draw_info.text_model}}
                                        </p>
                                    </div>
                                    <div class="draw_dialog_card_title">
                                        <p>图片后缀</p>
                                        <p>
                                            {{draw_info.image_type}}
                                        </p>
                                    </div>
                                    <div class="draw_dialog_card_title">
                                        <p>日期</p>
                                        <p>
                                            {{draw_info.created_at}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="author_info">
                                <div class="bottom_draw_info">
                                    <h3 class="text-truncate mb-2">{{draw_info.name}}</h3>
                                    <p class="text-truncate mb-2">
                                        <a-avatar :size="30">
                                            <img :src="draw_info.get_userinfo?draw_info.get_userinfo.avatar:''" />
                                        </a-avatar>
                                        <NuxtLink :to="'/member/'+(draw_info.get_userinfo?draw_info.get_userinfo.id:0)" class="ml-1 text-gray-900">{{ draw_info.get_userinfo?draw_info.get_userinfo.name:'未命名' }}</NuxtLink>

                                    </p>
                                    <a-button-group class="w-full mb-2">
                                        <a-button class="flex-1" type="primary" status="danger"  @click="onDownLoad(draw_info.image)">
                                            <icon-download />
                                            下载
                                        </a-button>
                                        <a-button class="flex-1" type="primary" status="warning" @click="send_drawlike(draw_info.id,'star')">
                                            <icon-star />
                                            收藏 {{draw_info.ai_drawlike_count}}

                                        </a-button>
                                        <a-button class="flex-1" type="primary" status="success"  @click="send_drawlike(draw_info.id,'like')">
                                            <icon-thumb-up />
                                            点赞 {{draw_info.like_count}}
                                        </a-button>
                                    </a-button-group>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </a-modal>

        </div>
        <div class="empty_design w-100" v-else>
            <div class="row  w-100">
                <div class="col-md-6 align-self-center">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 600" style="visibility: visible;">
                        <g>
                            <defs>
                                <clipPath id="GlassClip">
                                    <path d="M380.857,346.164c-1.247,4.651-4.668,8.421-9.196,10.06c-9.332,3.377-26.2,7.817-42.301,3.5
                s-28.485-16.599-34.877-24.192c-3.101-3.684-4.177-8.66-2.93-13.311l7.453-27.798c0.756-2.82,3.181-4.868,6.088-5.13
                c6.755-0.61,20.546-0.608,41.785,5.087s33.181,12.591,38.725,16.498c2.387,1.682,3.461,4.668,2.705,7.488L380.857,346.164z"></path>
                                </clipPath>
                                <clipPath id="cordClip">
                                    <rect width="800" height="600"></rect>
                                </clipPath>
                            </defs>

                            <g id="planet" style="transform-origin: 0px 0px;" transform="matrix(0.9997,-0.024,0.024,0.9997,-2.4409,13.6636)">
                                <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-miterlimit="10" cx="572.859" cy="108.803" r="90.788"></circle>

                                <circle id="craterBig" fill="none" stroke="#0E0620" stroke-width="3" stroke-miterlimit="10" cx="548.891" cy="62.319" r="13.074" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,2.06,0)"></circle>

                                <circle id="craterSmall" fill="none" stroke="#0E0620" stroke-width="3" stroke-miterlimit="10" cx="591.743" cy="158.918" r="7.989" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,-2.06,0)"></circle>
                                <path id="ring" fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" d="
			M476.562,101.461c-30.404,2.164-49.691,4.221-49.691,8.007c0,6.853,63.166,12.408,141.085,12.408s141.085-5.555,141.085-12.408
			c0-3.378-15.347-4.988-40.243-7.225"></path>

                                <path id="ringShadow" opacity="0.5" fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" d="
			M483.985,127.43c23.462,1.531,52.515,2.436,83.972,2.436c36.069,0,68.978-1.19,93.922-3.149"></path>
                            </g>
                            <g id="stars">
                                <g id="starsBig">
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.9198,0.3924,-0.3924,0.9198,141.9949,-182.761)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="518.07" y1="245.375" x2="518.07" y2="266.581"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="508.129" y1="255.978" x2="528.01" y2="255.978"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.9752,-0.2213,0.2213,0.9752,-49.7206,40.2033)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="154.55" y1="231.391" x2="154.55" y2="252.598"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="144.609" y1="241.995" x2="164.49" y2="241.995"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.9013,-0.4331,0.4331,0.9013,-30.4872,152.7988)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="320.135" y1="132.746" x2="320.135" y2="153.952"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="310.194" y1="143.349" x2="330.075" y2="143.349"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.9865,0.164,-0.164,0.9865,83.678,-26.2448)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="200.67" y1="483.11" x2="200.67" y2="504.316"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="210.611" y1="493.713" x2="190.73" y2="493.713"></line>
                                    </g>
                                </g>
                                <g id="starsSmall">
                                    <g style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,0)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="432.173" y1="380.52" x2="432.173" y2="391.83"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="426.871" y1="386.175" x2="437.474" y2="386.175"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,0)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="489.555" y1="299.765" x2="489.555" y2="308.124"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="485.636" y1="303.945" x2="493.473" y2="303.945"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.975,0,0,0.9757,5.7867,7.1731)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="231.468" y1="291.009" x2="231.468" y2="299.369"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="227.55" y1="295.189" x2="235.387" y2="295.189"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.873,0,0,0.8733,30.992,69.9027)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="244.032" y1="547.539" x2="244.032" y2="555.898"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="247.95" y1="551.719" x2="240.113" y2="551.719"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.69,0,0,0.6909,57.7711,127.0854)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="186.359" y1="406.967" x2="186.359" y2="415.326"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="190.277" y1="411.146" x2="182.44" y2="411.146"></line>
                                    </g>
                                    <g style="transform-origin: 0px 0px;" transform="matrix(0.428,0,0,0.4285,274.7296,234.9702)">

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="480.296" y1="406.967" x2="480.296" y2="415.326"></line>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="484.215" y1="411.146" x2="476.378" y2="411.146"></line>
                                    </g>
                                </g>
                                <g id="circlesBig">

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="588.977" cy="255.978" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="450.066" cy="320.259" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="168.303" cy="353.753" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="429.522" cy="201.185" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="200.67" cy="176.313" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="133.343" cy="477.014" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="283.521" cy="568.033" r="7.952" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-1.373)"></circle>

                                    <circle fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" cx="413.618" cy="482.387" r="7.952" transform="matrix(1,0,0,1,0,-1.373)" style="transform-origin: 0px 0px;"></circle>
                                </g>
                                <g id="circlesSmall">
                                    <circle fill="#0E0620" cx="549.879" cy="296.402" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="253.29" cy="229.24" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="434.824" cy="263.931" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="183.708" cy="544.176" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="382.515" cy="530.923" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="130.693" cy="305.608" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                    <circle fill="#0E0620" cx="480.296" cy="477.014" r="2.651" style="transform-origin: 0px 0px;" transform="matrix(1,0,0,1,0,-2.747)"></circle>
                                </g>
                            </g>
                            <g id="spaceman" clip-path="url(cordClip)" style="transform-origin: 0px 0px;" transform="matrix(0.9999,0.012,-0.012,0.9999,2.6466,0.9927)">
                                <path id="cord" fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M273.813,410.969c0,0-54.527,39.501-115.34,38.218c-2.28-0.048-4.926-0.241-7.841-0.548
			c-68.038-7.178-134.288-43.963-167.33-103.87c-0.908-1.646-1.793-3.3-2.654-4.964c-18.395-35.511-37.259-83.385-32.075-118.817"></path>

                                <path id="backpack" fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
			M338.164,454.689l-64.726-17.353c-11.086-2.972-17.664-14.369-14.692-25.455l15.694-58.537
			c3.889-14.504,18.799-23.11,33.303-19.221l52.349,14.035c14.504,3.889,23.11,18.799,19.221,33.303l-15.694,58.537
			C360.647,451.083,349.251,457.661,338.164,454.689z"></path>
                                <g id="antenna">
                                    <line fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="323.396" y1="236.625" x2="295.285" y2="353.753"></line>
                                    <circle fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="323.666" cy="235.617" r="6.375"></circle>
                                </g>
                                <g id="armR">

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M360.633,363.039c1.352,1.061,4.91,5.056,5.824,6.634l27.874,47.634c3.855,6.649,1.59,15.164-5.059,19.02l0,0
				c-6.649,3.855-15.164,1.59-19.02-5.059l-5.603-9.663"></path>

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M388.762,434.677c5.234-3.039,7.731-8.966,6.678-14.594c2.344,1.343,4.383,3.289,5.837,5.793
				c4.411,7.596,1.829,17.33-5.767,21.741c-7.596,4.411-17.33,1.829-21.741-5.767c-1.754-3.021-2.817-5.818-2.484-9.046
				C375.625,437.355,383.087,437.973,388.762,434.677z"></path>
                                </g>
                                <g id="armL">

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M301.301,347.66c-1.702,0.242-5.91,1.627-7.492,2.536l-47.965,27.301c-6.664,3.829-8.963,12.335-5.134,18.999h0
				c3.829,6.664,12.335,8.963,18.999,5.134l9.685-5.564"></path>

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M241.978,395.324c-3.012-5.25-2.209-11.631,1.518-15.977c-2.701-0.009-5.44,0.656-7.952,2.096
				c-7.619,4.371-10.253,14.09-5.883,21.71c4.371,7.619,14.09,10.253,21.709,5.883c3.03-1.738,5.35-3.628,6.676-6.59
				C252.013,404.214,245.243,401.017,241.978,395.324z"></path>
                                </g>
                                <g id="body">

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M353.351,365.387c-7.948,1.263-16.249,0.929-24.48-1.278c-8.232-2.207-15.586-6.07-21.836-11.14
				c-17.004,4.207-31.269,17.289-36.128,35.411l-1.374,5.123c-7.112,26.525,8.617,53.791,35.13,60.899l0,0
				c26.513,7.108,53.771-8.632,60.883-35.158l1.374-5.123C371.778,395.999,365.971,377.536,353.351,365.387z"></path>
                                    <path fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M269.678,394.912L269.678,394.912c26.3,20.643,59.654,29.585,93.106,25.724l2.419-0.114"></path>
                                </g>
                                <g id="legs">
                                    <g id="legR">

                                        <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
					M312.957,456.734l-14.315,53.395c-1.896,7.07,2.299,14.338,9.37,16.234l0,0c7.07,1.896,14.338-2.299,16.234-9.37l17.838-66.534
					C333.451,455.886,323.526,457.387,312.957,456.734z"></path>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="304.883" y1="486.849" x2="330.487" y2="493.713"></line>
                                    </g>
                                    <g id="legL">

                                        <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
					M296.315,452.273L282,505.667c-1.896,7.07-9.164,11.265-16.234,9.37l0,0c-7.07-1.896-11.265-9.164-9.37-16.234l17.838-66.534
					C278.993,441.286,286.836,447.55,296.315,452.273z"></path>

                                        <line fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="262.638" y1="475.522" x2="288.241" y2="482.387"></line>
                                    </g>
                                </g>
                                <g id="head">

                                    <ellipse transform="matrix(0.259 -0.9659 0.9659 0.259 -51.5445 563.2371)" fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="341.295" cy="315.211" rx="61.961" ry="60.305"></ellipse>
                                    <path id="headStripe" fill="none" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M330.868,261.338c-7.929,1.72-15.381,5.246-21.799,10.246" style="transform-origin: 0px 0px;" transform="matrix(0.9999,0.012,-0.012,0.9999,3.167,-3.3397)"></path>

                                    <path fill="#FFFFFF" stroke="#0E0620" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="
				M380.857,346.164c-1.247,4.651-4.668,8.421-9.196,10.06c-9.332,3.377-26.2,7.817-42.301,3.5s-28.485-16.599-34.877-24.192
				c-3.101-3.684-4.177-8.66-2.93-13.311l7.453-27.798c0.756-2.82,3.181-4.868,6.088-5.13c6.755-0.61,20.546-0.608,41.785,5.087
				s33.181,12.591,38.725,16.498c2.387,1.682,3.461,4.668,2.705,7.488L380.857,346.164z"></path>
                                    <g clip-path="url(#GlassClip)">
                                        <polygon id="glassShine" fill="none" stroke="#0E0620" stroke-width="3" stroke-miterlimit="10" points="
					278.436,375.599 383.003,264.076 364.393,251.618 264.807,364.928 				" transform="matrix(0.866,-0.5,0.5,0.866,-33.401,203.976)" style="transform-origin: 0px 0px;"></polygon>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <div class="col-md-6 align-self-center">
                    <h1>设计师似乎去旅游了~</h1>
                    <h2>很抱歉，没找到他~</h2>
                    <p>The Designer you are looking for does not exist.
                        How you got here is a mystery. But you can click the button below
                        to go back to the homepage.
                    </p>
                    <NuxtLink to="/ai_draw_group">
                        <a-button type="primary" size="large" class="mt-4">
                            寻找更多设计师
                        </a-button>

                    </NuxtLink>
                </div>
            </div>
        </div>
      <a-drawer
          v-model:visible="new_draw"
          class="member_draw"
          :header=false
          :footer=false
          placement="left"
          width="75%"
      >
        <div>
          <aside class="personalSider"><div class="squar_bg" :style="{backgroundImage:'url('+now_user_info.member_bg+')'}"></div><div class="homeBgCover__1IIeD"></div><div class="userInfo__2Gan4"><div class="spaceTitleBox__LG8dI"><div class="positionDiv__QPQK4"><div class="divTextArea__nJ-4S scrollHidden__2aT0V maxHeight108__1_zra cursor-text__XBIKX spaceTitle__3vLR0">
            {{ now_user_info.name }}
            的灵感空间
          </div>
          </div>
          </div>
            <p class="a_c">{{ now_user_info.description }}</p>
            <div class="userInfo_name">
              <div class="userImage">
                <div class="avatarImgBox undefined" style="width: 36px; height: 36px;"><img
                    class="avatarImg"
                    :src="now_user_info.avatar">
                </div>
              </div>
              <h1 is="ellipsis-heading1" data-length="14">{{ now_user_info.name }}</h1></div>
          </div>
            <div class="infolist_me">
              <div class="infolist_me_info">
                <div class="infolist_me_info_item"><h3>关注</h3>
                  <p>{{ follow }}</p></div>
                <div class="infolist_me_info_item"><h3>获赞</h3>
                  <p>{{ all_like }}</p></div>
                <div class="infolist_me_info_item"><h3>粉丝</h3>
                  <p>{{ fans }}</p>
                </div>

              </div>
              <div v-if="is_login" class="m-2 w-100">
                <a-upload
                    class="avatar-uploader w-100"
                    :action="actions"
                    :show-file-list="false"
                    :headers="{'Authorization': 'Bearer ' + token}"
                    @success="onSuccess"
                    @before-upload="beforeUpload"
                >

                </a-upload>
              </div>

              <a-button shape="round" type="primary" class="m-2" @click="follow_user(now_user_info.id)" v-else>
                立即关注
              </a-button>
            </div>
          </aside>
        </div>
      </a-drawer>
      <Login :login_dialog="login_dialog" @handleCancel="handleCancel"/>
    </div>


</template>
<script setup lang="ts">
import {ref} from "vue";
import {
    IconCopy,
    IconDice, IconDownload, IconGift,
    IconHeart, IconMenuUnfold, IconRefresh, IconStar, IconThumbUp
} from "@arco-design/web-vue/es/icon";
import {LazyImg, Waterfall} from "vue-waterfall-plugin-next";
const change_load = ref(false)
const load_more_loading = ref(false)
const public_draw = ref([])
import loading from '../../assets/images/loading.gif'
import error from '../../assets/images/loading.gif'
import {Message} from "@arco-design/web-vue";
import {useCounter} from "~/store/counter";
const loadProps= {
    loading: loading,
    error: error,
}
const send_drawlike = (id:number,type:any)=>{
    // 点赞或收藏
    draw_star({
        type:type,
        id:id
    }).then((res:any)=>{
        Message.success(res._rawValue.message)
    }).catch((err:any)=>{
        console.log(err)
    })
}
const draw_info = ref({})
const now_index = ref(0)
const public_page = ref(1)
const public_page_size = ref(20)
const like_page = ref(1)
const like_page_size = ref(20)
const like_draw = ref([])
const like_draw_count = ref(0)
const public_draw_count = ref(0)
const draw_dialog = ref(false)
const now_tab = ref('work')
const counter = useCounter()
const now_user_info  = ref({})
const is_login = ref(false)
const actions = counter.setting.APP_URL + '/api/upload_bg'
const token = useCookie('token')
const fans = ref(0)
const follow = ref(0)
const all_like = ref(0)
const now_user_bg = ref('')
const draw_dialog_check = (item: any,type:any) => {
    now_index.value = item
    now_tab.value = type
    draw_info.value =type=='work'? public_draw.value[now_index.value]:like_draw.value[now_index.value]
    console.log(draw_info)
    const img = new Image()
    img.src = draw_info.value.image
    img.onload = () => {
        draw_info.value.width = img.width
        draw_info.value.height = img.height
    }

    if (draw_info.value.title.indexOf('v 5') !== -1) {
        draw_info.value.text_model = 'Midjourney'
    } else if(draw_info.value.title.indexOf('niji') !== -1){
        draw_info.value.text_model = 'Niji'
    }else if(draw_info.value.type=='dall-e'){
        draw_info.value.text_model = 'Dall-E'
    }
    const suffix = draw_info.value.image.split('.').pop()
    draw_info.value.image_type = suffix
    draw_dialog.value = true
}
const cost_draw = ()=>{
    cost_draw_f({
        draw_id:draw_info.value.id,
    }).then((res:any)=>{
        Message.success(res._rawValue.message)
        get_new_public()
        draw_dialog.value = false
    }).catch((err:any)=>{
        console.log(err)
    })
}
const load_more = () => {
    public_page_size.value +=20
    get_new_public()
}
const load_like_more = () => {
    like_page_size.value +=20
    get_new_public()
}
const route = useRoute()
const get_new_public = () => {
    load_more_loading.value = true
    change_load.value = true
    get_me_show_draw({
        page: public_page.value,
        limit: public_page_size.value,
        like_page: like_page.value,
        like_limit: like_page_size.value,
        user_id:route.params.memid
    }).then((res: any) => {
        public_draw.value = res._rawValue.data
        public_draw_count.value = res._rawValue.count
        like_draw.value = res._rawValue.like
        like_draw_count.value = res._rawValue.count
        load_more_loading.value = false
        change_load.value = false

    }).catch((err: any) => {
        console.log(err)
        load_more_loading.value = false
        change_load.value = false
    })
}
const change_nextor_prev = (type:any)=>{
    if (type=='prev'){
        if (now_index.value==0){
            now_index.value = now_tab.value=='work'?public_draw.value.length-1:like_draw.value.length-1
        }else{
            now_index.value = now_index.value-1
        }
    }else{
        if (now_index.value==(now_tab.value=='work'?public_draw.value.length-1:like_draw.value.length-1)){
            now_index.value = 0
        }else{
            now_index.value = now_index.value+1
        }
    }

    draw_info.value = now_tab.value=='work'?public_draw.value[now_index.value]:like_draw.value[now_index.value]
    const img = new Image()
    img.src = draw_info.value.image
    img.onload = () => {
        draw_info.value.width = img.width
        draw_info.value.height = img.height
    }

    if (draw_info.value.title.indexOf('v 5') !== -1) {
        draw_info.value.text_model = 'Midjourney'
    } else if(draw_info.value.title.indexOf('niji') !== -1){
        draw_info.value.text_model = 'Niji'
    }else if (draw_info.value.type=='dall-e'){
        draw_info.value.text_model = 'Dall-E'
    }
    const suffix = draw_info.value.image.split('.').pop()
    draw_info.value.image_type = suffix

    draw_dialog.value = true
}
const breakpoints = {
    1200: { //当屏幕宽度小于等于1200
        rowPerView: 4,
    },
    800: { //当屏幕宽度小于等于800
        rowPerView: 3,
    },
    768: { //当屏幕宽度小于等于500
        rowPerView: 2,
    },
    480: { //当屏幕宽度小于等于480
        rowPerView: 1,
    },
}
get_new_public()

const get_now_id = ()=>{
    get_member_id({
        user_id:route.params.memid
    }).then((res:any)=>{
        now_user_info.value = res._rawValue.data
        is_login.value = res._rawValue.is_login
        fans.value = res._rawValue.fans
        follow.value = res._rawValue.follow
        all_like.value = res._rawValue.like
        now_user_bg.value =res._rawValue.data.member_bg?res._rawValue.data.member_bg:counter.setting.user_normal_bg
    }).catch((err:any)=>{
        console.log(err)
    })
}
get_now_id()
const onSuccess = (currentFile) => {
    // 获取currentFile里的response的data值
    if (currentFile.response.status != 200) {
        Message.error('上传失败!')
        return
    }
    Message.success('上传成功!')
    get_now_id()
};
const beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isJPG && !isPNG) {
        Message.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    if (!isLt2M) {
        Message.error('上传图片大小不能超过 5MB!')
        return false
    }
    return true
};
const onDownLoad = (imgsrc:any)=>{
    // 下载当前图片
    const image = new Image()
    image.src = imgsrc
    image.onload = function () {
        const a = document.createElement('a')
        a.href = imgsrc
        a.download = '图片'
        a.click()
    }
}
const login_dialog = ref(false)
const handleCancel = () => {
    login_dialog.value = false
};
const follow_user = ()=>{
    if (!token.value){
        Message.error('请先登录!')
        login_dialog.value = true
        return
    }
    follow_user_api({
        follow_id:route.params.memid
    }).then((res:any)=>{
        Message.success(res._rawValue.message)
        get_now_id()
    }).catch((err:any)=>{
        console.log(err)
    })
}
const new_draw = ref(false)
const change_drawer = ()=>{
    new_draw.value = !new_draw.value
}
</script>
