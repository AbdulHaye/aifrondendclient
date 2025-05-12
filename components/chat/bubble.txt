<template>
  <div :class="['flex flex-col', isUser ? 'items-end' : 'items-start']">
    <div class="flex items-start relative">
      <div
        v-if="!isUser"
        class="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0"
      >
        <img :src="avatar" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div
        :class="[
          'rounded-lg py-2 px-4 max-w-xs relative group',
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700',
          windowCount === 2 ? 'mb-20' : 'mb-10',
        ]"
      >
        <div v-if="!isUser && isThinking" class="thinking-dots">
          <span>思考中</span>
          <span class="dot">.</span><span class="dot">.</span
          ><span class="dot">.</span>
        </div>
        <div
          v-else-if="!isUser"
          class="message-content"
          v-html="renderedMarkdown"
        ></div>
        <p v-else class="text-[14px] text-white">{{ text }}</p>
        <div
          v-if="!isUser && !isThinking"
          :class="[
            'absolute flex items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100',
            'bottom-[-36px] left-0 right-0 justify-start',
          ]"
        >
          <div class="flex gap-2">
            <button class="chat-tool-btn" @click="$emit('toggle-speak', text)">
              <div class="sign"><icon-voice /></div>
              <div class="text">{{ speakIsAudio ? "停止" : "朗读" }}</div>
            </button>
            <button
              class="chat-tool-btn"
              @click="$emit('refresh-answer', question)"
            >
              <div class="sign"><icon-refresh /></div>
              <div class="text">重新生成</div>
            </button>
            <button class="chat-tool-btn" @click="handleCopy">
              <div class="sign"><icon-copy /></div>
              <div class="text">复制答案</div>
            </button>
            <button class="chat-tool-btn" @click="$emit('export-word', text)">
              <div class="sign"><icon-share-internal /></div>
              <div class="text">导出Word</div>
            </button>
            <button class="chat-tool-btn" @click="$emit('export-pdf', text)">
              <div class="sign"><icon-download /></div>
              <div class="text">导出PDF</div>
            </button>
            <a-popconfirm
              content="此操作将永久删除当条消息,确定要删除吗?"
              @confirm="$emit('delete', messageId)"
              type="warning"
            >
              <button class="chat-tool-btn">
                <div class="sign"><icon-delete /></div>
                <div class="text">删除</div>
              </button>
            </a-popconfirm>
            <button class="chat-tool-btn" @click="handleThumbsUp">
              <div class="sign">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <div class="text">好评</div>
            </button>
            <button class="chat-tool-btn" @click="handleThumbsDown">
              <div class="sign">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <g transform="rotate(180 12 12)">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </g>
                </svg>
              </div>
              <div class="text">差评</div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="images && images.length > 0" class="mt-2 flex flex-wrap gap-2">
      <img
        v-for="(img, imgIndex) in images"
        :key="imgIndex"
        :src="img"
        class="w-16 h-16 object-contain rounded"
        alt="用户上传的图片"
      />
    </div>
    <FeedbackModal
      :is-open="isFeedbackModalOpen"
      :feedback-type="feedbackType"
      :message-id="messageId"
      :model-key="modelKey"
      @close="closeFeedbackModal"
      @submit="handleFeedbackSubmit"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { marked } from "marked";
import {
  IconVoice,
  IconRefresh,
  IconCopy,
  IconShareInternal,
  IconDownload,
  IconDelete,
} from "@arco-design/web-vue/es/icon";
import { Popconfirm } from "@arco-design/web-vue";
import FeedbackModal from "./FeedbackModal.vue";

