<template>
  <a-row class="grid-demo w-100" :gutter=10>
    <a-col :xs="{span: 12}" :lg="{span: 6}" class="list-animation-leftIn" :class="'delay-'+ocp_index" v-for="(ocp,ocp_index) in props.scene">
      <div class="card_b" @click="selectedItems(ocp.Instruction,ocp.preset)">
        <div class="card_b__top">
          <a-avatar class="opacity-100"
                    :imageUrl="ocp.icon"
          >
          </a-avatar>
          <h2>{{ ocp.title }}</h2>
        </div>
        <div class="card_b__bottom">
          <h2>{{ ocp.title }}</h2>
          <p class="line-clamp-2">
            {{ ocp.Instruction }}
          </p>
          <p class="line-clamp-5">
            {{ocp.Instruction}}
          </p>
        </div>
        <span class="hover_card_bg" :style="{ 'background-image': `url(${ocp.icon})` }"></span>
      </div>
    </a-col>

  </a-row>

</template>
<script setup lang="ts">
const props = defineProps({
  scene: {
    type: Array as any,
    default: []
  }
});
const emit = defineEmits(['selectedItems']) // 定义emit
const selectedItems = (Instruction: string, preset: string) => {
  emit('selectedItems', Instruction, preset)
}
</script>
<style scoped>

</style>
