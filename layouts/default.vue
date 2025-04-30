<template>
    <div id="layout" class="layout-demo">
        <Navigation />
        <slot></slot>
        <ChatSiderbar v-if="isChatSidebarVisible" />
        <div class="tongji" v-if="counter.setting.script_tongji" v-html="counter.setting.script_tongji"></div>

      <Footer />
    </div>
</template>
<script setup>
import {useCounter} from "~/store/counter";

const counter = useCounter()
// 定义一个状态来控制 ChatSiderbar 的显示和隐藏
const isChatSidebarVisible = ref(false);

// 提供一个方法来切换 ChatSiderbar 的显示状态
const toggleChatSidebar = () => {
  isChatSidebarVisible.value = !isChatSidebarVisible.value;
};

// 使用 provide 来共享状态和方法
provide('isChatSidebarVisible', isChatSidebarVisible);
provide('toggleChatSidebar', toggleChatSidebar);
</script>
