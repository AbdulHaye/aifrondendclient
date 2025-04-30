<template>
  <div class="ai-tools p-8">
    <div class="ai-tools-title">
      <h1 class="inline-block">
        AI工具箱，
      </h1>
      <div class="tools-code inline-block">
        <span>一</span>
        <span>键</span>
        <span class="colors-tool">处</span>
        <span class="colors-tool">理</span>
      </div>
    </div>
    <div class="ai-tools-row">
      <a-row :gutter="20">
        <a-col :xs=24 :lg=6>
          <div class="mb-4 tool-list-li relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b  to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 from-blue-500"></div>
            <div class="relative">
              <img src="@/assets/images/tool-3.png" class="w-16 py-2" alt="">
              <h4 class="mt-2">图转代码</h4>

              <div class="mt-2 pb-3 rounded-b-[--card-border-radius]">
                <p class="app-description text-gray-700 dark:text-gray-300">通过上传图片使用AI将其转换为代码</p>
              </div>
              <NuxtLink to="/tools/code" class="tool-go">
                <svg t="1710260936172" class="icon" viewBox="0 0 5585 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29999" width="48" height="48"><path d="M5555.665455 862.952727L4654.545455 25.134545a93.090909 93.090909 0 0 0-130.327273 4.654546 93.090909 93.090909 0 0 0-21.410909 80.058182 93.090909 93.090909 0 0 0 26.065454 51.2L5255.912727 837.818182H93.090909a93.090909 93.090909 0 0 0 0 186.181818h5399.272727a93.090909 93.090909 0 0 0 63.301819-161.047273z" p-id="30000" fill="#515151"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </a-col>
        <a-col :xs=24 :lg=6>
          <div class="mb-4 tool-list-li relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b  to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 from-blue-500"></div>
            <div class="relative">
              <img src="@/assets/images/tool-2.png" class="w-12 py-2" alt="">
              <h4 class="mt-2">在线翻译</h4>

              <div class="mt-2 pb-3 rounded-b-[--card-border-radius]">
                <p class="app-description text-gray-700 dark:text-gray-300">识别各国语言，通过AI翻译转换</p>
              </div>
              <NuxtLink to="/tools/translate" class="tool-go">
                <svg t="1710260936172" class="icon" viewBox="0 0 5585 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29999" width="48" height="48"><path d="M5555.665455 862.952727L4654.545455 25.134545a93.090909 93.090909 0 0 0-130.327273 4.654546 93.090909 93.090909 0 0 0-21.410909 80.058182 93.090909 93.090909 0 0 0 26.065454 51.2L5255.912727 837.818182H93.090909a93.090909 93.090909 0 0 0 0 186.181818h5399.272727a93.090909 93.090909 0 0 0 63.301819-161.047273z" p-id="30000" fill="#515151"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </a-col>
        <a-col :xs=24 :lg=6>
          <div class="mb-4 tool-list-li relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b  to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 from-blue-500"></div>
            <div class="relative">
              <img src="@/assets/images/tool-4.png" class="w-12 py-2" alt="">
              <h4 class="mt-2">语音转文字</h4>

              <div class="mt-2 pb-3 rounded-b-[--card-border-radius]">
                <p class="app-description text-gray-700 dark:text-gray-300">识别flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm语音文件转文字</p>
              </div>
              <NuxtLink to="/tools/audio_trans" class="tool-go">
                <svg t="1710260936172" class="icon" viewBox="0 0 5585 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29999" width="48" height="48"><path d="M5555.665455 862.952727L4654.545455 25.134545a93.090909 93.090909 0 0 0-130.327273 4.654546 93.090909 93.090909 0 0 0-21.410909 80.058182 93.090909 93.090909 0 0 0 26.065454 51.2L5255.912727 837.818182H93.090909a93.090909 93.090909 0 0 0 0 186.181818h5399.272727a93.090909 93.090909 0 0 0 63.301819-161.047273z" p-id="30000" fill="#515151"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </a-col>
        <a-col :xs=24 :lg=6>
          <div class="mb-4 tool-list-li relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
            <div aria-hidden="true" class="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b  to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 from-blue-500"></div>
            <div class="relative">
              <img src="@/assets/images/tool-1.png" class="w-16 py-2" alt="">
              <h4 class="mt-2">OCR识图</h4>

              <div class="mt-2 pb-3 rounded-b-[&#45;&#45;card-border-radius]">
                <p class="app-description text-gray-700 dark:text-gray-300">上传图片、识别图片文字</p>
              </div>
              <NuxtLink to="/tools/image_deel" class="tool-go">
                <svg t="1710260936172" class="icon" viewBox="0 0 5585 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29999" width="48" height="48"><path d="M5555.665455 862.952727L4654.545455 25.134545a93.090909 93.090909 0 0 0-130.327273 4.654546 93.090909 93.090909 0 0 0-21.410909 80.058182 93.090909 93.090909 0 0 0 26.065454 51.2L5255.912727 837.818182H93.090909a93.090909 93.090909 0 0 0 0 186.181818h5399.272727a93.090909 93.090909 0 0 0 63.301819-161.047273z" p-id="30000" fill="#515151"></path></svg>
              </NuxtLink>
            </div>
          </div>
        </a-col>

      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">

import {IconRight, IconStar, IconStarFill} from "@arco-design/web-vue/es/icon";

</script>


<style scoped>

</style>
