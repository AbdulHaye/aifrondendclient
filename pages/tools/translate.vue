<template>
  <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between flex-wrap">
            <div class="flex items-center gap-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI翻译助手</h2>
              <span class="text-sm text-gray-500 dark:text-gray-400">支持多语言互译</span>
            </div>
            <div class="flex items-center flex-wrap lg:flex-nowrap text-center gap-6">
              <a-select placeholder="源语言" v-model="transOne" class="min-w-[140px]">
                <a-option v-for="item in language_arr" :key="item.value" :value="item.value">{{item.label}}</a-option>
              </a-select>
              
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                <svg t="1710312941470" class="icon w-6 h-6 text-gray-500" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M871.24 443.3H120.56a32 32 0 0 1 0-64h750.68a32 32 0 0 1 0 64z" fill="currentColor"/>
                  <path d="M875.42 443.3a31.86 31.86 0 0 1-21.24-8L627.72 234a32 32 0 1 1 42.52-48l226.46 201.38a32 32 0 0 1-21.28 56zM875.44 646.7H124.76a32 32 0 1 1 0-64h750.68a32 32 0 0 1 0 64z" fill="currentColor"/>
                  <path d="M347.02 848a31.88 31.88 0 0 1-21.26-8L99.3 638.62a32 32 0 1 1 42.52-47.84L368.28 792a32 32 0 0 1-21.26 56z" fill="currentColor"/>
                </svg>
              </button>

              <a-select placeholder="目标语言" v-model="transTwo" class="min-w-[140px]">
                <a-option v-for="item in language_filter(transOne)" :key="item.value" :value="item.value">{{item.label}}</a-option>
              </a-select>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
          <div class="p-6">
            <a-textarea 
              :auto-size="{minRows:16, maxRows:24}" 
              v-model="input" 
              show-word-limit
              placeholder="请输入需要翻译的内容"
              class="bg-gray-50 dark:bg-gray-900 rounded-lg text-base"
            />
            
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center gap-3">
                <a-tooltip content="播放语音">
                  <a-button type="text" @click="speak(input)" class="hover:text-blue-500 dark:hover:text-blue-400 h-9 w-9">
                    <template #icon>
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.008 2.987C19.34 2.225 21 3.187 21 4.723v14.554c0 1.536-1.66 2.498-2.992 1.736L12 17.123V6.877l6.008-3.89z" fill="currentColor"/>
                        <path d="M12 6.877v10.246L3.992 21.013C2.66 21.775 1 20.813 1 19.277V4.723c0-1.536 1.66-2.498 2.992-1.736L12 6.877z" fill="currentColor"/>
                      </svg>
                    </template>
                  </a-button>
                </a-tooltip>
                
                <a-tooltip content="复制内容">
                  <a-button type="text" @click="copy_info(input)" class="hover:text-blue-500 dark:hover:text-blue-400 h-9 w-9">
                    <template #icon>
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor"/>
                        <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                      </svg>
                    </template>
                  </a-button>
                </a-tooltip>
              </div>
              
              <a-button type="primary" 
                :loading="send_loading" 
                @click="go_translate"
                class="bg-blue-500 hover:bg-blue-600 border-0 h-9 px-6"
              >
                开始翻译
              </a-button>
            </div>
          </div>

          <div class="p-6">
            <div class="min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <div v-if="trans_down" class="prose dark:prose-invert max-w-none">
                <div v-html="renderMarkdown(trans_down).replace(/\\n/g, '\n')" class="mb-4 text-base"></div>
                <div class="flex items-center gap-3">
                  <a-tooltip content="播放语音">
                    <a-button type="text" @click="speak(trans_down)" class="hover:text-blue-500 dark:hover:text-blue-400 h-9 w-9">
                      <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.008 2.987C19.34 2.225 21 3.187 21 4.723v14.554c0 1.536-1.66 2.498-2.992 1.736L12 17.123V6.877l6.008-3.89z" fill="currentColor"/>
                          <path d="M12 6.877v10.246L3.992 21.013C2.66 21.775 1 20.813 1 19.277V4.723c0-1.536 1.66-2.498 2.992-1.736L12 6.877z" fill="currentColor"/>
                        </svg>
                      </template>
                    </a-button>
                  </a-tooltip>
                  
                  <a-tooltip content="复制内容">
                    <a-button type="text" @click="copy_info(trans_down)" class="hover:text-blue-500 dark:hover:text-blue-400 h-9 w-9">
                      <template #icon>
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor"/>
                          <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                        </svg>
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
              <div class="flex justify-center items-center h-full" v-else>
                <img src="@/assets/images/trans.gif" class="w-40 opacity-50" alt="翻译中">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Login :login_dialog="login_dialog" @handleCancel="handleCancel"/>
  </main>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {IconCode, IconDelete, IconDown, IconPlus} from "@arco-design/web-vue/es/icon";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItMatch from "markdown-it-math";
import mermaid from "mermaid";
import Speech from 'speak-tts'
import {useCounter} from "~/store/counter";

