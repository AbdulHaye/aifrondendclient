<template>
  <a-row :gutter="20">
    <a-col :span="24">
      <div class='tag-list'>
        <div v-for="(row, index) in rows" :key="index" class='loop-slider' :style="{
        '--duration': `${row.duration}ms`,
        '--direction': row.reverse ? 'reverse' : 'normal'
      }"  @mouseover="pause(index)" @mouseleave="resume(index)">

          <div class='inner'  :class="{ paused: pausedRows[index] }">
            <div v-for="tag in row.tags" :key="tag" @click="selectedItems(tag.Instruction,tag.preset)" class='tag bg-boli'><span>
            <a-avatar class="opacity-100"
                      :imageUrl="tag.icon"
            >
          </a-avatar>
          </span> {{ tag.title }} </div>
            <div v-for="tag in row.tags" :key="tag+'2'" @click="selectedItems(tag.Instruction,tag.preset)" class='tag bg-boli'><span>
            <a-avatar class="opacity-100"
                      :imageUrl="tag.icon"
            >
          </a-avatar>
          </span> {{ tag.title }}</div>
          </div>
        </div>
        <div class='fade'/>
      </div>
    </a-col>

  </a-row>

</template>
<script setup lang="ts">
import {ref} from 'vue'
const props = defineProps({
  scene: {
    type: Array as any,
    default: []
  }
});
const pausedRows = ref([]) as any;

const pause = (index: any) => {
  pausedRows.value[index] = true;
};

const resume = (index:any) => {
  pausedRows.value[index] = false;
};
const DURATION = 35000;
const ROWS = 4;
const TAGS_PER_ROW = 10;
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr: string[]) => [...arr].sort( () => .5 - Math.random() );
const rows = Array.from({ length: ROWS }, (_, i) => ({
  duration: random(DURATION - 5000, DURATION + 5000),
  reverse: i % 2,
  tags: shuffle(props.scene).slice(0, TAGS_PER_ROW)
}));
const emit = defineEmits(['selectedItems']) // 定义emit
const selectedItems = (Instruction: string, preset: string) => {
  emit('selectedItems', Instruction, preset)
}
</script>
<style lang="scss">
.tag{
  .arco-avatar{
    background: none;
  }
}
.tag-list {
  width: 50rem;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 1rem 0;
  position: relative;
  padding: 1.5rem 0;
  overflow: hidden;
}
.inner.paused {
  animation-play-state: paused;
}
.loop-slider {
  .inner {
    display: flex;
    width: fit-content;
    animation-name: loop;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: var(--direction);
    animation-duration: var(--duration);
  }
}

.tag {
  display: flex;
  align-items: center;
  gap: 0 0.2rem;
  font-size: 0.9rem;
  border-radius: 0.4rem;
  padding: 0.7rem 1rem;
  margin-right: 1rem; // Must used margin-right instead of gap for the loop to be smooth
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  span {
    font-size: 1.2rem;
    color: #64748b;
  }
}

.fade {
  pointer-events: none;
  background: linear-gradient(90deg, #1e293b, transparent 30%, transparent 70%, #1e293b);
  position: absolute;
  inset: 0;
}

@keyframes loop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
