<template>
  <div class="workers bg-gray-50 w-full  pb-10">
    <div class="circle-info">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <div class="hero-section4">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center pb-[100px]">
        <div class="max-w-[490px] py-6 mx-auto md:mx-0 text-center md:text-start">
          <p class="text-blue-500 text-xs md:text-base font-normal"> AI Generate </p>
          <h2 class="font-semibold text-2xl md:text-6xl text-gray-900">
            <span class="text-blue-500 bg-contain bg-no-repeat"> {{ typedText }} </span>
            <p style="font-size: 32px" class="mt-2">
              {{ counter.setting.description }}
            </p>
          </h2>
          <p class="font-normal text-xs md:text-base text-gray-700  py-3 md:py-6">
            多样化模型设计、轻松地将您的想法转化为非常准确的信息流、创作者现在还可以选择加入我们未来生成模型的训练。
          </p>
          <div class="flex justify-center pt-1 md:pt-2 pb-4 md:pb-12">
            <NuxtLink to="/ai_chat" class="mr-2">
              <button class="work-button" style="vertical-align:middle"><span>开始对话</span></button>
            </NuxtLink>
            <NuxtLink to="/ai_draw">
              <button class="work-button work-button-white" style="vertical-align:middle"><span>构思绘画</span></button>
            </NuxtLink>
          </div>
          <div class="flex items-center justify-between pb-6 md:pb-0">
            <div>
              <h4 class="font-semibold text-xl md:text-4xl text-gray-900 "> 8+ </h4>
              <p class="font-normal text-xs md:text-base text-gray-700 "> 大模型集 </p>
            </div>
            <div>
              <h4 class="font-semibold text-xl md:text-4xl text-gray-900 "> 100K+ </h4>
              <p class="font-normal text-xs md:text-base text-gray-700 "> 绘图量 </p>
            </div>
            <div>
              <h4 class="font-semibold text-xl md:text-4xl text-gray-900 "> 100+ </h4>
              <p class="font-normal text-xs md:text-base text-gray-700 "> 知识库集 </p>
            </div>
          </div>
        </div>
        <img src="@/assets/images/work-right-icon.png" class="ai-bot-work">
      </div>
    </div>
    <div class="container mx-auto hero-section-index">
      <section class="pb-[100px]">
        <h4 class="text-gray-900  text-center"> 工具 <span class="text-blue-500">分类</span>
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 pt-12">

          <NuxtLink to="/mark_me" class="list-animation-leftIn delay-1">
            <div class="flex flex-col justify-center items-center  h-full">

              <div
                class="!z-5 relative flex flex-col rounded-xl overflow-hidden shadow-xl max-w-[300px bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
                <div class="h-full w-full">
                  <div class="relative w-full">
                    <img
                      src="@/assets/images/work-1.jpg"
                      class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="">

                  </div>
                  <div class="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div class="mb-2">
                      <p class="text-lg font-bold text-navy-700"> 思维导图 </p>
                      <p class="mt-1 text-sm font-medium text-gray-600 md:mt-2">扩展脑图markmap </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink to="/pdf_generate" class="list-animation-leftIn delay-2">
            <div class="flex flex-col justify-center items-center  h-full">

              <div
                class="!z-5 relative flex flex-col rounded-xl overflow-hidden shadow-xl max-w-[300px bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
                <div class="h-full w-full">
                  <div class="relative w-full">
                    <img
                      src="@/assets/images/work-2.jpg"
                      class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="">

                  </div>
                  <div class="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div class="mb-2">
                      <p class="text-lg font-bold text-navy-700"> PDF解析 </p>
                      <p class="mt-1 text-sm font-medium text-gray-600 md:mt-2">提取PDF文档内容回复 </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink to="/ai_write" class="list-animation-leftIn delay-3">
            <div class="flex flex-col justify-center items-center  h-full">

              <div
                class="!z-5 relative flex flex-col rounded-xl overflow-hidden shadow-xl max-w-[300px bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
                <div class="h-full w-full">
                  <div class="relative w-full">
                    <img
                      src="@/assets/images/work-3.jpg"
                      class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="">

                  </div>
                  <div class="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div class="mb-2">
                      <p class="text-lg font-bold text-navy-700"> Ai写作 </p>
                      <p class="mt-1 text-sm font-medium text-gray-600 md:mt-2">通过AI进行辅助写作 </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink to="/knowledge" class="list-animation-leftIn delay-4">
            <div class="flex flex-col justify-center items-center  h-full">

              <div
                class="!z-5 relative flex flex-col rounded-xl overflow-hidden shadow-xl max-w-[300px bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
                <div class="h-full w-full">
                  <div class="relative w-full">
                    <img
                      src="@/assets/images/work-4.jpg"
                      class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="">

                  </div>
                  <div class="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div class="mb-2">
                      <p class="text-lg font-bold text-navy-700"> 知识库 </p>
                      <p class="mt-1 text-sm font-medium text-gray-600 md:mt-2">上传海量信息进行回答 </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink :to="item.url" :target="item.is_target ? '_blank' : ''" v-for="(item, index) in work_me" :key="index">
            <div
              class="flex h-[278px] bg-cover bg-center items-end px-5 py-4   rounded-lg outline outline-1 hover:outline-2 outline-gray-300 hover:outline-blue-500 cursor-pointer   cursor-pointer  shadow-outline hover:shadow-hover"
              :style="`
  background-image: linear-gradient(
    359.88deg,
    rgb(86 86 86 / 87%) 10.1%,
    rgb(255 255 255 / 8%) 98.86%
  ),
  url(${item.icon});
