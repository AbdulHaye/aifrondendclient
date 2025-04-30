<template>
  <main class="main overflow-auto ai-work-order pb-20 bg-gray-50">
    <div class="p-4">
      <div class="code-title mb-3 inline-block">
        <h2>
          工单系统 | Work Order System
        </h2>
        <span>反馈用户遇到的问题</span>
      </div>
      <div class="work-order-wrap px-0 container shadow-sm">
        <div class="work-order-set overflow-hidden">
          <a-row :gutter="10">
            <a-col :lg="6" :xs="24" class="mobile_hidden">
              <a-spin :loading="work_list_loading"  size="large">
                <template #icon>
                  <div class="flex justify-center">
                    <svg class="arco-icon-loading" width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z" fill="url(#svg_2fc1cd5fdf__paint0_linear_118545_226288)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7998 5.85002C12.4998 5.45002 11.0998 5.50002 9.79984 6.00002C8.49984 6.50002 7.39984 7.35002 6.64984 8.50002C5.89984 9.65002 5.54984 11 5.59984 12.4C5.64984 13.8 6.19984 15.1 7.09984 16.15C7.99984 17.2 9.19984 17.95 10.5498 18.25C11.8998 18.55 13.2998 18.45 14.5498 17.85C15.4498 17.45 16.4998 17.85 16.8998 18.75C17.2998 19.65 16.8998 20.7 15.9998 21.1C14.0498 21.95 11.8498 22.2 9.74984 21.7C7.64984 21.2 5.74984 20.05 4.34984 18.45C2.99984 16.85 2.14984 14.8 1.99984 12.65C1.89984 10.5 2.44984 8.35002 3.59984 6.55002C4.79984 4.75002 6.49984 3.35002 8.54984 2.65002C10.5498 1.90002 12.7998 1.85002 14.8498 2.45002C16.8998 3.05002 18.7498 4.30002 19.9998 6.00002C21.2998 7.75002 21.9998 9.80002 21.9998 12C21.9998 13 21.1998 13.8 20.1998 13.8C19.1998 13.8 18.3998 13 18.3998 12C18.3998 10.6 17.9498 9.30002 17.1498 8.15002C16.2998 7.05002 15.1498 6.25002 13.7998 5.85002Z" fill="url(#svg_2fc1cd5fdf__paint1_linear_118545_226288)"></path><defs><linearGradient id="svg_2fc1cd5fdf__paint0_linear_118545_226288" x1="13.215" y1="6.907" x2="10.715" y2="16.282" gradientUnits="userSpaceOnUse"><stop stop-color="#1765FF"></stop><stop offset=".031" stop-color="#1765FF" stop-opacity=".969"></stop><stop offset="1" stop-color="#1765FF" stop-opacity="0"></stop></linearGradient><linearGradient id="svg_2fc1cd5fdf__paint1_linear_118545_226288" x1="-.574" y1="9.566" x2="18.802" y2="13.316" gradientUnits="userSpaceOnUse"><stop stop-color="#ADC9FF"></stop><stop offset="1" stop-color="#8AB1FF" stop-opacity="0"></stop></linearGradient></defs></svg>

                  </div>
                </template>
                <div class="work-order-left " >
                  <div class="work-order-title px-3">工单 <icon-refresh class="cursor-pointer" @click="work_list_get()" /> </div>
                  <div class="work-order-imgs  kSZC00wT custom-scroll" v-if="work_list_total>0">
                    <div class="work-list-info-code mb-2 work-order-left-info cursor-pointer" @click="check_info(item.id)" :class="now_work.id==item.id?'active':''" v-for="(item,index) in work_list_data" :key="index">
                      <div class="work-order-list-img ">
                        <a-badge :count="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'?0:1" :dot="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'?false:true" :dotStyle="{ width: '10px', height: '10px' }">
                          <img
                              src="@/assets/images/service_order.png" alt="工单">
                        </a-badge>

                      </div>
                      <div class="work-order-list-right relative">
                        <div class="work-order-list-title">{{ item.title }}</div>
                        <div class="work-order-list-des ">
                          <!--判断item中get_work_meta循环数组里的is_read是否为1，如果为1则显示已读，否则显示未读-->
                          <span v-if="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'">暂无新消息</span>
                          <span v-else>🎉有新消息</span>
                          <a-tag :color="item.status==1?'red':'arcoblue'" size="small" class="ml-2 absolute top-0.5 right-0">{{item.status==1?'未完结':'已完结'}}</a-tag>

                        </div>

                      </div>
                    </div>
                    <a-pagination
                        size="small"
                        :total="work_list_total"
                        :current="work_list_page"
                        :page-size="work_list_limit"
                        class="justify-content-center mb-2"
                        background
                        @change="WorkhandleCurrentChange"
                        :hide-on-single-page=true
                    />
                  </div>
                  <a-empty v-else class="work-order-imgs  kSZC00wT custom-scroll" description="暂无工单"></a-empty>
                  <div class="p-2">
                    <a-button class="w-full" type="primary" @click="create_work()">
                      <template #icon>
                        <IconPlus/>
                      </template>
                      新建工单
                    </a-button>
                  </div>

                </div>

              </a-spin>


            </a-col>
            <a-col :lg="18" :xs="24">
              <div class="work-order-rights w-full">
                <div class="work-order-title mx-2">
                  <svg t="1710432399189" @click="mobile_drawer=true" class="icon mr-2 mobile_show" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36645" width="16" height="16"><path d="M0 0h256v256H0V0z m384 0h256v256h-256V0zM768 0H1024v256h-256V0zM0 768h256V1024H0v-256z m384 0h256V1024h-256v-256z m384 0H1024V1024h-256v-256zM0 384h256v256H0v-256z m384 0h256v256h-256v-256z m384 0H1024v256h-256v-256z" fill="#515151" p-id="36646"></path></svg>
                  工单内容
                </div>
                <div class="w-full">
                  <div class="chat-list-content bg-white py-2 rounded-xl mx-2 hat active-chat" data-chat="person2">
                    <div class="chat-off-content" v-if="now_work.id">
                      <div class="bubble" :class="i.type=='me'?'me':'you'" v-for="(i,dex) in now_work.get_meta" :key="dex">
                        {{ i.content }}
                      </div>
                    </div>
                    <div v-else>
                      <a-result :status="null" title="暂无工单内容~" subtitle="如果您遇到什么问题，随时可以联系我">
                        <template #icon>
                          <img src="@/assets/images/ai_work.gif" class="m-auto w-40" alt="empty" />

                        </template>
                        <template #extra>
                          <a-space>
                            <a-button type="primary" @click="create_work()">
                              <template #icon>
                                <IconPlus/>
                              </template>
                              新建工单
                            </a-button>
                          </a-space>
                        </template>
                      </a-result>

                    </div>
                  </div>
                  <div class="mx-2 mt-2">
                    <a-row :gutter="5" class="w-full">
                      <a-col :xs="24" :lg="21">
                        <a-textarea class="w-full" @keydown.enter.native.prevent="handleSend()" v-model="input" placeholder="请输入内容" />

                      </a-col>
                      <a-col :xs="24" :lg="3">
                        <a-button class="w-full" :disabled="!now_work.id" :loading="send_loading" type="primary"  @click="handleSend()">
                          <template #icon>
                            <IconCode/>
                          </template>
                          发送
                        </a-button>

                      </a-col>
                    </a-row>
                  </div>

                </div>

              </div>
            </a-col>
          </a-row>


        </div>
      </div>


    </div>
    <Login :login_dialog="login_dialog" @handleCancel="handleCancel"/>
    <a-modal v-model:visible="send_dialog" title="提交工单" class="message_work_modal" :footer="false">
      <div class="message_work_modal_content">
        <div class="message_work_modal_title mb-4">
          <h5>工单标题</h5>
          <a-input placeholder="请输入标题" v-model="ruleForm.title" />
        </div>
        <div class="message_work_modal_input">
          <h5>问题说明</h5>
          <a-textarea v-model="ruleForm.content" placeholder="请输入内容" />
        </div>
        <div class="message_work_modal_btn">
          <a-button type="primary" @click="create_send()">
            <template #icon>
              <IconPlus/>
            </template>
            发送
          </a-button>
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

      <div class="work-order-left p-2">
        <div class="work-order-title px-1 font-18">工单 <icon-refresh class="cursor-pointer" @click="work_list_get()" /> </div>
        <div class="work-order-imgs kSZC00wT custom-scroll">
          <div class="work-list-info-code mb-2 work-order-left-info cursor-pointer" @click="check_info(item.id)" :class="now_work.id==item.id?'active':''" v-for="(item,index) in work_list_data" :key="index">
            <div class="work-order-list-img ">
              <a-badge :count="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'?0:1" :dot="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'?false:true" :dotStyle="{ width: '10px', height: '10px' }">
                <img
                    src="@/assets/images/service_order.png" alt="工单">
              </a-badge>

            </div>
            <div class="work-order-list-right relative">
              <div class="work-order-list-title">{{ item.title }}</div>
              <div class="work-order-list-des ">
                <!--判断item中get_work_meta循环数组里的is_read是否为1，如果为1则显示已读，否则显示未读-->
                <span v-if="item.get_work_meta[0].is_read == 1 || item.get_work_meta[0].type=='me'">暂无新消息</span>
                <span v-else>🎉有新消息</span>
                <a-tag :color="item.status==1?'red':'arcoblue'" size="small" class="ml-2 absolute top-0.5 right-0">{{item.status==1?'未完结':'已完结'}}</a-tag>

              </div>

            </div>
          </div>
          <a-pagination
              size="small"
              :total="work_list_total"
              :current="work_list_page"
              :page-size="work_list_limit"
              class="justify-content-center mb-2"
              background
              @change="WorkhandleCurrentChange"
              :hide-on-single-page=true
          />
        </div>


      </div>


      <template #footer>
        <div class="p-2">
          <a-button class="w-full" type="primary" @click="create_work()">
            <template #icon>
              <IconPlus/>
            </template>
            新建工单
          </a-button>
        </div>
      </template>


    </a-drawer>

  </main>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {
  IconCode,
  IconDelete,
  IconDown,
  IconEdit,
  IconLoop,
  IconPlus,
  IconRefresh,
  IconUser
} from "@arco-design/web-vue/es/icon";
import {Message} from "@arco-design/web-vue";
import {check_work, work_create, work_list,send_work} from "~/utils/api";

const token = useCookie('token')
const input = ref('')
const login_dialog = ref(false)
const login_dialog_click = () => {
  login_dialog.value = true
}
const handleCancel = () => {
  login_dialog.value = false
}

const work_list_data = ref([])
const work_list_loading = ref(false)
const work_list_page = ref(1)
const work_list_limit = ref(10)
const work_list_total = ref(0)
const now_work = ref({})
const mobile_drawer = ref(false)
const work_list_get = () => {
  work_list_loading.value = true
  work_list({
    page: work_list_page.value,
    limit: work_list_limit.value
  }).then((res: any) => {
    work_list_data.value = res._rawValue.data
    work_list_total.value = res._rawValue.count
    work_list_loading.value = false

  }).catch((err: any) => {
    console.log(err)
    work_list_loading.value = false
  })

}
work_list_get()

const send_dialog = ref(false)
const send_loading = ref(false)
const handleSend = () => {
  if (!token.value){
    login_dialog_click()
    return false
  }
  if (input.value == ''){
    Message.error('请输入内容')
    return false
  }
  send_loading.value = true
  send_work({
    id: now_work.value.id,
    content: input.value
  }).then((res: any) => {
    input.value = ''
    check_info(now_work.value.id)
    send_loading.value = false
  }).catch((err: any) => {
    console.log(err)
    send_loading.value = false
  })
}
const create_work = () => {
  if (!token.value){
    login_dialog_click()
    return false
  }
  send_dialog.value = true
}


const ruleForm = reactive({
  title: '',
  content: ''
})
const create_send = () => {
  if (!token.value){
    login_dialog_click()
    return false
  }
  work_create({
    title: ruleForm.title,
    content: ruleForm.content
  }).then((res: any) => {
    send_dialog.value = false
    Message.success('创建成功')
    work_list_get()
  }).catch((err: any) => {
    console.log(err)
  })
}

const WorkhandleCurrentChange = (val: number) => {
  work_list_page.value = val
  work_list_get()
}

const check_info = (id: number) => {
  timer.value && clearInterval(timer.value)
  check_work({
    id: id
  }).then((res: any) => {
    now_work.value = res._rawValue.data
    intervalTo(id)
    down_message()
  }).catch((err: any) => {
    console.log(err)
  })
}

const timer = ref()
const intervalTo = (id:number) => {
  timer.value = setInterval(() => {
    check_info(id)
  }, 5000)
}

const down_message = () => {
  setTimeout(() => {
    let chat = document.getElementsByClassName('chat-off-content')[0]
    chat.style.transition = "500ms"; // 过渡时间为0.5秒
    chat.scrollTo({top: chat.scrollHeight, behavior: 'smooth'});
  }, 100)
}

onUnmounted(() => {
  timer.value && clearInterval(timer.value)
})
</script>


<style scoped>

</style>
