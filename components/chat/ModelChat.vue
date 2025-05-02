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
      class="relative flex-1 overflow-y-auto space-y-6 p-4"
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
        :typing-speed="5"
        :initial-delay="50"
        :question="!message.isUser && index > 0 ? messages[index - 1].text : ''"
        :speak-is-audio="speakIsAudio"
        :images="message.images || []"
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
import { debounce } from "lodash"; // Optional: Use lodash for debouncing

export default {
  name: "ModelChat",
  components: { MessageBubble },
  props: {
    model: { type: String, required: true },
    modelKey: { type: String, required: true },
    messages: { type: Array, required: true, default: () => [] },
    avatar: { type: String, required: true },
    speakIsAudio: { type: Boolean, default: false },
    textImageUrls: { type: Array, default: () => [] },
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

    // Debounced scroll to bottom function
    const scrollToBottom = debounce(async () => {
      await nextTick(); // Wait for DOM update
      if (!chatContainer.value) return;

      const container = chatContainer.value;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    // Watch for changes in messages and scroll to bottom
    watch(
      () => props.messages,
      () => {
        scrollToBottom();
      },
      { deep: true }
    );

    // Watch for initial messages and scroll to bottom
    watch(
      () => props.messages.length,
      (newLength) => {
        if (newLength > 0) {
          scrollToBottom();
        }
      },
      { immediate: true }
    );

    // Set up MutationObserver to detect DOM changes
    const setupMutationObserver = () => {
      if (!chatContainer.value) return;

      mutationObserver = new MutationObserver(() => {
        scrollToBottom();
      });

      mutationObserver.observe(chatContainer.value, {
        childList: true, // Detect addition/removal of messages
        subtree: true, // Detect changes in descendants (e.g., image loading)
        characterData: true, // Detect text changes
      });
    };

    // Initialize MutationObserver on mount
    onMounted(() => {
      setupMutationObserver();
      console.log(
        `ModelChat mounted for ${props.model}, messages:`,
        props.messages
      );
    });

    // Clean up MutationObserver on unmount
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
