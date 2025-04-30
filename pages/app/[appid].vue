<template>
    <main class="main overflow-auto ai-app-appid">
        <Head>
            <Title>{{ info.title }} - {{counter.setting.title}}</Title>
        </Head>
        <div class="w-full pb-20">
            <div class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                <nav class="flex" aria-label="Breadcrumb">
                    <ol role="list" class="flex items-center space-x-4">
                        <li>
                            <div><NuxtLink class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-500" to="/ai_application">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                     aria-hidden="true" class="h-5 w-5 flex-shrink-0">
                                    <path fill-rule="evenodd"
                                          d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span class="">应用列表</span>
                            </NuxtLink>
                            </div>
                        </li>
                    </ol>
                </nav>
                <div class="mx-auto flex max-w-3xl flex-col items-center justify-center py-2">
                    <main class="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4  sm:mt-20"><h1
                        class="max-w-[708px] text-4xl font-bold text-slate-900 sm:text-6xl">{{ info.title }}</h1>
                        <p class="mt-6 text-lg leading-8 text-gray-600">{{ info.description }}</p>
                      <a-space>
                        <a-tag v-if="counter.setting.application_preset_open=='1'" color="arcoblue" class="cursor-pointer mt-4" @click="dialog_scene=true">
                          <template #icon>
                            <icon-code />
                          </template>
                          预设配置
                        </a-tag>
                        <a-tag color="arcoblue" class="mt-4">
                          <div class="flex">
                            消耗：
                            <svg t="1704720328090" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10684" width="20" height="20"><path d="M212.096 817.2928c-166.621867-166.621867-166.621867-436.7744 0-603.396267 166.626133-166.621867 436.778667-166.621867 603.400533 0 166.621867 166.621867 166.621867 436.7744 0 603.396267-166.621867 166.626133-436.7744 166.626133-603.396266 0z m45.256533-45.252267c141.632 141.627733 371.259733 141.627733 512.887467 0 141.632-141.632 141.632-371.259733 0-512.887466-141.627733-141.632-371.255467-141.632-512.887467 0-141.627733 141.627733-141.627733 371.255467 0 512.887466z m286.016-216.712533h98.133334c23.5648 0 42.666667 10.568533 42.666666 34.133333s-19.101867 29.866667-42.666666 29.866667h-98.133334v64c0 23.5648-10.568533 42.666667-34.133333 42.666667-23.560533 0-29.866667-19.101867-29.866667-42.666667v-64h-98.133333c-23.560533 0-42.666667-6.301867-42.666667-29.866667s19.106133-34.133333 42.666667-34.133333h98.133333v-64h-98.133333c-23.560533 0-42.666667-6.301867-42.666667-29.866667s19.106133-34.133333 42.666667-34.133333h93.034667L406.024533 358.152533c-15.982933-16.251733-20.2496-34.065067-4.266666-50.3168 15.982933-16.247467 37.632-11.9808 53.610666 4.266667l57.847467 58.816 58.4192-59.4048c15.982933-16.247467 37.632-20.514133 53.614933-4.266667 15.982933 16.256 11.716267 34.065067-4.266666 50.3168l-68.8256 69.76h89.344c23.5648 0 42.666667 10.5728 42.666666 34.133334 0 23.569067-19.101867 29.866667-42.666666 29.866666h-98.133334v64z" fill="#165dff" p-id="10685"></path></svg>
                            <span>{{info.cost_money}} {{counter.setting.money_name_set}} </span>
                            <span>/</span>
                            <svg t="1704720415578" class="icon mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12334" width="20" height="20"><path d="M724.949333 160a74.666667 74.666667 0 0 1 60.373334 30.741333l137.514666 189.077334a74.666667 74.666667 0 0 1-5.013333 94.016L567.36 861.162667a74.666667 74.666667 0 0 1-110.72 0L106.176 473.834667a74.666667 74.666667 0 0 1-5.013333-94.016l137.514666-189.077334a74.666667 74.666667 0 0 1 60.373334-30.741333h425.898666z m0 64H299.050667a10.666667 10.666667 0 0 0-8.618667 4.394667l-137.514667 189.077333a10.666667 10.666667 0 0 0 0.725334 13.44L504.106667 818.197333a10.666667 10.666667 0 0 0 15.829333 0l350.442667-387.328a10.666667 10.666667 0 0 0 0.725333-13.44l-137.514667-189.056a10.666667 10.666667 0 0 0-8.618666-4.394666z m-63.893333 182.229333a32 32 0 0 1 47.445333 42.944l-172.778666 190.954667a32 32 0 0 1-47.445334 0l-172.202666-190.314667a32 32 0 0 1 47.445333-42.944L512 570.965333l149.056-164.736z" fill="#165dff" p-id="12335"></path></svg>
                            <span>{{info.cost_limit}} 次</span>
                          </div>

                        </a-tag>
                      </a-space>

                        <div class="flex w-full max-w-xl flex-col items-center">
                            <a-textarea
                                        :auto-size="{ minRows: 3, maxRows: 12 }"
                                        v-model="code"
                                        :disabled="send_loading"
                                        class="mt-5"
                                        allow-clear
                                        show-word-limit
                                        placeholder="请输入点什么吧~"
                            ></a-textarea>
                            <div class="flex gap-4 self-end">
                                <a-space>
                                    <a-button type="primary"
                                              status="warning"
                                              size="large"
                                              round
                                              @click="ai_collect_send(info.id)"
                                              class="mx-atuo mt-8 rounded-xl bg-black px-8 py-2 font-medium text-white hover:bg-black/80 sm:mt-10">
                                        <template #icon>
                                            <icon-star />
                                        </template>
                                        收藏
                                    </a-button>
                                    <a-button type="primary"
                                              size="large"
                                              round
                                              @click="run_app_choose()"
                                              :loading="send_loading"
                                              class="mx-atuo mt-8 rounded-xl bg-black px-8 py-2 font-medium text-white hover:bg-black/80 sm:mt-10">
                                        <template #icon>
                                            <icon-play-arrow />
                                        </template>
                                        运行
                                    </a-button>
                                </a-space>

                            </div>
                            <div class="output_content my-10 w-full space-y-10 bg-white rounded p-3 shadow-sm" v-if="last_content" v-html="renderMarkdown(last_content).replace(/\\n/g, '\n')">

                            </div>
                                <a-button class="h-30"
                                          type="primary"
                                          v-if="last_content"
                                          @click="handleClick(last_content)">
                                    <icon-copy />
                                    <span class="ant_hide">复制内容</span>
                                </a-button>


                        </div>
                    </main>
                </div>
            </div>
            <a-modal
                v-model:visible="dialog_scene"
                class="mb_dialog"
            >
                <template #title>
                    预设配置
                </template>
                <h6 class="mb-3">大模型选择</h6>
              <a-radio-group
                  class="mb-3 flex-wrap"
                  @change="big_model_change"
                  v-model="model_big_choose"
                  type="button"
              >
                <a-radio v-for="(models,m_index) in big_model_list"
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
                >{{ mod.title }}</a-radio
                >
              </a-radio-group>
              <a-empty v-if="model_list.length == 0">暂无模型</a-empty>
                <template #footer>
            <span class="dialog-footer">
                <a-button type="primary" @click="dialog_scene = false">
                    配置完成
                </a-button>
            </span>
                </template>
            </a-modal>
            <div class="qas">
                <div class="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
                    <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">小应用可以做什么</h2>
                    <p class="mt-6 max-w-2xl text-base leading-7 text-gray-600">
                        问答系统：根据用户提供的问题生成有关某个主题的答案。

                        文本摘要：从长文章中提取关键信息，生成简洁易懂的摘要。

                        语言翻译：将文本从一种语言翻译成另一种语言。

                        代码生成：根据用户提供的描述自动生成代码片段。

                        创意写作：为用户生成短篇或长篇的创意性文本，如故事、博客文章、广告文案等。
                    </p>
                    <div class="mt-20">
                        <dl class="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
                            <div v-for="faq in app_qs" :key="faq.id">
                                <dt class="text-base font-semibold leading-7 text-gray-900">{{ faq.title }}</dt>
                                <dd class="mt-2 text-base leading-7 text-gray-600">{{ faq.answer }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import {get_app_qs} from "~/utils/api";
import {useCounter} from "~/store/counter";
import {
    IconCode,
    IconStar,
    IconPlayArrow,
    IconCopy,
    IconShareExternal, IconDoubleDown, IconFaceFrownFill, IconDoubleRight, IconDelete, IconFaceSmileFill
} from "@arco-design/web-vue/es/icon";
import markdownItKatex from "markdown-it-katex";
import html2canvas from "html2canvas";
const route = useRoute();
const appid = ref(route.params.appid);
const token = useCookie('token')
const info = ref({});
const counter = useCounter()
useHead({
    meta: [
        { name: 'description', content: counter.setting.description},
        { name: 'keywords', content: counter.setting.keywords}
    ]
})
const get_appid_info = ()=>{
    get_appid({
        appid: appid.value
    }).then((res:any)=>{
        info.value = res._rawValue.data
        code.value = info.value.test_input
    })
}
get_appid_info()




const renderMarkdown = (markdown: any) => {
    return markdownIt({
        linkify: true, // 添加linkify插件
        highlight: (str: string, lang: string) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${hljs.highlight(str, {
                        language: lang,
                        ignoreIllegals: true
                    }).value}</code></pre>`
                } catch (__) {
                }
            }

            return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${markdownIt().utils.escapeHtml(str)}</code></pre>`
        },
        breaks: true // 添加breaks插件
    }).use(markdownItKatex).render(markdown)
}
const { public: { baseUrl } } = useRuntimeConfig()
const headers = {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'text/event-stream',
}
const isInvalidJSON = (data:string)=> {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
}
const streams = ref()
const send_loading = ref(false)
const last_content = ref('')
const code = ref('')
const run_app = async ()=>{
    last_content.value = ''
    send_loading.value = true
    if (!token.value) {
        Message.warning('请先登录')
        return false
    }
    const res = await fetch(`${window.APP_CONFIG.baseUrl}now_app`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            code: code.value,
            appid: appid.value,
            model_is_select: model_is_select.value,
        }),

    })
    if (code.value.length==''){
        send_loading.value = false
        Message.error('内容不得为空')
        return false
    }
    if (res.status==500){
        send_loading.value = false
        Message.error('服务器错误')
        return false
    }
    if (res.status==401){
        send_loading.value = false
        Message.error('请先登录')
        return false
    }
    if (res.status==402){
        send_loading.value = false
        Message.error('发送次数已达上限或余额不足')
        return false
    }
    if (res.status==403){
        send_loading.value = false
        Message.error('禁止发送违禁词')
        return false
    }
    let partialData = '';
    const stream = res.body?.getReader();
    const onData = ({ value }: { value: Uint8Array }) => {
      const chunk = new TextDecoder().decode(value);
      if (isInvalidJSON(chunk)) {
        const json = JSON.parse(chunk);
        if (json.error && json.error.message) {
          last_content.value = json.error.message;
          return; // 或者进行其他错误处理
        }
        return;
      }
      const lines = (partialData + chunk).split('\n');

      partialData = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === 'data: [DONE]') {
          // 如果是最后一行，跳过处理
          continue;
        }

        try {
          const trimmedLine = line.trim(); // 去除行首尾的空格
          if (trimmedLine.startsWith('data:')) {
            const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
            const json = JSON.parse(jsonData);
            if (json.choices) {
              for (const choice of json.choices) {
                const content = choice.delta?.content;
                if (content) {
                  last_content.value += content;
                }
                if (choice.finish_reason === 'stop') {
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
            send_loading.value = false
            code.value =''

        } else {
            onData(result!);
            await read();
        }
    };
    await read();

}
const app_qs = ref([])
const get_qs_start = ()=>{
    get_app_qs().then((res:any)=>{
        app_qs.value = res._rawValue.data
    }).catch((err:any)=>{
        console.log(err)
    })
}
get_qs_start()
const ai_collect_send = (id:string)=>{
    ai_collect({
        id:id
    }).then((res:any)=>{
        Message.success(res._rawValue.message)
    }).catch((err:any)=>{
        console.log(err)
    })
}
const handleClick = (command: any) => {
    const textarea = document.createElement('textarea');
    textarea.value = command.replace(/&nbsp;/g, ' ');
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    Message.success('复制成功');
}
const dialog_scene = ref(false)
const model_is_select = ref()
const scene_p_model = ref([]) as any
const now_model_title = ref('')
const s_page = ref(1)
const s_limit = ref(4)
const model_list = ref([])

const model_big_choose = ref(counter.setting.gpt_new_qs_open == '1' ? 'gpt' : counter.setting.fly_qs_open == '1' ? 'fly' : 'baidu')
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
};
const big_model_list = ref([])
const scene_all = () => {
    get_scene_f({
        page: s_page.value,
        limit: s_limit.value,
    }).then((res: any) => {
        scene_p_model.value = res._rawValue.p_data
        model_list.value = res._rawValue.model
      model_big_choose.value = res._rawValue.normal_model
      model_list.value = res._rawValue.model;
      big_model_list.value = res._rawValue.model;
      model_list.value = res._rawValue.model[0].small_model;
      if (model_list.value.length > 0) {
        model_is_select.value = model_list.value[0].model;
        now_model_title.value = model_list.value[0].title;
      }
    }).catch((err: any) => {
        console.log(err)
    })
}
scene_all()
const run_app_choose = () => {
    if(model_big_choose.value=='gpt'){
        run_app()
    }else if(model_big_choose.value=='fly'){
        run_fly()
    }else if(model_big_choose.value=='baidu'){
        run_baidu()
    }else if(model_big_choose.value=='chatglm'){
        run_chatglm()
    }else if (model_big_choose.value=='qwen'){
        run_qwen()
    }else if (model_big_choose.value=='tencent'){
        run_tencent()
    }else if (model_big_choose.value=='kimi'){
        run_kimi()
    }else{
        run_app()
    }
}
const run_fly = async () => {
    last_content.value = ''
    send_loading.value = true
    if (!token.value) {
        Message.warning('请先登录')
        return false
    }


    send_loading.value = true
    const formData = new FormData();
    formData.append('code', code.value);
    formData.append('appid', appid.value as any);
    formData.append('model_is_select', model_is_select.value);

    const res = await fetch(`${window.APP_CONFIG.baseUrl}app_send_fly_msg`, {
        method: 'POST',
        headers: headers,
        body: formData,

    })
    if (code.value.length==''){
        send_loading.value = false
        Message.error('内容不得为空')
        return false
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
    const stream = res.body?.getReader();
    const onData = ({value}: { value: Uint8Array }) => {
        let result = new TextDecoder().decode(value);
        let arr = result.split('\n\n').map(str => str.replace(/\n/g, ''));
        let new_arr: any[] = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slice(-2) == '}}' && arr[i].startsWith('data:')) {
                new_arr.push(JSON.parse(arr[i].replace('data:', '')));
            } else if (arr[i].startsWith('data:') && arr[i].slice(-2) != ']}') {
                streams.value = arr[i].replace('data:', '');
            } else if (arr[i].slice(-2) == '}}' && arr[i].startsWith('data:') == false) {
                // 与streams.value拼接成一个字符串
                let str = streams.value += arr[i]
                new_arr.push(JSON.parse(str.replace('data:', '')))
                streams.value = ''
            } else {
                if (arr[i].includes('"error"')) {
                    last_content.value = JSON.parse(arr[i]).error.message
                }
                streams.value = ''
            }


            if (arr[i].includes('reply_content:')) {
                reply_in = true;
            }
            if (reply_in) {
                let replyContent = arr[i];
                let content = replyContent.substring(14);
                for (let i = 0; i < content.length; i++) {
                    setTimeout(() => {
                        last_content.value += content.charAt(i)
                    }, 1000)
                }
            }
        }
        for (let i = 0; i < new_arr.length; i++) {
            setTimeout(() => {
                if (new_arr[i].payload.choices.text[0].content) {
                    last_content.value += new_arr[i].payload.choices.text[0].content
                }
            }, 100)

        }

    };


    const read = async () => {
        const result = await stream?.read();
        if (result?.done) {
            send_loading.value = false
            code.value =''
        } else {
            send_loading.value = true
            onData(result!);
            await read();
        }
    };
    await read();



}
const run_baidu = async () => {
    last_content.value = ''
    send_loading.value = true
    if (!token.value) {
        Message.warning('请先登录')
        return false
    }
  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('appid', appid.value as any);
  formData.append('model_is_select', model_is_select.value);
    const res = await fetch(`${window.APP_CONFIG.baseUrl}app_run_baidu_send`, {
        method: 'POST',
        headers: headers,
        body: formData,

    })
    if (code.value.length==''){
        send_loading.value = false
        Message.error('内容不得为空')
        return false
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
    const stream = res.body?.getReader();
    const onData = ({value}: { value: Uint8Array }) => {
        let result = new TextDecoder().decode(value);
        let arr = result.split('\n\n').map(str => str.replace(/\n/g, ''));
        let new_arr: any[] = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].slice(-2) == '}}' && arr[i].startsWith('data:')) {
                new_arr.push(JSON.parse(arr[i].replace('data:', '')));
            } else if (arr[i].startsWith('data:') && arr[i].slice(-2) != ']}') {
                streams.value = arr[i].replace('data:', '');
            } else if (arr[i].slice(-2) == '}}' && arr[i].startsWith('data:') == false) {
                // 与streams.value拼接成一个字符串
                let str = streams.value += arr[i]
                new_arr.push(JSON.parse(str.replace('data:', '')))
                streams.value = ''
            } else {
                if (arr[i].includes('"error_msg"')) {
                   last_content.value = JSON.parse(arr[i]).error_msg
                }
                streams.value = ''
            }


            if (arr[i].includes('reply_content:')) {
                reply_in = true;
            }
            if (reply_in) {
                let replyContent = arr[i];
                let content = replyContent.substring(14);
                for (let i = 0; i < content.length; i++) {
                    setTimeout(() => {
                       last_content.value += content.charAt(i)

                    }, 1000)
                }
            }
        }
        for (let i = 0; i < new_arr.length; i++) {
            setTimeout(() => {
                if (new_arr[i].result) {
                   last_content.value += new_arr[i].result
                }

            }, 100)

        }

    };


    const read = async () => {
        const result = await stream?.read();
        if (result?.done) {
            send_loading.value = false
            code.value =''
        } else {
            send_loading.value = true
            onData(result!);
            await read();
        }
    };
    await read();



}

