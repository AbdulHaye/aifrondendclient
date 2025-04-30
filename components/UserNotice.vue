<template>
  <a-modal simple class="user-notice-dialog" :footer="false" :hide-title="true" v-model:visible="user_notice"
           @ok="handleCancelNotice" @cancel="handleCancelNotice" unmountOnClose>
    <div>
      <div class="work-order-wrap px-0 container shadow-sm">
        <div class="work-order-set overflow-hidden">
          <a-row :gutter="10">
            <a-col :lg="9" :xs="24" class="mobile_hidden">

              <div class="work-order-left work-order-left-notice">
                <div class="work-order-title px-3">通知
                  <icon-refresh class="cursor-pointer" @click="get_notice_list()"/>
                </div>
                <div class="work-order-imgs  kSZC00wT custom-scroll">
                  <div @click="now_choose='user_notice'"
                       class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
                       :class="now_choose=='user_notice'?'active':''">
                    <div class="work-order-list-img ">
                      <a-badge :count="foreach_notice(list)?0:1" :dot="!foreach_notice(list)"
                               :dotStyle="{ width: '10px', height: '10px' }">
                        <img
                            src="@/assets/images/notice-dialog-1.png" alt="用户通知">
                      </a-badge>


                    </div>
                    <div class="work-order-list-right relative">
                      <div class="work-order-list-title">用户通知</div>
                      <div class="work-order-list-des ">

                        <span v-if="foreach_notice(list)">暂无新消息</span>
                        <span v-else>🎉有新消息</span>
                      </div>
                    </div>
                  </div>
                  <div @click="now_choose='consum'" class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
                       :class="now_choose=='consum'?'active':''">
                    <div class="work-order-list-img ">
                      <img
                          src="@/assets/images/notice-dialog-2.png" alt="额度消耗">


                    </div>
                    <div class="work-order-list-right relative">
                      <div class="work-order-list-title">额度消耗</div>
                      <div class="work-order-list-des ">
                        <span>🎉统计用户消耗次数</span>

                      </div>
                    </div>
                  </div>

                  <div @click="now_choose='draw'" class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
                       :class="now_choose=='draw'?'active':''">
                    <div class="work-order-list-img ">
                      <img
                          src="@/assets/images/notice-dialog-3.png" alt="绘画订单">


                    </div>
                    <div class="work-order-list-right relative">
                      <div class="work-order-list-title">绘画订单</div>
                      <div class="work-order-list-des ">
                        <span>🎁用户购买绘画广场图订单</span>

                      </div>
                    </div>
                  </div>

                </div>

              </div>


            </a-col>
            <a-col :lg="15" :xs="24">
              <!--user_notice-->
              <div class="work-order-rights w-full" v-if="now_choose=='user_notice'">
                <div class="work-order-title mx-2">
                  <svg t="1710432399189" class="icon mr-2 mobile_show" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="36645" width="16" height="16" @click="mobile_drawer=true">
                    <path
                        d="M0 0h256v256H0V0z m384 0h256v256h-256V0zM768 0H1024v256h-256V0zM0 768h256V1024H0v-256z m384 0h256V1024h-256v-256z m384 0H1024V1024h-256v-256zM0 384h256v256H0v-256z m384 0h256v256h-256v-256z m384 0H1024v256h-256v-256z"
                        fill="#515151" p-id="36646"></path>
                  </svg>
                  用户通知
                </div>
                <div class="w-full px-2" v-if="list.length>0">
                  <div class="notice-height-set overflow-hidden">
                    <a-collapse expand-icon-position="right" :bordered="false" class="overflow-auto h-full">

                      <a-collapse-item @click="open_dialog(index)" class="mb-2" :header="idx.title"
                                       v-for="(idx,index) in list" :key="index">
                        <template #expand-icon="{ active }">
                          <div class="font-12" v-if="active">

                            <a-tag color="red" v-if="idx.is_read == 0" size="small" class="mr-1">未读</a-tag>
                            <span class="text-gray-500">{{ idx.created_at }}</span>
                            <icon-up/>
                            收起
                          </div>
                          <div class="font-12" v-else>
                            <a-tag color="red" v-if="idx.is_read == 0" size="small" class="mr-1">未读</a-tag>
                            <span class="text-gray-500">{{ idx.created_at }}</span>
                            <icon-down/>
                            展开
                          </div>
                        </template>
                        <h3 class="font-bold">{{ idx.title }}</h3>
                        <div v-html="idx.content"></div>
                      </a-collapse-item>

                    </a-collapse>
                  </div>


                </div>
                <a-result v-else :status="null" title="暂无通知">
                  <template #icon>
                    <img src="@/assets/images/empty.png" class="w-48" alt="">
                  </template>
                  <template #extra>
                    <a-button type="primary" @click="get_notice_list()" :loading="send_loading">刷新</a-button>
                  </template>
                </a-result>
              </div>
              <!--consum-->
              <div class="work-order-rights w-full" v-if="now_choose=='consum'">
                <div class="work-order-title mx-2">
                  <svg t="1710432399189" class="icon mr-2 mobile_show" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="36645" width="16" height="16" @click="mobile_drawer=true">
                    <path
                        d="M0 0h256v256H0V0z m384 0h256v256h-256V0zM768 0H1024v256h-256V0zM0 768h256V1024H0v-256z m384 0h256V1024h-256v-256z m384 0H1024V1024h-256v-256zM0 384h256v256H0v-256z m384 0h256v256h-256v-256z m384 0H1024v256h-256v-256z"
                        fill="#515151" p-id="36646"></path>
                  </svg>
                  额度消耗
                </div>
                <div class="w-full px-2" v-if="consum_list.length>0">
                  <div class="notice-height-set overflow-hidden">
                    <div class="overflow-auto notice-consum h-full">
                      <div
                          class="relative mb-2 flex flex-grow !flex-row flex-col items-center rounded-[10px] rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none"
                          v-for="(item,index) in consum_list" :key="index">
                        <a-tag color="arcoblue" class="absolute top-2 right-2">{{ consum_type(item.type) }}</a-tag>
                        <div class="ml-[18px] flex h-[80px] w-auto flex-row items-center">
                          <div class="rounded-full bg-lightPrimary p-2 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white" v-html="consum_svg(item.type)">

                        </span>
                          </div>
                        </div>
                        <div class="h-50 ml-4 flex w-auto flex-col justify-center">
                          <p class="font-dm text-sm font-medium text-gray-600 mb-1">{{ item.notes }}</p>
                          <h4 class="text-sm font-bold text-navy-700 mb-1 dark:text-white mb-0 flex items-center"
                              v-if="item.limit">
                            <svg t="1710504822852" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="94187" width="20" height="20">
                              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#F2F6FF"
                                    p-id="94188"></path>
                              <path
                                  d="M519.5776 767.01696a47.5136 47.5136 0 0 1-32.17408-12.53376l-226.16064-207.29856a47.53408 47.53408 0 0 1-9.46176-58.28608l87.28576-157.12256a47.7184 47.7184 0 0 1 41.69728-24.576h277.64736a47.77984 47.77984 0 0 1 41.71776 24.576l87.28576 157.14304a47.53408 47.53408 0 0 1-9.46176 58.28608l-226.16064 207.27808a47.5136 47.5136 0 0 1-32.21504 12.53376z m-71.49568-356.00384a23.83872 23.83872 0 1 0 0 47.67744h143.0528a23.83872 23.83872 0 0 0 0-47.67744z"
                                  fill="#1A66FF" opacity=".8" p-id="94189"></path>
                            </svg>
                            {{ item.limit }} 次
                          </h4>
                          <h4 class="text-sm font-bold text-navy-700 dark:text-white mb-0 flex items-center" v-else>
                            <svg t="1710504653722" class="icon mr-1" viewBox="0 0 1067 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="64687" width="20" height="20">
                              <path
                                  d="M562.461538 27.076923l404.923077 408.615385c29.538462 29.538462 30.769231 80 2.461539 110.76923L745.846154 787.692308c-28.307692 30.769231-76.307692 32-105.846154 2.461538L235.076923 381.538462c-29.538462-29.538462-30.769231-80-2.461538-110.769231L457.846154 29.538462c27.076923-30.769231 73.846154-33.230769 104.615384-2.461539z m0 0"
                                  fill="#FFDF9F" p-id="64688"></path>
                              <path
                                  d="M324.923077 118.153846l518.153846 230.153846c36.923077 16 56.615385 61.538462 39.384615 102.153846L756.923077 759.384615c-16 39.384615-59.076923 59.076923-98.461539 41.846154l-516.923076-230.153846c-36.923077-16-56.615385-61.538462-39.384616-102.153846L226.461538 160c16-39.384615 61.538462-57.846154 98.461539-41.846154z m0 0"
                                  fill="#FFC127" p-id="64689"></path>
                              <path
                                  d="M130.461538 768h813.538462l103.384615 150.153846c38.153846 56.615385 17.230769 100.923077-50.461538 100.923077H67.692308c-65.230769 0-86.153846-44.307692-48-100.923077l110.76923-150.153846z m0 0"
                                  fill="#DAE9FF" p-id="64690"></path>
                              <path
                                  d="M215.384615 345.846154h672c67.692308 0 120.615385 56.615385 120.615385 126.769231v331.076923c0 70.153846-54.153846 126.769231-120.615385 126.76923H215.384615c-67.692308 0-120.615385-56.615385-120.615384-126.76923V472.615385c-1.230769-70.153846 52.923077-126.769231 120.615384-126.769231z m0 0"
                                  fill="#DAE9FF" p-id="64691"></path>
                              <path
                                  d="M195.692308 345.846154h627.692307c67.692308 0 120.615385 56.615385 120.615385 126.769231v331.076923c0 70.153846-54.153846 126.769231-120.615385 126.76923h-627.692307c-67.692308 0-120.615385-56.615385-120.615385-126.76923V472.615385c0-70.153846 52.923077-126.769231 120.615385-126.769231z m0 0"
                                  fill="#1482FF" p-id="64692"></path>
                              <path
                                  d="M614.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0M710.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0M806.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0"
                                  fill="#FFFFFF" p-id="64693"></path>
                              <path
                                  d="M224 477.538462c-17.230769 0-33.230769 13.538462-33.230769 32s13.538462 32 33.230769 32h593.230769c17.230769 0 33.230769-13.538462 33.230769-32s-13.538462-32-33.230769-32H224z m0 0"
                                  fill="#DAE9FF" p-id="64694"></path>
                              <path
                                  d="M205.538462 456.615385c-17.230769 0-33.230769 13.538462-33.23077 32s13.538462 32 33.23077 32h593.230769c17.230769 0 33.230769-18.461538 33.230769-32s-14.769231-32-33.230769-32H205.538462z m0 0"
                                  fill="#FFFFFF" p-id="64695"></path>
                            </svg>
                            {{ item.balance }}
                          </h4>
                          <span class="text-gray-400 font-12">{{ item.created_at }}</span>
                        </div>
                      </div>

                    </div>
                    <a-pagination
                        class="mt-2"
                        :current="consum_page"
                        :page-size="consum_limit"
                        background
                        hide-on-single-page
                        :total="consum_count"
                        @change="handleCurrentChange"
                    />
                  </div>
                </div>
                <a-result v-else :status="null" title="暂无消耗信息">
                  <template #icon>
                    <img src="@/assets/images/empty-list.png" class="w-48" alt="">
                  </template>
                  <template #extra>
                    <a-button type="primary" @click="get_notice_list()" :loading="send_loading">刷新</a-button>
                  </template>
                </a-result>

              </div>
              <!--draw_order-->
              <div class="work-order-rights w-full" v-if="now_choose=='draw'">
                <div class="work-order-title mx-2">
                  <svg t="1710432399189" class="icon mr-2 mobile_show" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="36645" width="16" height="16" @click="mobile_drawer=true">
                    <path
                        d="M0 0h256v256H0V0z m384 0h256v256h-256V0zM768 0H1024v256h-256V0zM0 768h256V1024H0v-256z m384 0h256V1024h-256v-256z m384 0H1024V1024h-256v-256zM0 384h256v256H0v-256z m384 0h256v256h-256v-256z m384 0H1024v256h-256v-256z"
                        fill="#515151" p-id="36646"></path>
                  </svg>
                  绘画订单
                </div>
                <div class="w-full px-2" v-if="draw_list.length>0">
                  <div class="notice-height-set overflow-hidden">
                    <div class="overflow-auto notice-consum h-full">
                      <div
                          class="relative mb-2 flex flex-grow !flex-row flex-col items-center rounded-[10px] rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none"
                          v-for="(item,index) in draw_list" :key="index">
                        <div class="ml-[18px] flex h-[80px] w-auto flex-row items-center">
                          <div class="rounded-full bg-lightPrimary p-2 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                            <img :src="item.buyer_avatar" class="w-14 shadow-sm rounded-full" alt="">
                        </span>
                          </div>
                        </div>
                        <div class="h-50 ml-4 flex w-auto flex-col justify-center">
                          <p class="font-dm text-sm font-medium text-gray-600 mb-1">用户：<span class="text-blue-400">{{ item.buyer_name?item.buyer_name:'未命名' }}</span>购买了您的绘画:{{item.title}}</p>
                          <h4 class="text-sm font-bold text-navy-700 mb-1 dark:text-white mb-0 flex items-center"
                              v-if="item.vip_set">
                            <svg t="1710504822852" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="94187" width="20" height="20">
                              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#F2F6FF"
                                    p-id="94188"></path>
                              <path
                                  d="M519.5776 767.01696a47.5136 47.5136 0 0 1-32.17408-12.53376l-226.16064-207.29856a47.53408 47.53408 0 0 1-9.46176-58.28608l87.28576-157.12256a47.7184 47.7184 0 0 1 41.69728-24.576h277.64736a47.77984 47.77984 0 0 1 41.71776 24.576l87.28576 157.14304a47.53408 47.53408 0 0 1-9.46176 58.28608l-226.16064 207.27808a47.5136 47.5136 0 0 1-32.21504 12.53376z m-71.49568-356.00384a23.83872 23.83872 0 1 0 0 47.67744h143.0528a23.83872 23.83872 0 0 0 0-47.67744z"
                                  fill="#1A66FF" opacity=".8" p-id="94189"></path>
                            </svg>
                            {{ item.vip_set }} 次
                          </h4>
                          <h4 class="text-sm font-bold text-navy-700 dark:text-white mb-0 flex items-center" v-else>
                            <svg t="1710504653722" class="icon mr-1" viewBox="0 0 1067 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="64687" width="20" height="20">
                              <path
                                  d="M562.461538 27.076923l404.923077 408.615385c29.538462 29.538462 30.769231 80 2.461539 110.76923L745.846154 787.692308c-28.307692 30.769231-76.307692 32-105.846154 2.461538L235.076923 381.538462c-29.538462-29.538462-30.769231-80-2.461538-110.769231L457.846154 29.538462c27.076923-30.769231 73.846154-33.230769 104.615384-2.461539z m0 0"
                                  fill="#FFDF9F" p-id="64688"></path>
                              <path
                                  d="M324.923077 118.153846l518.153846 230.153846c36.923077 16 56.615385 61.538462 39.384615 102.153846L756.923077 759.384615c-16 39.384615-59.076923 59.076923-98.461539 41.846154l-516.923076-230.153846c-36.923077-16-56.615385-61.538462-39.384616-102.153846L226.461538 160c16-39.384615 61.538462-57.846154 98.461539-41.846154z m0 0"
                                  fill="#FFC127" p-id="64689"></path>
                              <path
                                  d="M130.461538 768h813.538462l103.384615 150.153846c38.153846 56.615385 17.230769 100.923077-50.461538 100.923077H67.692308c-65.230769 0-86.153846-44.307692-48-100.923077l110.76923-150.153846z m0 0"
                                  fill="#DAE9FF" p-id="64690"></path>
                              <path
                                  d="M215.384615 345.846154h672c67.692308 0 120.615385 56.615385 120.615385 126.769231v331.076923c0 70.153846-54.153846 126.769231-120.615385 126.76923H215.384615c-67.692308 0-120.615385-56.615385-120.615384-126.76923V472.615385c-1.230769-70.153846 52.923077-126.769231 120.615384-126.769231z m0 0"
                                  fill="#DAE9FF" p-id="64691"></path>
                              <path
                                  d="M195.692308 345.846154h627.692307c67.692308 0 120.615385 56.615385 120.615385 126.769231v331.076923c0 70.153846-54.153846 126.769231-120.615385 126.76923h-627.692307c-67.692308 0-120.615385-56.615385-120.615385-126.76923V472.615385c0-70.153846 52.923077-126.769231 120.615385-126.769231z m0 0"
                                  fill="#1482FF" p-id="64692"></path>
                              <path
                                  d="M614.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0M710.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0M806.153846 828.307692c0 17.230769 12.307692 29.538462 28.307692 29.538462 16 0 28.307692-13.538462 28.307693-29.538462 0-17.230769-12.307692-29.538462-28.307693-29.538461-14.769231 0-28.307692 13.538462-28.307692 29.538461z m0 0"
                                  fill="#FFFFFF" p-id="64693"></path>
                              <path
                                  d="M224 477.538462c-17.230769 0-33.230769 13.538462-33.230769 32s13.538462 32 33.230769 32h593.230769c17.230769 0 33.230769-13.538462 33.230769-32s-13.538462-32-33.230769-32H224z m0 0"
                                  fill="#DAE9FF" p-id="64694"></path>
                              <path
                                  d="M205.538462 456.615385c-17.230769 0-33.230769 13.538462-33.23077 32s13.538462 32 33.23077 32h593.230769c17.230769 0 33.230769-18.461538 33.230769-32s-14.769231-32-33.230769-32H205.538462z m0 0"
                                  fill="#FFFFFF" p-id="64695"></path>
                            </svg>
                            {{ item.cost }}
                          </h4>
                          <span class="text-gray-400 font-12">{{ item.created_at }}</span>
                        </div>
                      </div>

                    </div>
                    <a-pagination
                        class="mt-2"
                        :current="draw_page"
                        :page-size="draw_limit"
                        background
                        hide-on-single-page
                        :total="draw_count"
                        @change="handleCurrentChangedraw"
                    />
                  </div>
                </div>
                <a-result v-else :status="null" title="暂无绘画订单">
                  <template #icon>
                    <img src="@/assets/images/empty-star.png" class="w-48" alt="">
                  </template>
                  <template #extra>
                    <a-button type="primary" @click="get_notice_list()" :loading="send_loading">刷新</a-button>
                  </template>
                </a-result>

              </div>
            </a-col>
          </a-row>


        </div>
      </div>
    </div>
  </a-modal>
  <a-drawer
      v-model:visible="mobile_drawer"
      placement="left"
      class="drawer_index"
      unmountOnClose
      :header=false
  >

    <div class="work-order-left p-2 work-order-left-notice">
      <h4 class="work-order-title px-1">通知
        <icon-refresh class="cursor-pointer" @click="get_notice_list()"/>
      </h4>
      <div class="work-order-imgs  kSZC00wT custom-scroll">
        <div @click="now_choose='user_notice'"
             class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
             :class="now_choose=='user_notice'?'active':''">
          <div class="work-order-list-img ">
            <a-badge :count="foreach_notice(list)?0:1" :dot="!foreach_notice(list)"
                     :dotStyle="{ width: '10px', height: '10px' }">
              <img
                  src="@/assets/images/notice-dialog-1.png" alt="用户通知">
            </a-badge>


          </div>
          <div class="work-order-list-right relative">
            <div class="work-order-list-title">用户通知</div>
            <div class="work-order-list-des ">

              <span v-if="foreach_notice(list)">暂无新消息</span>
              <span v-else>🎉有新消息</span>
            </div>
          </div>
        </div>
        <div @click="now_choose='consum'" class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
             :class="now_choose=='consum'?'active':''">
          <div class="work-order-list-img ">
            <img
                src="@/assets/images/notice-dialog-2.png" alt="额度消耗">


          </div>
          <div class="work-order-list-right relative">
            <div class="work-order-list-title">额度消耗</div>
            <div class="work-order-list-des ">
              <span>🎉统计用户消耗次数</span>

            </div>
          </div>
        </div>

        <div @click="now_choose='draw'" class="work-list-info-code mb-2 work-order-left-info cursor-pointer"
             :class="now_choose=='draw'?'active':''">
          <div class="work-order-list-img ">
            <img
                src="@/assets/images/notice-dialog-3.png" alt="绘画订单">


          </div>
          <div class="work-order-list-right relative">
            <div class="work-order-list-title">绘画订单</div>
            <div class="work-order-list-des ">
              <span>🎁用户购买绘画广场图订单</span>

            </div>
          </div>
        </div>

      </div>

    </div>


  </a-drawer>