export default {
  name: "MessageBubble",
  components: {
    IconVoice,
    IconRefresh,
    IconCopy,
    IconShareInternal,
    IconDownload,
    IconDelete,
    Popconfirm,
    FeedbackModal,
  },
  props: {
    text: { type: String, required: true },
    timestamp: { type: Date, required: true },
    isUser: { type: Boolean, required: true },
    avatar: { type: String, required: true },
    messageId: { type: [String, Number], default: null },
    model: { type: String, required: true },
    modelKey: { type: String, required: true },
    isThinking: { type: Boolean, default: false },
    question: { type: String, default: "" },
    speakIsAudio: { type: Boolean, default: false },
    images: { type: Array, default: () => [] },
    isHistory: { type: Boolean, default: false },
    windowCount: { type: Number, default: 0 },
  },
  setup(props, { emit }) {
    const displayedText = ref("");
    const renderedMarkdown = ref("");
    let typingInterval = null;

    const renderMarkdown = () => {
      try {
        // Configure marked to handle UTF-8 correctly
        renderedMarkdown.value = marked(displayedText.value, {
          gfm: true,
          breaks: true,
          silent: true, // Suppress warnings
        });
      } catch (error) {
        console.error("Markdown rendering error:", error);
        renderedMarkdown.value = displayedText.value;
      }
    };

    const startTyping = () => {
      if (typingInterval) clearInterval(typingInterval);
      displayedText.value = "";
      const speed = 1; // Typing speed in milliseconds per character
      let index = 0;
      const textLength = props.text.length;

      typingInterval = setInterval(() => {
        if (index < textLength) {
          // Use substring to ensure character-by-character display
          displayedText.value = props.text.substring(0, index + 1);
          index++;
          renderMarkdown();
        } else {
          clearInterval(typingInterval);
          typingInterval = null;
        }
      }, speed);
    };

    watch(
      () => props.text,
      (newText) => {
        if (
          !props.isUser &&
          !props.isHistory &&
          newText.length > 0 &&
          !props.isThinking
        ) {
          startTyping();
        } else {
          displayedText.value = newText;
          renderMarkdown();
        }
      }
    );

    watch(
      () => props.isThinking,
      (newThinking) => {
        if (
          !newThinking &&
          !props.isUser &&
          props.text.length > 0 &&
          props.text !== "Thinking..."
        ) {
          startTyping();
        } else if (newThinking) {
          displayedText.value = "思考中...";
          renderMarkdown();
        }
      }
    );

    onMounted(() => {
      if (props.isUser || props.isHistory) {
        displayedText.value = props.text;
        renderMarkdown();
      } else if (
        !props.isThinking &&
        props.text.length > 0 &&
        props.text !== "Thinking..."
      ) {
        startTyping();
      } else if (props.isThinking) {
        displayedText.value = "思考中...";
        renderMarkdown();
      }
    });

    onUnmounted(() => {
      if (typingInterval) clearInterval(typingInterval);
    });

    const isFeedbackModalOpen = ref(false);
    const feedbackType = ref("");

    const handleThumbsUp = () => {
      feedbackType.value = "positive";
      isFeedbackModalOpen.value = true;
    };

    const handleThumbsDown = () => {
      feedbackType.value = "negative";
      isFeedbackModalOpen.value = true;
    };

    const closeFeedbackModal = () => {
      isFeedbackModalOpen.value = false;
    };

    const handleFeedbackSubmit = (data) => {
      emit("feedback", {
        reportableId: props.messageId,
        reportableType: "App\\Models\\Message",
        aiFunction: mapModelToAiFunction(props.modelKey),
        type: data.type,
        text: data.text,
        issueType: data.issueType,
      });
      closeFeedbackModal();
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(props.text).then(
        () => console.log("已复制到剪贴板"),
        (err) => console.error("复制失败:", err)
      );
    };

    const mapModelToAiFunction = (modelKey) => {
      const mapping = { grok: "text", claude: "text" };
      return mapping[modelKey] || "text";
    };

    return {
      displayedText,
      renderedMarkdown,
      handleThumbsUp,
      handleThumbsDown,
      handleCopy,
      isFeedbackModalOpen,
      feedbackType,
      closeFeedbackModal,
      handleFeedbackSubmit,
    };
  },
};
</script>

<style scoped>
.message-content {
  line-height: 1.5;
  font-size: 14px;
}
.message-content h1,
.message-content h2,
.message-content h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.message-content ul,
.message-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}
.message-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1em;
}
.message-content code {
  font-family: monospace;
}

.thinking-dots {
  display: flex;
  align-items: center;
  gap: 2px;
}
.thinking-dots .dot {
  animation: blink 1s infinite;
}
.thinking-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.thinking-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
