<template>
  <iframe :src="info?info.iframe_url:''" class="vh-100" width="100%" height="100%" sandbox="allow-same-origin allow-scripts" frameborder="0" allowfullscreen></iframe>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const route = useRoute()
const other = ref(route.params.other)
const info = ref({
  iframe_url: '',
  target:0

})
const getOther = () => {
  get_iframe({
    other: other.value
  }).then((res:any) => {
    info.value = res._rawValue.data
  }).catch((err:any) => {
    console.log(err)
  })
}

onMounted(async () => {
  await nextTick()
  getOther()
})
</script>
<style scoped>

</style>