</template>
<script setup lang="ts">
import {ref} from 'vue'
import {get_consum_limit_for, get_draw_buy, user_notice_list, user_notice_read} from "~/utils/api";
import {Message} from "@arco-design/web-vue";
import {IconCode, IconPlus, IconRefresh, IconDown, IconUp} from "@arco-design/web-vue/es/icon";

const token = useCookie('token')
const props = defineProps({
  user_notice: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['handleCancelNotice']) // 定义emit
const user_notice = computed({
  get() {
    return props.user_notice
  },
  set(val) {
    emit('handleCancelNotice', val)
  }
})
const handleCancelNotice = () => {
  user_notice.value = false
}

const list = ref([])
const consum_list = ref([])
const consum_page = ref(1)
const consum_limit = ref(10)
const consum_count = ref(0)
const send_loading = ref(false)
const draw_list =  ref([])
const draw_page = ref(1)
const draw_limit = ref(10)
const draw_count = ref(0)
const get_notice_list = () => {
  send_loading.value = true
  user_notice_list().then((res: any) => {
    list.value = res._rawValue.data
    send_loading.value = false
  }).catch((err: any) => {
    console.log(err)
    send_loading.value = false
  })

  get_consum_limit_for({
    page: consum_page.value,
    limit: consum_limit.value
  }).then((res: any) => {
    consum_list.value = res._rawValue.data
    consum_count.value = res._rawValue.count
  }).catch((err: any) => {
    console.log(err)
  })

  get_draw_buy({
    page: draw_page.value,
    limit: draw_limit.value
  }).then((res: any) => {
    draw_list.value = res._rawValue.data
    draw_count.value = res._rawValue.count
  }).catch((err: any) => {
    console.log(err)
  })
}

watch(() => user_notice.value, (val) => {
  if (val) {
    get_notice_list()
  }
})

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
    case 'video':
      return '视频'
  }
}

