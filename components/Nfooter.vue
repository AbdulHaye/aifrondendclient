<script setup lang="ts">
import {ref} from 'vue'
import {useCounter} from "~/store/counter";
const counter = useCounter()

</script>

<template>
    <div class="flex justify-content-center w-100 text-gray-900">
        <NuxtLink to="https://beian.miit.gov.cn" target="_blank" class="text-gray-900">
            {{counter.setting.icp_beian}}
        </NuxtLink>

    </div>
</template>

<style scoped>

</style>
