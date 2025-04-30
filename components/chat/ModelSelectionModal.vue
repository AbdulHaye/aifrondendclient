<template>
  <a-modal
    :visible="visible"
    title="Select Models"
    @ok="handleConfirm"
    @cancel="handleClose"
    :ok-button-props="{ disabled: selectedModels.length < selectionType }"
  >
    <div class="model-selection">
      <p>
        Please select
        {{ selectionType === 2 ? "2" : "4" }}
        models for
        {{ selectionType === 2 ? "multi-window" : "quad-window" }}
        chat.
      </p>
      <a-checkbox-group v-model="selectedModels">
        <a-checkbox
          v-for="model in enabledModels"
          :key="model.id"
          :value="model.id"
          :disabled="isCheckboxDisabled(model.id)"
        >
          {{ model.model_name }}
        </a-checkbox>
      </a-checkbox-group>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { Message } from "@arco-design/web-vue";

// Define props with TypeScript types
const props = defineProps<{
  enabledModels: { id: string; model_key: string; model_name: string }[];
  selectionType: number; // Expected to be 2 or 4
}>();

// Define emits
const emit = defineEmits<{
  (e: "confirm", selected: any[]): void;
  (e: "cancel"): void;
}>();

// Local state
const selectedModels = ref<string[]>([]);
const visible = ref(true); // Controlled by parent v-if

// Check if a checkbox should be disabled
const isCheckboxDisabled = (modelId: string) => {
  return (
    selectedModels.value.length >= props.selectionType &&
    !selectedModels.value.includes(modelId)
  );
};

// Handle confirm button
const handleConfirm = () => {
  if (selectedModels.value.length !== props.selectionType) {
    Message.warning(`Please select exactly ${props.selectionType} models.`);
    return;
  }
  const selected = props.enabledModels.filter((model) =>
    selectedModels.value.includes(model.id)
  );
  emit("confirm", selected);
  handleClose();
};

// Handle close button
const handleClose = () => {
  selectedModels.value = [];
  visible.value = false;
  emit("cancel");
};

// Watch selectionType for debugging or reactive updates
watch(
  () => props.selectionType, // Access via props
  (newVal) => {
    console.log("selectionType updated to:", newVal);
    // Reset selections if selectionType changes
    if (selectedModels.value.length > newVal) {
      selectedModels.value = selectedModels.value.slice(0, newVal);
    }
  },
  { immediate: true } // Run immediately on mount
);
</script>

<style scoped>
.model-selection {
  max-height: 400px;
  overflow-y: auto;
}
</style>
