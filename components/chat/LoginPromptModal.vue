<!-- components/LoginPromptModal.vue -->
<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
        Login Required
      </h3>
      <p class="text-gray-600 text-center mb-6">
        Please login to use the multi-window feature.
      </p>
      <div class="flex justify-center">
        <button
          @click="closeModal"
          class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isVisible"]);

const closeModal = () => {
  emit("update:isVisible", false);
};
</script>