const counter = useCounter()
useHead({
  title: '在线翻译 - '+counter.setting.title,
  meta: [
    { name: 'description', content: counter.setting.description},
    { name: 'keywords', content: counter.setting.keywords}
  ]
})
const login_dialog = ref(false)
const input = ref('')
const token = useCookie('token');
const transOne = ref('zh')
const transTwo = ref('en')
const send_loading = ref(false)
const trans_down = ref('')
const renderMarkdown = (markdown: any) => {
  const md = markdownIt({
    linkify: true,
    highlight: (str: string, lang: string) => {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${markdownIt().utils.escapeHtml(str)}</pre>`;
      }

      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true
          }).value}</code></pre>`;
        } catch (__) {}
      }

      return `<pre class="hljs"><span ref="preCopy" class="pre_copy">Copy</span><code>${markdownIt().utils.escapeHtml(str)}</code></pre>`;
    },
    breaks: true
  }).use(markdownItMatch,{
    inlineOpen: '$',
    inlineClose: '$',
    blockOpen: '$$$',
    blockClose: '$$$',
    renderingOptions: {},
  });

  const renderedMarkdown = md.render(markdown);

  return renderedMarkdown;
}
const up_stop = ref('start')
const is_done = ref(false)

const language_arr = [
  {
    value: 'zh',
    label: '中文'
  },
  {
    value: 'en',
    label: '英文'
  },
  {
    value: 'jp',
    label: '日文'
  },
  {
    value: 'kor',
    label: '韩文'
  },
  {
    value: 'fra',
    label: '法文'
  },
  {
    value: 'spa',
    label: '西班牙文'
  },
  {
    value: 'ara',
    label: '阿拉伯文'
  },
  {
    value: 'ru',
    label: '俄文'
  },
  {
    value: 'pt',
    label: '葡萄牙文'
  },
  {
    value: 'de',
    label: '德文'
  },
  {
    value: 'it',
    label: '意大利文'
  },
  {
    value: 'nl',
    label: '荷兰文'
  },
  {
    value: 'el',
    label: '希腊文'
  },
  {
    value: 'pl',
    label: '波兰文'
  },
  {
    value: 'bul',
    label: '保加利亚文'
  },
  {
    value: 'est',
    label: '爱沙尼亚文'
  },
  {
    value: 'dan',
    label: '丹麦文'
  },
  {
    value: 'fin',
    label: '芬兰文'
  },
  {
    value: 'cs',
    label: '捷克文'
  },
  {
    value: 'rom',
    label: '罗马尼亚文'
  },
  {
    value: 'slo',
    label: '斯洛文尼亚文'
  },
  {
    value: 'swe',
    label: '瑞典文'
  },
  {
    value: 'hu',
    label: '匈牙利文'
  },
  {
    value: 'cht',
    label: '繁体中文'
  },
  {
    value: 'vie',
    label: '越南文',
  },
]
// 监听transOne的数据实现transTwo的过滤变化
watch(transOne, (val) => {
  transTwo.value = language_filter(val)[0].value

})

const language_filter = (input: string) => {
  // 要不包含的语言
  return language_arr.filter(item => !item.value.includes(input))
}
const login_dialog_click = () => {
  login_dialog.value = true
}
const handleCancel = () => {
  login_dialog.value = false
}
const {public: {baseUrl}} = useRuntimeConfig()
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

// 根据transOne的value获取language_arr的label
const get_transOne_label = (value: string) => {
  return language_arr.filter(item => item.value == value)[0].label
}

const go_translate = async () => {
  if (!token.value) {
    login_dialog_click()
    return false
  }

  if (input.value == '') {
    Message.error('请输入需要翻译的内容')
    return false
  }

  if (send_loading.value) {
    Message.warning('请等待翻译完成')
    return false
  }

  send_loading.value = true


  const res = await fetch(`${window.APP_CONFIG.baseUrl}send_translate`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      info: input.value,
      trans_one: get_transOne_label(transOne.value),
      trans_two: get_transOne_label(transTwo.value)
    }),

  })

  if (res){
    trans_down.value=''
  }
  if (res.status == 500 || res.status == 401 || res.status == 405 || res.status == 402 || res.status == 403) {

    const responseData = await res.json();
    send_loading.value = false
    Message.error(responseData.message)
    return false
  }

  let reply_in = false;

  let partialData = '';

  const stream = res.body?.getReader();
  const onData = ({value}: { value: Uint8Array }) => {
    const chunk = new TextDecoder().decode(value);
    if (isInvalidJSON(chunk)) {
      const json = JSON.parse(chunk);
      if (json.error && json.error.message) {
        trans_down.value = json.error.message;
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
                trans_down.value += content;
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
    if (up_stop.value == 'end') {
      console.log('end')
      up_stop.value = 'start'
      stream?.cancel()
      return false;
    }
    if (result?.done) {
      console.log('done')
      is_done.value = true
      send_loading.value = false
    } else {
      send_loading.value = true
      is_done.value = false
      onData(result!);
      await read();
    }
  };
  await read();


}

const copy_info = (info: string) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', info);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    Message.success('复制成功')
  }
  document.body.removeChild(input);
}
onMounted(async () => {

  // 先获取数据
  // nextTick保证你的获取到的已转成html的markdown内容已经更新到HTML的DOM结构中了。
  await nextTick()
  //  然后执行高亮即可
  speechInit()

})
const speech = ref()
const speak = (info: any) => {
  speech.value.cancel()
  speech.value.speak({text: info,
    listeners: {
      onend: () => {
        speech.value.cancel()
      },
    }}).then(() => {
    Message.success('语音播放完成')

  })

}
const speechInit = () => {
  speech.value = new Speech();
  speech.value.setLanguage('zh-CN');
  speech.value.init().then(() => {
  })
}
</script>
<style scoped>

</style>

