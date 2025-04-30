<template>
  <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">语音转文字</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">通过AI识别语音文件转换为文本</span>
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
                    <div class="flex flex-col items-center justify-center h-full">
                      <svg class="w-16 h-16 text-green-500 mb-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M768 921.6H256c-56.32 0-102.4-46.08-102.4-102.4V204.8c0-56.32 46.08-102.4 102.4-102.4h409.6l204.8 204.8v512c0 56.32-46.08 102.4-102.4 102.4z" fill="currentColor"/>
                        <path d="M665.6 102.4l204.8 204.8h-102.4c-56.32 0-102.4-46.08-102.4-102.4V102.4z" fill="currentColor" opacity="0.8"/>
                      </svg>
                      <div class="flex items-center text-green-500">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-base">上传成功</span>
                      </div>
                    </div>
                    <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <icon-plus class="text-white text-2xl"/>
                    </div>
                  </div>
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                    <svg class="w-12 sm:w-14 h-12 sm:h-14 mb-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3.25C9.23322 3.25 6.85685 4.91427 5.81432 7.29442C3.23861 7.63053 1.25 9.83289 1.25 12.5C1.25 15.3995 3.60051 17.75 6.5 17.75H8V16.25H6.5C4.42893 16.25 2.75 14.5711 2.75 12.5C2.75 10.4736 4.35756 8.82234 6.36655 8.75232L6.87754 8.73451L7.04768 8.25236C7.76807 6.211 9.71438 4.75 12 4.75C14.2856 4.75 16.2319 6.211 16.9523 8.25236L17.1225 8.73451L17.6334 8.75232C19.6424 8.82234 21.25 10.4736 21.25 12.5C21.25 14.5711 19.5711 16.25 17.5 16.25H16V17.75H17.5C20.3995 17.75 22.75 15.3995 22.75 12.5C22.75 9.83289 20.7614 7.63052 18.1857 7.29442C17.1431 4.91427 14.7668 3.25 12 3.25Z" fill="currentColor"/>
                      <path d="M12.75 13.1013V20.5H11.25V13.1013L9.48014 14.5762L8.51986 13.4238L12 10.5237L15.4801 13.4238L14.5199 14.5762L12.75 13.1013Z" fill="currentColor"/>
                    </svg>
                    <span class="text-sm sm:text-base text-center">上传语音文件</span>
                    <span class="text-xs sm:text-sm mt-2 text-gray-400 text-center">支持 mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm 格式</span>
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
                删除文件
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
                      <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.3501 9.6499V11.3499C4.3501 15.5699 7.7801 18.9999 12.0001 18.9999C16.2201 18.9999 19.6501 15.5699 19.6501 11.3499V9.6499" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 19V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <span class="text-sm sm:text-base text-center">我可以识别语音文件哟~</span>
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
import Code from "~/pages/tools/code.vue";
import {IconCode, IconDelete, IconDown, IconPlus} from "@arco-design/web-vue/es/icon";
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {trans_voice} from "~/utils/api";

const counter = useCounter()
useHead({
  title: '语音转文字 - '+counter.setting.title,
  meta: [
    { name: 'description', content: counter.setting.description},
    { name: 'keywords', content: counter.setting.keywords}
  ]
})
const login_dialog = ref(false)
const token = useCookie('token');
const handleCancel = () => {
  login_dialog.value = false
}

const actions = counter.setting.APP_URL + '/api/upload_video'

const imageUrl = ref('')
const deletePic = () => {
  imageUrl.value = ''
}
const beforeUpload = (file:any) => {
  // mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm
  const isJPG = file.type === 'audio/mp3' || file.type === 'audio/mp4' || file.type === 'audio/mpeg' || file.type === 'audio/mpga' || file.type === 'audio/m4a' || file.type === 'audio/ogg' || file.type === 'audio/wav' || file.type === 'audio/webm';
  if (!isJPG) {
    Message.error('仅支持mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm 格式!')
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
  trans_voice({
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
.animate_container {

  border-radius: 50%;
  height: 96px;
  width: 96px;
  animation: rotate_3922 1.2s linear infinite;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.animate_container span {
  position: absolute;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.animate_container span:nth-of-type(1) {
  filter: blur(5px);
}

.animate_container span:nth-of-type(2) {
  filter: blur(10px);
}

.animate_container span:nth-of-type(3) {
  filter: blur(25px);
}

.animate_container span:nth-of-type(4) {
  filter: blur(50px);
}

.animate_container::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: #fff;
  border: solid 5px #ffffff;
  border-radius: 50%;
}

@keyframes rotate_3922 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

</style>
