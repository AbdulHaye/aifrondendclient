<template>
  <div
    class="flex flex-col h-full bg-white relative border-r border-b bg-transparent"
  >
    <h5
      class="text-md font-semibold text-gray-700 text-center bg-white py-2 sticky top-0 z-20 bg-transparent"
    >
      {{ model }}
    </h5>
    <div
      ref="chatContainer"
      class="flex-1 overflow-y-auto space-y-6 p-4"
      style="
        max-height: calc(100vh - 150px);
        height: auto;
        min-height: 0;
        padding-bottom: 120px;
        margin-bottom: 20px;
      "
    >
      <MessageBubble
        v-for="(message, index) in messages"
        :key="message.id || index"
        :text="message.text"
        :timestamp="message.timestamp"
        :is-user="message.isUser"
        :is-thinking="message.isThinking"
        :avatar="avatar"
        :message-id="message.id"
        :model="model"
        :model-key="modelKey"
        :question="!message.isUser && index > 0 ? messages[index - 1].text : ''"
        :speak-is-audio="speakIsAudio"
        :images="message.images || []"
        :is-history="message.isHistory || false"
        @feedback="$emit('feedback', $event)"
        @toggle-speak="toggleSpeak"
        @refresh-answer="refreshAnswer"
        @export-word="exportWord"
        @export-pdf="exportPdf"
        @delete="deleteMessage"
      />
      <div v-if="!messages.length" class="text-gray-500 text-center">
        No messages yet for {{ model }}
      </div>
    </div>
  </div>
</template>

<script>
import MessageBubble from "./MessageBubble.vue";
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash";

export default {
  name: "ModelChat",
  components: { MessageBubble },
  props: {
    model: { type: String, required: true },
    modelKey: { type: String, required: true },
    messages: { type: Array, required: true, default: () => [] },
    avatar: { type: String, required: true },
    speakIsAudio: { type: Boolean, default: false },
    imageUrls: { type: Array, default: () => [] },
  },
  setup(props, { emit }) {
    const chatContainer = ref(null);
    const speakIsAudio = ref(props.speakIsAudio);
    let mutationObserver = null;

    const toggleSpeak = (text) => emit("toggle-speak", text);
    const refreshAnswer = (question) => emit("refresh-answer", question);
    const exportWord = (text) => emit("export-word", text);
    const exportPdf = (text) => emit("export-pdf", text);
    const deleteMessage = (messageId) => emit("delete", messageId);

    const scrollToBottom = debounce(async () => {
      await nextTick();
      if (!chatContainer.value) return;

      const container = chatContainer.value;
      container.scrollTo({
        top: container.scrollHeight - container.clientHeight,
        behavior: "smooth",
      });
    }, 0);

    watch(
      () => props.messages,
      () => {
        scrollToBottom();
      },
      { deep: true, immediate: true }
    );

    watch(
      () => props.messages.length,
      (newLength) => {
        if (newLength > 0) {
          scrollToBottom();
        }
      },
      { immediate: true }
    );

    const setupMutationObserver = () => {
      if (!chatContainer.value) return;

      mutationObserver = new MutationObserver(() => {
        scrollToBottom();
      });

      mutationObserver.observe(chatContainer.value, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    onMounted(() => {
      setupMutationObserver();
      console.log(
        `ModelChat mounted for ${props.model}, messages:`,
        props.messages
      );
      scrollToBottom();
    });

    onUnmounted(() => {
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    });

    return {
      chatContainer,
      speakIsAudio,
      toggleSpeak,
      refreshAnswer,
      exportWord,
      exportPdf,
      deleteMessage,
    };
  },
};
</script>

<style scoped>
.sticky {
  background: white;
}
</style>
