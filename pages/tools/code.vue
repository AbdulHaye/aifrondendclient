<template>
    <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">图转代码工具</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">支持多种框架转换</span>
              </div>
              <a-dropdown @select="handleSelect" :popup-max-height="false">
                <a-button type="primary" class="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 border-0 h-9 px-4">
                  {{ model_list.find(item => item.value === model_select)?.label }}
                  <icon-down />
                </a-button>
                <template #content>
                  <a-doption v-for="item in model_list" :key="item.value" :value="item.value" class="hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    {{ item.label }}
                  </a-doption>
                </template>
              </a-dropdown>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700">
            <div class="p-4 sm:p-6">
              <a-upload
                class="avatar-uploader w-full"
                :action="actions"
                :show-file-list="false"
                :headers="{'Authorization': 'Bearer ' + token}"
                @before-upload="beforeUpload"
                @success="picSuccess"
                draggable
              >
                <template #upload-button>
                  <div class="w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                    <div v-if="imageUrl" class="relative w-full h-full">
                      <img :src="imageUrl" class="w-full h-full object-contain"/>
                      <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <icon-plus class="text-white text-2xl"/>
                      </div>
                    </div>
                    <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                      <svg class="w-12 sm:w-14 h-12 sm:h-14 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
                        <path d="M5.5 9C4.11929 9 3 10.1193 3 11.5V15.5C3 16.8807 4.11929 18 5.5 18H6V9H5.5z" fill="currentColor"/>
                        <path d="M7 9v9h11.5c1.3807 0 2.5-1.1193 2.5-2.5v-4C21 10.1193 19.8807 9 18.5 9H7z" fill="currentColor"/>
                      </svg>
                      <span class="text-sm sm:text-base text-center">上传网站截图，仅支持PNG|JPG</span>
                      <span class="text-xs sm:text-sm mt-2 text-gray-400 text-center">点击或拖拽上传，图片大小不超过15MB</span>
                    </div>
                  </div>
                </template>
              </a-upload>

              <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <a-button @click="submitForm()" 
                  :loading="send_loading" 
                  type="primary" 
                  class="flex-1 bg-blue-500 hover:bg-blue-600 border-0 h-9"
                >
                  <template #icon>
                    <icon-code />
                  </template>
                  生成代码
                </a-button>
                
                <a-button v-if="imageUrl" 
                  type="primary" 
                  status="danger" 
                  @click="deletePic" 
                  class="flex-1 h-9"
                >
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除图片
                </a-button>
              </div>
            </div>

            <div class="p-4 sm:p-6">
              <a-tabs default-active-key="1" class="w-full">
                <a-tab-pane key="1" title="界面预览">
                  <div class="min-h-[400px] sm:min-h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                    <div v-if="codeContent" v-html="codeContent" class="text-sm sm:text-base"></div>
                    <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg class="w-12 sm:w-16 h-12 sm:h-16 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-sm sm:text-base text-center">上传图片后预览转换效果</span>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" title="代码">
                  <div class="min-h-[400px] sm:min-h-[500px]" v-if="codeContent">
                    <div class="flex justify-end mb-4">
                      <a-button type="primary" 
                        @click="handleClick(codeContent)"
                        class="bg-blue-500 hover:bg-blue-600 border-0 h-9 px-6"
                      >
                        复制代码
                      </a-button>
                    </div>
                    <pre class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6 overflow-auto text-sm sm:text-base">
                      <code v-html="renderMarkdown(codeContent).replace(/\\n/g, '\n')"></code>
                    </pre>
                  </div>
                  <div v-else class="min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center text-gray-400">
                    <svg class="w-12 sm:w-16 h-12 sm:h-16 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 18L22 12L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6L2 12L8 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-sm sm:text-base text-center">生成代码后查看详细内容</span>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
      <Login :login_dialog="login_dialog" @handleCancel="handleCancel"/>
    </main>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {IconDelete, IconPlus,IconCode,IconDown} from "@arco-design/web-vue/es/icon";
import {useCounter} from "~/store/counter";
import {Message} from "@arco-design/web-vue";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItKatex from "markdown-it-katex";
import mermaid from "mermaid";

const counter = useCounter()
useHead({
  title: '图转代码 - '+counter.setting.title,
  meta: [
    { name: 'description', content: counter.setting.description},
    { name: 'keywords', content: counter.setting.keywords}
  ]
})
const token = useCookie('token')

const actions = counter.setting.APP_URL + '/api/upload_miji'

const imageUrl = ref('')
const deletePic = () => {
  imageUrl.value = ''
}
const is_done = ref(false)
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
    }).use(markdownItKatex);

    const renderedMarkdown = md.render(markdown);

    mermaid.initialize({ startOnLoad: true });
    // 判断是否有闭合</pre>


    if (is_done.value){
        mermaid.initialize({ startOnLoad: true });
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }

    return renderedMarkdown;
}
const beforeUpload = (file:any) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 15;

  if (!isJPG && !isPNG) {
    Message.error('上传图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    Message.error('上传图片大小不能超过 15MB!')
    return false
  }
  return true
};
const picSuccess = (currentFile:any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error('上传失败!')
    return
  }
  Message.success('上传成功!')
  imageUrl.value = currentFile.response.data;
};

const send_loading = ref(false)
const login_dialog = ref(false)
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
const isInvalidJSON = (data:string)=> {
  try {
    JSON.parse(data);
    return true; // 解析成功，是错误的 JSON 数据
  } catch (error) {
    return false; // 解析失败，不是错误的 JSON 数据
  }
}
const codeContent = ref('')
const submitForm = async () => {
  if (imageUrl.value == '') {
    Message.warning('请上传图片')
    return false
  }
  if (send_loading.value == true) {
    Message.warning('请等待上一条消息发送完成')
    return false
  }
  if (!token.value) {
    Message.warning('请先登录')
    login_dialog_click()
    return false
  }
  codeContent.value = ''


  send_loading.value = true

  const res = await fetch(`${window.APP_CONFIG.baseUrl}code_image`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      image_url: imageUrl.value,
      model_select: model_select.value
    }),

  })

  if (res.status == 500) {
    send_loading.value = false
    Message.error('服务器错误')
    return false
  }
  if (res.status == 401) {
    send_loading.value = false
    Message.error('请先登录')
    return false
  }
  if (res.status == 405) {
    send_loading.value = false
    console.log(res)
    Message.error('提交信息有误')
    return false
  }
  if (res.status == 402) {
    send_loading.value = false
    Message.error('发送次数已达上限或余额不足')
    return false
  }
  if (res.status == 403) {
    send_loading.value = false
    Message.error('禁止发送违禁词')
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
        Message.error(json.error.message);
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
                codeContent.value += content;
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
        is_done.value = true
      console.log('done')
      send_loading.value = false
    } else {
      send_loading.value = true
      onData(result!);
      await read();
    }
  };
  await read();



}
const model_select = ref('tailwind')
const model_list = ref([
  {
    label:'HTML+Tailwind',
    value:'tailwind'
  },
  {
    label:'React+Tailwind',
    value:'react'
  },
  {
    label:'Vue+Tailwind',
    value:'vue'
  },
  {
    label:'Boostrap',
    value:'boostrap'
  }
])
const handleSelect = (v:string) => {
  model_select.value = v
};
</script>

<style scoped>

</style>
