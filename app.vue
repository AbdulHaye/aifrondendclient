<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :height="2" :color="'#165dff'" :throttle="0" />

      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
@import "katex/dist/katex.min.css";
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
<script setup></script>
