<template>
    <a-spin :loading="create_load">
      <main class="main overflow-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <!-- Hero Section -->
        <div class="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="md:w-1/2 text-left md:pr-12 relative z-10">
            <div class="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 transform hover:scale-105 transition-transform duration-300">
              <span class="text-sm font-medium text-blue-600 dark:text-blue-300">知识管理系统</span>
            </div>
            <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight animate-fade-in">
              新一代知识管理平台
              <span class="block text-2xl mt-2 text-gray-600 dark:text-gray-300 animate-slide-up">助力组织全面升级</span>
            </h1>
            <p class="text-lg mb-8 text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in">
              知识库是一个面向组织的知识管理系统。通过结构化沉淀高价值信息，形成完整的知识体系。此外，明确的内容分类，层级式的页面树，还能够轻松提升知识的流转和传播效率，更好地成就组织和个人。
            </p>
            <button @click="create_knowledge('new')" 
                    class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              立即创建
            </button>
          </div>
          <div class="md:w-1/2 flex justify-center mt-8 md:mt-0 relative z-10">
            <div class="relative transform hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-2xl transform -rotate-6 scale-105 animate-pulse"></div>
              <img alt="知识库图标" class="relative rounded-2xl w-96 shadow-lg transform hover:rotate-2 transition-transform duration-300" src="@/assets/images/knowledge-1.png"/>
            </div>
          </div>
        </div>

        <!-- Knowledge Management Section -->
        <div class="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transform hover:shadow-lg transition-all duration-300">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">知识库管理</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Create New Card -->
            <div class="cursor-pointer group animate-fade-in" @click="create_knowledge('new')">
              <div class="h-full bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transform">
                <div class="flex items-center">
                  <img src="@/assets/images/knowledge.png" alt="新建文稿" class="w-16 h-16 mr-4 group-hover:rotate-12 transition-transform duration-300">
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">创建知识库</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">新建空白知识库进行导入文档数据</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Existing Knowledge Cards -->
            <div v-for="(item,index) in publist" :key="index" class="cursor-pointer group animate-slide-in" :style="{ animationDelay: index * 100 + 'ms' }">
              <div class="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1 hover:border-blue-200">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 dark:from-blue-900/0 dark:to-blue-800/0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                <div class="absolute top-4 right-4 flex items-center gap-2 animate-slide-in-right">
                  <a-tag :color="item.is_public ? 'green' : 'red'" class="rounded-full px-3 transform transition-transform duration-200 hover:scale-105">
                    {{ item.is_public ? '公开' : '私有'}}
                  </a-tag>
                  <a-dropdown trigger="hover">
                    <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:rotate-90">
                      <icon-more class="text-gray-500"/>
                    </button>
                    <template #content>
                      <a-doption @click.native="send_public(item.know_uid)" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <icon-rotate-right class="mr-2" />公开知识库
                      </a-doption>
                      <a-doption @click.native="send_name(item.know_uid)" class="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        <icon-edit class="mr-2" />重命名
                      </a-doption>
                      <a-doption @click.native="delete_this(item.know_uid)" class="flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                        <icon-delete class="mr-2" />删除
                      </a-doption>
                    </template>
                  </a-dropdown>
                </div>
                <div class="flex items-center">
                  <a-image :src="item.avatar" class="w-16 h-16 rounded-lg mr-4 transition-transform duration-300 group-hover:scale-105" />
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors duration-200">{{ item.title }}</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a-modal v-model:visible="name_info" title="修改名称" @ok="rename">
          <a-input v-model="beizhu" placeholder="输入新的名称"/>
        </a-modal>

        <Nfooter/>
      </main>
    </a-spin>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {
    IconDelete,
    IconEdit,
    IconMore,
    IconRotateRight,
    IconShareInternal,
    IconSwap
} from "@arco-design/web-vue/es/icon";
import {useCounter} from "~/store/counter";
import {get_all_knowledge} from "~/utils/api";
import {Message} from "@arco-design/web-vue";
const counter = useCounter()
useHead({
    title: '知识库 - '+counter.setting.title,
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
const create_load = ref(false)
const create_knowledge = (type: string) => {
    if (type === 'new') {
        create_load.value = true
        create_know().then((res:any) => {
            create_load.value = false
            router.push('/know/'+res._rawValue.data)
        }).catch((err:any) => {
            create_load.value = false
            console.log(err)
        })
    }
    router.push('/know/'+type)

}

interface KnowledgeItem {
  know_uid: string;
  title: string;
  description: string;
  avatar: string;
  is_public: boolean;
}

const publist = ref<KnowledgeItem[]>([])
const get_knowledge = () => {
    get_all_knowledge().then((res:any) => {
        publist.value = res._rawValue.data
    }).catch((err:any) => {
        console.log(err)
    })
}
if (token.value) {
    get_knowledge()
}
const now_id  =ref(0)
const name_info = ref(false)
const beizhu = ref('')
const send_name = (id:any)=>{
  now_id.value = id
  name_info.value = true
}
const delete_this = (id:any) =>{
  delete_knowledge({
    know_uid: id
  }).then((res: any) => {
    Message.success('删除成功')
    get_knowledge()
  }).catch((err: any) => {
    console.log(err)
  })
}
const rename = ()=>{
  rename_knowledge({
    know_uid:now_id.value,
    title:beizhu.value
  }).then((res:any)=>{
    Message.success('修改成功')
    get_knowledge()
  }).catch((err:any)=>{
    console.log(err)
  })
}

const send_public = (id:any)=>{
  public_knowledge({
    know_uid:id
  }).then((res:any)=>{
    Message.success(res._rawValue.message)
    get_knowledge()
  }).catch((err:any)=>{
    console.log(err)
  })
}
</script>
<style scoped>
.a-dropdown-option {
  @apply flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-10%); }
  50% { transform: translateY(0); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .7; }
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

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}
</style>
