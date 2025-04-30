<template>
  <div class="chat-share">
    <a-spin :loading="chat_loading" tip="加载聊天记录中...">
      <div v-if="messages.length>0" class="flex flex-col items-center pb-24 dark:bg-[#343541] min-h-screen">
        <div class="w-full"  v-for="(item,index) in messages" :key="index">
          <div
               class="relative  dark:bg-[#343541] text-gray-700 w-full border-b dark:border-gray-700 border-gray-200">
            <div class="relative mx-auto max-w-screen-xl dark:text-gray-100 text-gray-700 w-full px-4 py-10">
              <div class="w-full max-w-screen-md flex flex-1 mx-auto gap-[1.5rem] leading-[1.75] whitespace-pre-wrap"><img
                  alt="Avatar of the person chatting"
                  src="data:image/png;base64,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"
                  width="28" height="28" decoding="async" data-nimg="1" class="mr-2 rounded-sm h-[28px]"
                  style="color:transparent">
                <div class="flex flex-col">
                  <div class="questions font-bold font-16" v-html="renderMarkdown(item.question)">

                  </div>
                </div>
              </div>
              <div class="hidden absolute top-10 right-0 lg:flex -space-x-1 items-center justify-start lg:w-40 xl:w-60">
                <button
                    @click="handleClick(item.question?item.question:'')"
                    class="h-9 w-9 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white text-[11px] text-gray-500 font-medium"
                    style="opacity: 1; transform: none;">
                  <svg t="1704724035982" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13435" width="16" height="16"><path d="M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z" fill="#000000" p-id="13436"></path></svg>

                </button>
              </div>
            </div>
          </div>
          <div
               class="relative  dark:bg-[#343541] text-gray-700 w-full border-b dark:border-gray-700 border-gray-200 bg-gray-100 dark:bg-[#434654]">
            <div class="relative mx-auto max-w-screen-xl dark:text-gray-100 text-gray-700 w-full px-4 py-10">
              <div class="w-full max-w-screen-md flex flex-1 mx-auto gap-[1.5rem] leading-[1.75] whitespace-pre-wrap">
                <div
                    class="border-0 flex items-center justify-center h-[40px] w-[40px] rounded-sm p-[0.25rem]">
                  <img :src="item.icon?item.icon:'/images/avatar-1.png'" alt="">
                </div>
                <div class="flex flex-col flex-1">
                  <div class="utils_response__b5jEi">
                    <div class="questions" v-html="item.message?renderMarkdown(item.message).replace(/\\n/g, '\n'):''">

                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden absolute top-10 right-0 lg:flex -space-x-1 items-center justify-start lg:w-40 xl:w-60">
                <button
                    @click="handleClick(item.message?item.message:'')"
                    class="h-9 w-9 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white text-[11px] text-gray-500 font-medium"
                    style="opacity: 1; transform: none;">
                  <svg t="1704724035982" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13435" width="16" height="16"><path d="M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z" fill="#000000" p-id="13436"></path></svg>

                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="vh-100 flex items-center" v-else>
        <a-result
            status="403"
            subtitle="不存在该聊天记录~"
        >
          <template #extra>
            <a-space>
              <a-button type="primary" @click="go_back()">Back</a-button>
            </a-space>
          </template>
        </a-result>
      </div>

      <div
          v-if="!chat_loading && messages.length>0"
          class="z-10 fixed bottom-5 inset-x-0 mx-auto max-w-fit rounded-lg px-3 py-2 bg-white border border-gray-100 shadow-md flex justify-between space-x-2 items-center"
          style="opacity: 1; transform: none;">
        <div class="w-40 flex flex-col items-center justify-center"><NuxtLink target="_blank" rel="noopener noreferrer"
                                                                       class="flex space-x-2 items-center justify-center font-medium text-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all"
                                                                       :to="full_url"><img
            alt="logo" :src="counter.setting.logo" width="20" height="20" decoding="async" data-nimg="1" class="rounded-sm"
            loading="lazy" style="color: transparent;">
          <p>{{ counter.setting.title }}</p></NuxtLink><NuxtLink target="_blank" rel="noopener noreferrer"
                                class="text-xs text-gray-500 hover:text-gray-800 px-3"
                                :to="full_url">Powered by
          ▲ AI助手</NuxtLink></div>
        <div class="border-l border-gray-200 h-12 w-1"></div>
        <button
            @click="copy_url()"
            class="p-2 flex flex-col space-y-1 items-center rounded-md w-12 hover:bg-gray-100 active:bg-gray-200 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="h-4 w-4 text-gray-600">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <p class="text-center text-gray-600 text-sm">Copy</p></button>

        <button data-state="closed">
          <div
              class="cursor-default p-2 flex flex-col space-y-1 items-center rounded-md w-12 hover:bg-gray-100 active:bg-gray-200 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="h-4 w-4 text-gray-600">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <p class="text-center text-gray-600 text-sm">{{ messages[0]?.view }}</p></div>
        </button>
      </div>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItMatch from "markdown-it-math";
import mermaid from "mermaid";
import {Message} from "@arco-design/web-vue";
import {useCounter} from "~/store/counter";

const chat_loading = ref(true)
const counter = useCounter()
const full_url = ref('')
if (process.client) {
  full_url.value = window.location.origin
} else {
  full_url.value = ''
}
definePageMeta({
  layout: false
})
const route = useRoute();
const chatid = ref(route.params.chatid);
const messages = ref([])
const get_all_message = () =>{
  chat_loading.value = true
  get_chat_id({
    chat_id: chatid.value
  }).then((res:any) => {
    chat_loading.value = false
    messages.value = res._rawValue.data
  }).catch((err:any) => {
    chat_loading.value = false
    console.log(err)
  })
}
get_all_message()

const renderMarkdown = (markdown: any) => {
  const md = markdownIt({
    linkify: true,
    highlight: (str, lang) => {
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
const copy_url = ()=>{
  // 复制当前链接
  const textarea = document.createElement('textarea');
  textarea.value = window.location.href;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  Message.success('复制成功');

}
const go_back = ()=>{
  window.location.href = full_url.value
}
</script>
<style scoped>

</style>
