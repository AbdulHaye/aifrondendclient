<template>
  <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="rounded-2xl">
      <div class="flex justify-between items-center mb-6">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          AI写作
        </div>
        <div class="space-x-2">
          <a-space>
            <button @click="get_last_id('new')" 
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              新建文稿
            </button>
            <button @click="get_last_id('ai_write')"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              AI功能稿
            </button>
          </a-space>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 relative overflow-hidden group mb-8">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div class="w-full md:w-1/2">
            <div class="mb-6">
              <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in">
                AI帮助您快速写作
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-4 animate-slide-up">
                通过人工智能技术，帮助您快速写作，提高写作效率
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform">
                <div class="flex items-center space-x-3">
                  <img alt="自动刷新存档" class="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" src="@/assets/images/write-1.png"/>
                  <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">自动刷新存档</span>
                </div>
              </button>
              <button class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform">
                <div class="flex items-center space-x-3">
                  <img alt="AI写作编撰" class="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" src="@/assets/images/write-2.png"/>
                  <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">AI写作编撰</span>
                </div>
              </button>
              <button class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform">
                <div class="flex items-center space-x-3">
                  <img alt="Word文件格式" class="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" src="@/assets/images/write-3.png"/>
                  <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">Word文件格式</span>
                </div>
              </button>
              <button class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform">
                <div class="flex items-center space-x-3">
                  <img alt="多模型体验写作" class="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" src="@/assets/images/write-4.png"/>
                  <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">多模型体验写作</span>
                </div>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/2 flex justify-center">
            <div class="relative transform hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl transform -rotate-6 scale-105 animate-pulse"></div>
              <img alt="write" class="relative rounded-2xl w-96 shadow-lg transform hover:rotate-2 transition-transform duration-300" src="@/assets/images/write_banner.png"/>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">热门模版</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="cursor-pointer group animate-slide-in" @click="get_last_id('content_change')">
          <div class="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1 hover:border-blue-200">
            <div class="flex items-center">
              <img src="@/assets/images/write/content.png" alt="内容修改" class="w-16 h-16 mr-4 transition-transform duration-300 group-hover:scale-110 object-contain"/>
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">内容修改</h5>
                <p class="text-sm text-gray-600 dark:text-gray-400">修改某段文章段落内容，保留原意操作</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cursor-pointer group animate-slide-in" @click="get_last_id('content_long')">
          <div class="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1 hover:border-blue-200">
            <div class="flex items-center">
              <img src="@/assets/images/write/content_set.png" alt="句子续写" class="w-16 h-16 mr-4 transition-transform duration-300 group-hover:scale-110 object-contain"/>
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">句子续写</h5>
                <p class="text-sm text-gray-600 dark:text-gray-400">根据上下文句子延续写作创新</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cursor-pointer group animate-slide-in" @click="get_last_id('content_color')">
          <div class="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1 hover:border-blue-200">
            <div class="flex items-center">
              <img src="@/assets/images/write/style.png" alt="风格润色" class="w-16 h-16 mr-4 transition-transform duration-300 group-hover:scale-110 object-contain"/>
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">风格润色</h5>
                <p class="text-sm text-gray-600 dark:text-gray-400">修改当前内容的整体写作风格</p>
              </div>
            </div>
          </div>
        </div>

        <div class="cursor-pointer group animate-slide-in" @click="get_last_id('content_think')">
          <div class="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1 hover:border-blue-200">
            <div class="flex items-center">
              <img src="@/assets/images/write/gousi.png" alt="创意故事" class="w-16 h-16 mr-4 transition-transform duration-300 group-hover:scale-110 object-contain"/>
              <div>
                <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">创意故事</h5>
                <p class="text-sm text-gray-600 dark:text-gray-400">帮你构思一个创意</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">最近文稿</span>
          <div class="flex items-center space-x-4">
            <button class="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
              <icon-clock-circle class="mr-2"/>
              最近打开
            </button>
            <button class="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
              <icon-down class="mr-2"/>
              操作
            </button>
          </div>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="(item,index) in all_content" :key="index"
               class="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors duration-200 animate-slide-in"
               :style="{ animationDelay: index * 50 + 'ms' }"
               @click="go_now(item.id,'in')">
            <svg class="w-12 h-12 text-blue-500 mr-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4677">
              <path d="M506.88 257.024H321.024c-25.6 0-46.08 20.992-46.08 46.592v371.2c0 25.6 20.48 46.592 46.08 46.592h279.04c25.6 0 46.592-20.992 46.592-46.592V396.288L506.88 257.024z m46.08 371.2H367.616v-46.592H552.96v46.592z m0-92.672H367.616v-46.592H552.96v46.592zM483.328 419.328V291.84l127.488 127.488H483.328z" fill="currentColor" p-id="4678"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ item.title || '未命名' }}</h4>
              <p class="text-sm text-gray-500">{{ item.created_at }}</p>
            </div>
            <a-dropdown trigger="hover">
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200">
                <icon-more class="text-gray-500"/>
              </button>
              <template #content>
                <a-doption @click.native="go_now(item.id,'in')" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <icon-rotate-right class="mr-2"/>当前标签页打开
                </a-doption>
                <a-doption @click.native="go_now(item.id,'out')" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <icon-share-internal class="mr-2"/>新建标签页打开
                </a-doption>
                <a-doption @click.native="send_name(item.id)" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <icon-edit class="mr-2"/>重命名
                </a-doption>
                <a-doption @click.native="export_word(item.title,item.content)" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  <icon-swap class="mr-2"/>导出word
                </a-doption>
                <a-doption @click.native="delete_this(item.id)" class="flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                  <icon-delete class="mr-2"/>删除
                </a-doption>
              </template>
            </a-dropdown>
          </div>
          <a-empty v-if="all_content.length === 0" class="py-12"/>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="name_info" title="修改名称" @ok="rename">
      <a-input v-model="beizhu" placeholder="输入新的名称"/>
    </a-modal>
    <Nfooter/>
  </main>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {
    IconMore,
    IconRotateRight,
    IconShareInternal,
    IconEdit,
    IconSwap,
    IconDelete,

} from "@arco-design/web-vue/es/icon"
import {Message} from "@arco-design/web-vue";
import {asBlob} from "html-docx-js-typescript";
import fileSaver from 'file-saver';
import {useCounter} from "~/store/counter";
const counter = useCounter()
useHead({
    title: 'AI写作 - '+counter.setting.title,
    meta: [
        { name: 'description', content: counter.setting.description},
        { name: 'keywords', content: counter.setting.keywords}
    ]
})
definePageMeta({
  middleware: ['mustlogin']
})
const router = useRouter();
const token = useCookie('token');
const get_content_id = ref(0);
const all_content = ref([]);
const get_last_id = (type:any)=>{
    get_nowContent().then((res:any)=>{
        get_content_id.value = res._rawValue.data
        if (type=='new'){
            router.push({path: '/editor/'+get_content_id.value.id})
        }else if (type=='ai_write'){
            router.push({path: '/editor/'+get_content_id.value.id,query:{ai_write:'true'}})
        }
        if (type === 'content_change' || type === 'content_long' || type === 'content_color' || type === 'content_think') {
            router.push({
                path: '/editor/' + get_content_id.value.id,
                query: {
                    ai_write: 'true',
                    ai_write_type: type
                }
            });
        }
    }).catch((err:any)=>{
        console.log(err)
    })
}
const go_now = (id:any,type:any)=>{
    if (type=='in'){
        router.push({path: '/editor/'+id})
    }else{
        window.open('/editor/'+id)
    }

}
const now_id  =ref(0)
const name_info = ref(false)
const beizhu = ref('')
const send_name = (id:any)=>{
    now_id.value = id
    name_info.value = true
}
const export_word = (title:any,content:any)=>{
    if (content == null || content == ''){
        Message.error('内容为空')
        return
    }
    asBlob(content).then((blob: any) => {
        fileSaver.saveAs(blob, title?title:'未命名'+'.docx');
    });
}
const delete_this = (id:any) =>{
    delete_content({
        id: id
    }).then((res: any) => {
        Message.success('删除成功')
        get_all_content()
    }).catch((err: any) => {
        console.log(err)
    })
}
const rename = ()=>{
    rename_content({
        id:now_id.value,
        title:beizhu.value
    }).then((res:any)=>{
        Message.success('修改成功')
        get_all_content()
    }).catch((err:any)=>{
        console.log(err)
    })
}
const contentLoad = ref(false)
const get_all_content = ()=>{
  contentLoad.value = true
    get_allContent().then((res:any)=>{
        all_content.value = res._rawValue.data
      contentLoad.value = false
    }).catch((err:any)=>{
      contentLoad.value = false
        console.log(err)
    })
}
if (token.value){
    get_all_content()
}
</script>
<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .7; }
}
</style>