`">
              <p class="text-white font-normal text-lg">{{ item.title }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
      <section class="pb-[100px]">
        <h4 class="text-gray-900  text-center">
          <span class="text-blue-500">AI智能</span> 小应用
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 pt-12">
          <NuxtLink :to="'/app/' + item.id" v-for="(item, index) in applications" :key="index"
            class="list-animation-leftIn" :class="'delay-' + index">
            <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 flex items-center overflow-hidden justify-center rounded-full bg-blue-500 text-white">
                  <a-image :src="item.icon" class="w-12 h-12" />
                </div>
              </div>
              <div>
                <h3 class="text-gray-900 font-18 font-bold font-medium leading-5">{{ item.title }}</h3>
                <p class="text-gray-500 text-sm truncate w-40">{{ item.description }}</p>
                <a-button type="primary" size="small" class="mt-4 text-sm text-gray-400">
                  <template #icon>
                    <icon-right />
                  </template>
                  立即进入
                </a-button>
              </div>
            </div>
          </NuxtLink>

        </div>
      </section>
    </div>
    <div class="pt-4 pb-2 md:py-9 text-center w-full text-gray-700  font-normal"> Copyright © 2022-2023
      {{ counter.setting.title }}. All Rights Reserves {{ counter.setting.icp_beian }}</div>

  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const counter = useCounter()

import {
  IconArrowRight,
} from '@arco-design/web-vue/es/icon';
import { useCounter } from "~/store/counter";

const hover_num = ref(0)
useHead({
  title: '工作台 - ' + counter.setting.title,
  meta: [
    { name: 'description', content: counter.setting.description },
    { name: 'keywords', content: counter.setting.keywords }
  ],

})
const handleMouseover = (index: number) => {
  hover_num.value = index
}

const timer = ref('')
const getTime = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const fullText = counter.setting.title;
// 响应式数据属性，用于存储当前已打印的文本
const typedText = ref('');
// 当前文本索引
let index = 0;
// 打字速度（毫秒）
const typingSpeed = 300;
// 定时器ID
let intervalId;

// 逐字显示文本的方法
const type = () => {
  // 检查索引是否小于文本长度
  if (index < fullText.length) {
    // 将下一个字符添加到typedText
    typedText.value += fullText.charAt(index);
    // 索引递增
    index++;
  } else {
    // 如果文本已经打印完成，清除定时器
    clearInterval(intervalId);
  }
};

onMounted(() => {
  // 组件挂载后开始打字效果
  intervalId = setInterval(type, typingSpeed);
});

onUnmounted(() => {
  // 组件卸载前清除定时器
  clearInterval(intervalId);
});

const applications = ref([])
const work_me = ref([])
const loadings = ref(false)
const get_all = () => {
  loadings.value = true
  get_all_app({
    page: 1,
    limit: 40
  }).then((res: any) => {
    applications.value = res._rawValue.data
    loadings.value = false
  }).catch((err: any) => {
    console.log(err)
  })

  work_model().then((res: any) => {
    work_me.value = res._rawValue.data
  }).catch((err: any) => {
    console.log(err)
  })

}
get_all()
</script>
<style scoped></style>