const run_chatglm = async () => {
  last_content.value = ''
  send_loading.value = true
  if (!token.value) {
    Message.warning('请先登录')
    return false
  }
  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('appid', appid.value as any);
  formData.append('model_is_select', model_is_select.value);
  const res = await fetch(`${window.APP_CONFIG.baseUrl}run_chatglm_send_app`, {
    method: 'POST',
    headers: headers,
    body: formData,

  })
  if (code.value.length==''){
    send_loading.value = false
    Message.error('内容不得为空')
    return false
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
  let partialData = '';
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        last_content.value = json.error.message;
        return; // 或者进行其他错误处理
      }
      return;
    }
    const lines = (partialData + chunk).split('\n');

    partialData = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === 'data: [DONE]') {
        // 如果是最后一行，跳过处理
        continue;
      }

      try {
        const trimmedLine = line.trim(); // 去除行首尾的空格
        if (trimmedLine.startsWith('data:')) {
          const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
          const json = JSON.parse(jsonData);
          if (json.choices) {
            for (const choice of json.choices) {
              const content = choice.delta?.content;
              if (content) {
                last_content.value += content;
              }
              if (choice.finish_reason === 'stop') {
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
      send_loading.value = false
      code.value =''

    } else {
      onData(result!);
      await read();
    }
  };
  await read();



}


const run_qwen = async () => {
  last_content.value = ''
  send_loading.value = true
  if (!token.value) {
    Message.warning('请先登录')
    return false
  }
  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('appid', appid.value as any);
  formData.append('model_is_select', model_is_select.value);
  const res = await fetch(`${window.APP_CONFIG.baseUrl}run_qwen`, {
    method: 'POST',
    headers: headers,
    body: formData,

  })
  if (code.value.length==''){
    send_loading.value = false
    Message.error('内容不得为空')
    return false
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
  const stream = res.body?.getReader();
  const onData = ({value}: { value: Uint8Array }) => {
    let result = new TextDecoder().decode(value);
    let lines = result.split("\n"); // Split the string into lines
    let currentEvent = '';
    let currentID = '';
    let currentData = '';
    let events = [] as any; // 存储事件
    let combinedText = ''; // 存储所有事件的 text 字段

    lines.forEach(line => {
      if (line.startsWith("event:")) {
        currentEvent = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("id:")) {
        currentID = line.split(":")[1]?.trim() || "";
      } else if (line.startsWith("data:")) {
        if(currentData){
          currentData += "\n" + line.slice("data:".length);
        }else{
          currentData = line.slice("data:".length);
        }

        if (currentEvent && currentData) {
          let text = '';
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
            text: text
          });

          combinedText += text; // 将当前事件的 text 字段添加到 combinedText 中

          // 重置当前的事件、ID 和数据
          currentEvent = '';
          currentID = '';
          currentData = '';
        }
      }
    });

    // 在这里，你可以根据需要处理 events 数组
    for (let i = 0; i < events.length; i++) {
      last_content.value += combinedText
    }

  };


  const read = async () => {
    const result = await stream?.read();
    if (result?.done) {
      send_loading.value = false
      code.value =''
    } else {
      send_loading.value = true
      onData(result!);
      await read();
    }
  };
  await read();



}

const run_tencent = async ()=>{
  last_content.value = ''
  send_loading.value = true
  if (!token.value) {
    Message.warning('请先登录')
    return false
  }

  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('appid', appid.value as any);
  formData.append('model_is_select', model_is_select.value);

  const res = await fetch(`${window.APP_CONFIG.baseUrl}run_tencent_app`, {
    method: 'POST',
    headers: headers,
    body: formData,

  })
  if (code.value.length==''){
    send_loading.value = false
    Message.error('内容不得为空')
    return false
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
  let partialData = '';
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        last_content.value = json.error.message;
        return; // 或者进行其他错误处理
      }
      return;
    }
    const lines = (partialData + chunk).split('\n');

    partialData = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === 'data: [DONE]') {
        // 如果是最后一行，跳过处理
        continue;
      }

      try {
        const trimmedLine = line.trim(); // 去除行首尾的空格
        if (trimmedLine.startsWith('data:')) {
          const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
          const json = JSON.parse(jsonData);
          if (json.Choices) {
            for (const choice of json.Choices) {
              const content = choice.Delta?.Content;
              if (content) {
                last_content.value += content;
              }
              if (choice.finish_reason === 'stop') {
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
      send_loading.value = false
      code.value =''

    } else {
      onData(result!);
      await read();
    }
  };
  await read();

}


const run_kimi = async () => {
  last_content.value = ''
  send_loading.value = true
  if (!token.value) {
    Message.warning('请先登录')
    return false
  }
  const formData = new FormData();
  formData.append('code', code.value);
  formData.append('appid', appid.value as any);
  formData.append('model_is_select', model_is_select.value);
  const res = await fetch(`${window.APP_CONFIG.baseUrl}app_run_kimi_send`, {
    method: 'POST',
    headers: headers,
    body: formData,

  })
  if (code.value.length==''){
    send_loading.value = false
    Message.error('内容不得为空')
    return false
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
  let partialData = '';
  const stream = res.body?.getReader();
  const onData = ({ value }: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        last_content.value = json.error.message;
        return; // 或者进行其他错误处理
      }
      return;
    }
    const lines = (partialData + chunk).split('\n');

    partialData = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === 'data: [DONE]') {
        // 如果是最后一行，跳过处理
        continue;
      }

      try {
        const trimmedLine = line.trim(); // 去除行首尾的空格
        if (trimmedLine.startsWith('data:')) {
          const jsonData = trimmedLine.slice(5); // 去除 "data:" 前缀
          const json = JSON.parse(jsonData);
          if (json.choices) {
            for (const choice of json.choices) {
              const content = choice.delta?.content;
              if (content) {
                last_content.value += content;
              }
              if (choice.finish_reason === 'stop') {
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
      send_loading.value = false
      code.value =''
    } else {
      send_loading.value = true
      onData(result!);
      await read();
    }
  };
  await read();



}

</script>

<style>
.ai-app-appid textarea:focus-visible{
    outline: 2px solid #409eff;
    outline-offset: 2px;
}
</style>
