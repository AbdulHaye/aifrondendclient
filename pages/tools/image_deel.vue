<template>
  <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">OCR识图</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">识别图片中的文字信息</span>
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
                    <div class="absolute bottom-0 inset-x-0 bg-black/50 text-white p-2 flex items-center justify-center">
                      <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>上传成功</span>
                    </div>
                  </div>
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                    <svg class="w-12 sm:w-14 h-12 sm:h-14 mb-4" viewBox="0 0 24 24" fill="none">
                      <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-sm sm:text-base text-center">上传图片文件</span>
                    <span class="text-xs sm:text-sm mt-2 text-gray-400 text-center">仅支持PNG/JPG格式</span>
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
                转换文字
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
            <div class="min-h-[400px] sm:min-h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
              <div v-if="last_content" class="prose dark:prose-invert max-w-none text-sm sm:text-base">
                <pre class="whitespace-pre-wrap">{{ last_content }}</pre>
              </div>
              <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                <div class="relative size-16 sm:size-20 mb-6">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <div class="absolute inset-2 bg-white dark:bg-gray-900 rounded-full"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" viewBox="0 0 24 24" fill="none">
                      <path d="M21.68 16.96L18.55 9.65C17.49 7.17 15.54 5.66 13.39 5.66C11.24 5.66 9.29 7.17 8.23 9.65L5.1 16.96C4.18 19.13 4.56 21.29 6.11 22.58C7.66 23.87 9.91 23.87 11.46 22.58L12.61 21.64C13.07 21.26 13.71 21.26 14.17 21.64L15.32 22.58C16.87 23.87 19.12 23.87 20.67 22.58C22.22 21.29 22.6 19.13 21.68 16.96ZM13.39 13.31C12.39 13.31 11.58 12.5 11.58 11.5C11.58 10.5 12.39 9.69 13.39 9.69C14.39 9.69 15.2 10.5 15.2 11.5C15.2 12.5 14.39 13.31 13.39 13.31Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.39 1.35V5.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.11 3.5L13.39 5.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.67 3.5L13.39 5.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <span class="text-sm sm:text-base text-center">我可以识别图片文件哟~</span>
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
import {useCounter} from "~/store/counter";
import { Message } from "@arco-design/web-vue";
import {ref} from "vue";

const counter = useCounter()
useHead({
  title: '图片COR解析 - '+counter.setting.title,
  meta: [
    { name: 'description', content: counter.setting.description},
    { name: 'keywords', content: counter.setting.keywords}
  ]
})
const login_dialog = ref(false)
const login_dialog_click = () => {
  login_dialog.value = true
}
const handleCancel = () => {
  login_dialog.value = false
}

const token = useCookie('token')

const actions = counter.setting.APP_URL + '/api/upload_miji'

const imageUrl = ref('')
const deletePic = () => {
  imageUrl.value = ''
}
const beforeUpload = (file:any) => {
  // png jpg jpeg
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";

  if (!isJPG && !isPNG) {
    Message.error('仅支持png jpg 格式!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 15;


  if (!isLt2M) {
    Message.error('上传图片大小不能超过 15MB!')
    return false
  }
  return true
};
const send_loading = ref(false)
const picSuccess = (currentFile:any) => {
  // 获取currentFile里的response的data值
  if (currentFile.response.status != 200) {
    Message.error('上传失败!')
    return
  }
  Message.success('上传成功!')
  imageUrl.value = currentFile.response.data;
};
const last_content = ref('')
const submitForm = () => {
  if (!imageUrl) {
    Message.error('请上传文件!')
    return
  }
  send_loading.value = true
  ocr_images({
    file: imageUrl
  }).then(res => {
    send_loading.value = false
    Message.success('转换成功!')
    last_content.value = res._rawValue.data
  }).catch(err => {
    send_loading.value = false
    Message.error('转换失败!')
  })
}
</script>


<style scoped>

</style>