const consum_svg = (type: any) => {
  switch (type) {
    case 'draw':
      return '<svg t="1710504225161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1062" width="48" height="48"><path d="M1023.910943 511.999898c5.11911 317.794367-194.116663 516.825376-511.91103 511.911029-317.794367 4.914346-516.825376-194.116663-511.91103-511.911029C-4.825463 194.20553 194.205546-4.825478 511.999913 0.088868c317.794367-4.914346 516.825376 194.116663 511.91103 511.91103z" fill="#3377FF" p-id="1063"></path><path d="M1022.477592 566.671996C1006.915497 340.40732 852.318366 201.16752 614.382119 204.85328c-254.112635-4.095288-413.624112 155.416189-409.528824 409.528824-3.890524 237.936247 135.554041 392.533378 361.613952 408.095473 268.036615-16.381153 439.629192-187.97373 456.010345-455.805581z" fill="#336DFF" p-id="1064"></path><path d="M1015.515602 629.944199C985.824762 491.523456 876.480566 407.160519 716.764325 409.617692c-190.635668-3.071466-310.218084 116.51095-307.146618 307.146618-2.457173 159.716241 81.905765 269.060437 220.121743 298.751277 211.112109-34.400421 351.375731-174.664043 385.776152-385.571388z" fill="#3364FF" p-id="1065"></path><path d="M312.968905 439.308531L158.781302 678.678129a40.952882 40.952882 0 0 0 34.400422 63.067439h308.375204a40.952882 40.952882 0 0 0 34.400421-63.067439l-154.187602-239.574362a40.952882 40.952882 0 0 0-68.800842 0.204764z" fill="#80AAFF" p-id="1066"></path><path d="M997.701098 705.707031C964.734028 646.734881 902.076118 613.153517 819.146531 614.382104c-127.1587-2.047644-206.812056 77.605712-204.764412 204.764412-1.433351 82.929587 32.352777 145.587497 91.120163 178.554567a431.233852 431.233852 0 0 0 292.198816-291.994052z" fill="#335AFF" p-id="1067"></path><path d="M571.586357 329.554807l-225.240853 349.123322a40.952882 40.952882 0 0 0 34.400421 63.067439h450.481706a40.952882 40.952882 0 0 0 34.400421-63.067439l-225.240853-349.123322a40.952882 40.952882 0 0 0-68.800842 0z" fill="#FFFFFF" p-id="1068"></path><path d="M347.369326 294.540092m-51.191103 0a51.191103 51.191103 0 1 0 102.382206 0 51.191103 51.191103 0 1 0-102.382206 0Z" fill="#FFFFFF" p-id="1069"></path></svg>\n'
    case 'midjourney':
      return '<svg t="1710504225161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1062" width="48" height="48"><path d="M1023.910943 511.999898c5.11911 317.794367-194.116663 516.825376-511.91103 511.911029-317.794367 4.914346-516.825376-194.116663-511.91103-511.911029C-4.825463 194.20553 194.205546-4.825478 511.999913 0.088868c317.794367-4.914346 516.825376 194.116663 511.91103 511.91103z" fill="#3377FF" p-id="1063"></path><path d="M1022.477592 566.671996C1006.915497 340.40732 852.318366 201.16752 614.382119 204.85328c-254.112635-4.095288-413.624112 155.416189-409.528824 409.528824-3.890524 237.936247 135.554041 392.533378 361.613952 408.095473 268.036615-16.381153 439.629192-187.97373 456.010345-455.805581z" fill="#336DFF" p-id="1064"></path><path d="M1015.515602 629.944199C985.824762 491.523456 876.480566 407.160519 716.764325 409.617692c-190.635668-3.071466-310.218084 116.51095-307.146618 307.146618-2.457173 159.716241 81.905765 269.060437 220.121743 298.751277 211.112109-34.400421 351.375731-174.664043 385.776152-385.571388z" fill="#3364FF" p-id="1065"></path><path d="M312.968905 439.308531L158.781302 678.678129a40.952882 40.952882 0 0 0 34.400422 63.067439h308.375204a40.952882 40.952882 0 0 0 34.400421-63.067439l-154.187602-239.574362a40.952882 40.952882 0 0 0-68.800842 0.204764z" fill="#80AAFF" p-id="1066"></path><path d="M997.701098 705.707031C964.734028 646.734881 902.076118 613.153517 819.146531 614.382104c-127.1587-2.047644-206.812056 77.605712-204.764412 204.764412-1.433351 82.929587 32.352777 145.587497 91.120163 178.554567a431.233852 431.233852 0 0 0 292.198816-291.994052z" fill="#335AFF" p-id="1067"></path><path d="M571.586357 329.554807l-225.240853 349.123322a40.952882 40.952882 0 0 0 34.400421 63.067439h450.481706a40.952882 40.952882 0 0 0 34.400421-63.067439l-225.240853-349.123322a40.952882 40.952882 0 0 0-68.800842 0z" fill="#FFFFFF" p-id="1068"></path><path d="M347.369326 294.540092m-51.191103 0a51.191103 51.191103 0 1 0 102.382206 0 51.191103 51.191103 0 1 0-102.382206 0Z" fill="#FFFFFF" p-id="1069"></path></svg>\n'
    default :
      return '<svg t="1710504438709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1444" width="48" height="48"><path d="M1023.910943 511.999898c5.11911 317.794367-194.116663 516.825376-511.91103 511.911029-317.794367 4.914346-516.825376-194.116663-511.91103-511.911029C-4.825463 194.20553 194.205546-4.825478 511.999913 0.088868c317.794367-4.914346 516.825376 194.116663 511.91103 511.91103z" fill="#3377FF" p-id="1445"></path><path d="M1022.477592 566.671996C1006.915497 340.40732 852.318366 201.16752 614.382119 204.85328c-254.112635-4.095288-413.624112 155.416189-409.528824 409.528824-3.890524 237.936247 135.554041 392.533378 361.613952 408.095473 268.036615-16.381153 439.629192-187.97373 456.010345-455.805581z" fill="#336DFF" p-id="1446"></path><path d="M1015.515602 629.944199C985.824762 491.523456 876.480566 407.160519 716.764325 409.617692c-190.635668-3.071466-310.218084 116.51095-307.146618 307.146618-2.457173 159.716241 81.905765 269.060437 220.121743 298.751277 211.112109-34.400421 351.375731-174.664043 385.776152-385.571388z" fill="#3364FF" p-id="1447"></path><path d="M997.701098 705.707031C964.734028 646.734881 902.076118 613.153517 819.146531 614.382104c-127.1587-2.047644-206.812056 77.605712-204.764412 204.764412-1.433351 82.929587 32.352777 145.587497 91.120163 178.554567a431.233852 431.233852 0 0 0 292.198816-291.994052z" fill="#335AFF" p-id="1448"></path><path d="M163.900413 225.329721m266.193735 0l163.81153 0q266.193736 0 266.193735 266.193735l0 0q0 266.193736-266.193735 266.193736l-163.81153 0q-266.193736 0-266.193735-266.193736l0 0q0-266.193736 266.193735-266.193735Z" fill="#80AAFF" p-id="1449"></path><path d="M409.617707 819.146516v-102.382206h163.81153l-147.430377 110.572782a10.238221 10.238221 0 0 1-16.381153-8.190576z" fill="#80AAFF" p-id="1450"></path><path d="M511.999913 496.642567m-40.952882 0a40.952882 40.952882 0 1 0 81.905764 0 40.952882 40.952882 0 1 0-81.905764 0Z" fill="#FFFFFF" p-id="1451"></path><path d="M368.664825 496.642567m-40.952883 0a40.952882 40.952882 0 1 0 81.905765 0 40.952882 40.952882 0 1 0-81.905765 0Z" fill="#FFFFFF" p-id="1452"></path><path d="M655.335001 496.642567m-40.952882 0a40.952882 40.952882 0 1 0 81.905765 0 40.952882 40.952882 0 1 0-81.905765 0Z" fill="#FFFFFF" p-id="1453"></path></svg>'
  }
}

const handleCurrentChange = (val: number) => {
  consum_page.value = val
  get_notice_list()
}

const handleCurrentChangedraw = (val: number) => {
  draw_page.value = val
  get_notice_list()
}
const mobile_drawer = ref(false)

const notice_open = ref(false)
const notice_info = ref({})
const open_dialog = (index: number) => {
  notice_info.value = list.value[index]
  user_notice_read({
    id: list.value[index].id
  }).then((res: any) => {
    get_notice_list()
  }).catch((err: any) => {
    console.log(err)
  })
}
const now_choose = ref('user_notice')
const foreach_notice = (list) => {
  if (list.length == 0) {
    return true;
  }
  for (const item of list) {
    if (item.is_read == 1) {
      return true;
    }
  }
  return false;
}
</script>

<style scoped>

</style>
