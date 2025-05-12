<template>
  <div class="flex flex-col h-full bg-transparent">
    <div class="flex-1 flex overflow-hidden bg-white rounded-lg">
      <div
        v-if="isReady"
        class="w-full grid gap-4 overflow-hidden transition-all duration-300"
        :class="[
          focusedModel
            ? 'grid-cols-1'
            : selectedModels.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2 grid-rows-2',
        ]"
        style="grid-auto-rows: 1fr"
      >
        <ModelChat
          v-for="model in selectedModels"
          :key="model.model_key"
          :model="model.model_name"
          :model-key="model.model_key"
          :messages="state.messages[model.model_key] || []"
          :avatar="state.avatar"
          :speak-is-audio="speakIsAudio"
          :image-urls="currentImageUrls"
          :selected-models="selectedModels"
          :models="selectedModels"
          @click="setFocusedModel(model.model_key)"
          @feedback="handleFeedback"
          @toggle-speak="toggleSpeak"
          @refresh-answer="refreshAnswer"
          @export-word="exportWord"
          @export-pdf="exportPdf"
          @delete="deleteMessage"
          :class="{ hidden: focusedModel && focusedModel !== model.model_key }"
        />
      </div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-500">
        Loading chat history...
      </div>
    </div>
    <div class="p-2 flex justify-center gap-2">
      <button
        v-if="focusedModel"
        class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors z-10 flex items-center gap-2"
        @click="clearFocusedModel"
        aria-label="Back to Multi-Window View"
      >
        Back to Multi-Window View
      </button>
      <button
        class="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition-colors z-10 flex items-center gap-2"
        @click="emit('close')"
        aria-label="Close Multi-Window"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import ModelChat from "./ModelChat.vue";
import { submitMessageReport } from "~/api/api";

const WS_URL = "wss://abdul.synthetixor.com/ws";

const props = defineProps({
  selectedModels: { type: Array, required: true, default: () => [] },
  userId: { type: [String, Number], default: null },
  speakIsAudio: { type: Boolean, default: false },
  textImageUrls: { type: Array, default: () => [] },
  initialSessionId: { type: [String, Number], default: null },
});

const emit = defineEmits([
  "toggle-speak",
  "refresh-answer",
  "export-word",
  "export-pdf",
  "delete-message",
  "feedback",
  "close",
  "update-session",
  "history-updated",
  "message-sent",
]);

const focusedModel = ref(null);
const isReady = ref(false);
const wsReady = ref(false);
const isMounted = ref(false);
const currentImageUrls = ref([]);
const state = reactive({
  messages: {},
  avatar:
    "https://kdkhvabm.synthetixor.com/images/202501/22/qYID1kyTI0IOhwQOXeYR85jOl4JzZfJ5fCqPWH1D.png",
  chatSocket: null,
  currentSessionId: null,
  reconnectAttempts: 0,
  pingInterval: null,
  pendingThinkingMessages: {},
});

const MAX_RECONNECT_ATTEMPTS = 5;
const PING_INTERVAL = 30000;

const generateMessageId = (prefix = "msg") =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

const validateModels = (models) => {
  if (!Array.isArray(models) || models.length === 0) return false;
  return models.every((model) => model.model_key && model.model_name);
};

const initializeMessages = (models) => {
  if (!state.currentSessionId) {
    state.currentSessionId =
      props.initialSessionId && props.initialSessionId !== "new"
        ? props.initialSessionId
        : null;
  }
  emit("update-session", state.currentSessionId);

  models.forEach((model) => {
    if (!state.messages[model.model_key]) {
      state.messages[model.model_key] = [
        {
          id: `init_${model.model_key}_${Date.now()}`,
          text: `Hello! I'm ${model.model_name}, how can I assist you?`,
          isUser: false,
          timestamp: new Date(),
          sessionId: state.currentSessionId,
        },
      ];
    } else {
      state.messages[model.model_key] = state.messages[model.model_key].map(
        (msg) => ({
          ...msg,
          sessionId: state.currentSessionId,
        })
      );
    }
  });
};

const handleWebSocketMessage = (message) => {
  if (!isMounted.value) return;
  console.log("Received WebSocket message:", message);

  if (message.type === "pong") {
    console.log("Received pong response from server");
    return;
  }

  if (message.type === "thinking") {
    const modelKey = message.model;
    if (state.messages[modelKey]) {
      const tempThinkingId = state.pendingThinkingMessages[modelKey];
      const thinkingMessageIndex = state.messages[modelKey].findIndex(
        (msg) => msg.id === tempThinkingId
      );

      if (thinkingMessageIndex !== -1) {
        state.messages[modelKey][thinkingMessageIndex] = {
          ...state.messages[modelKey][thinkingMessageIndex],
          id: message.message_id,
          text: "Thinking...",
          isUser: false,
          isThinking: true,
          timestamp: new Date(),
          sessionId: message.session_id || state.currentSessionId,
        };
        state.pendingThinkingMessages[modelKey] = message.message_id;
      } else {
        state.messages[modelKey].push({
          id: message.message_id,
          text: "Thinking...",
          isUser: false,
          isThinking: true,
          timestamp: new Date(),
          sessionId: message.session_id || state.currentSessionId,
        });
        state.pendingThinkingMessages[modelKey] = message.message_id;
      }
    }
  } else if (message.type === "chunk") {
    const modelKey = message.model;
    if (state.messages[modelKey]) {
      const messageIndex = state.messages[modelKey].findIndex(
        (msg) => msg.id === message.message_id
      );
      if (messageIndex !== -1) {
        const existingMessage = state.messages[modelKey][messageIndex];
        state.messages[modelKey][messageIndex] = {
          ...existingMessage,
          text:
            existingMessage.text === "Thinking..."
              ? message.chunk
              : existingMessage.text + message.chunk,
          isThinking: true,
        };
      } else {
        state.messages[modelKey].push({
          id: message.message_id,
          text: message.chunk,
          isUser: false,
          isThinking: true,
          timestamp: new Date(),
          sessionId: message.session_id || state.currentSessionId,
        });
        state.pendingThinkingMessages[modelKey] = message.message_id;
      }
      updateSession(message.session_id);
    }
  } else if (message.type === "message_complete") {
    const modelKey = message.model;
    if (state.messages[modelKey]) {
      const messageIndex = state.messages[modelKey].findIndex(
        (msg) => msg.id === message.message_id
      );
      if (messageIndex !== -1) {
        state.messages[modelKey][messageIndex].isThinking = false;
        delete state.pendingThinkingMessages[modelKey];
      }
      emit("history-updated", message.session_id || state.currentSessionId);
    }
  } else if (message.type === "error") {
    handleErrorResponse(message.model, message.message);
  }
};

const handleErrorResponse = (modelKey, errorText) => {
  if (!isMounted.value) return;
  console.error("Error received from server:", errorText);
  const targetModels = modelKey ? [modelKey] : Object.keys(state.messages);
  targetModels.forEach((key) => {
    if (state.messages[key]) {
      state.messages[key] = state.messages[key].filter(
        (msg) => !msg.isThinking
      );
      state.messages[key].push({
        id: generateMessageId("error"),
        text: errorText || "The system is busy, please try again later.",
        isUser: false,
        isThinking: false,
        timestamp: new Date(),
        sessionId: state.currentSessionId,
      });
      delete state.pendingThinkingMessages[key];
    }
  });
};

const updateSession = (sessionId) => {
  if (!isMounted.value) return;
  if (
    sessionId &&
    sessionId !== state.currentSessionId &&
    sessionId !== "new"
  ) {
    state.currentSessionId = sessionId;
    emit("update-session", state.currentSessionId);
    emit("history-updated", state.currentSessionId);
  }
};

const connectWebSocket = () => {
  if (!isMounted.value) return;
  if (state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    handleErrorResponse(
      null,
      "Unable to connect to server after multiple attempts"
    );
    return;
  }
  const chatSocket = new WebSocket(WS_URL);
  chatSocket.onopen = () => {
    if (!isMounted.value) return;
    wsReady.value = true;
    state.reconnectAttempts = 0;
    state.pingInterval = setInterval(() => {
      if (chatSocket.readyState === WebSocket.OPEN)
        chatSocket.send(JSON.stringify({ type: "ping" }));
    }, PING_INTERVAL);
  };
  chatSocket.onmessage = (event) => {
    if (!isMounted.value) return;
    try {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    } catch (e) {
      console.error("Failed to parse WebSocket message:", e);
    }
  };
  chatSocket.onerror = () => {
    if (!isMounted.value) return;
    wsReady.value = false;
  };
  chatSocket.onclose = (event) => {
    if (!isMounted.value) return;
    wsReady.value = false;
    if (state.pingInterval) clearInterval(state.pingInterval);
    if (event.code !== 1000) retryWebSocketConnection();
  };
  state.chatSocket = chatSocket;
};

const retryWebSocketConnection = () => {
  if (!isMounted.value) return;
  state.reconnectAttempts++;
  const delay = Math.min(2000 * Math.pow(2, state.reconnectAttempts), 10000);
  setTimeout(connectWebSocket, delay);
};

const fetchNewSessionId = async () => {
  try {
    const response = await fetch(
      "https://abdul.synthetixor.com/api/get-new-session-id",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${useCookie("token")?.value}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to get new session ID");
    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error("Error fetching new session ID:", error);
    throw error;
  }
};

const sendMessage = async (
  text,
  imageUrls = props.textImageUrls,
  sessionId = state.currentSessionId
) => {
  if (!isMounted.value) return;
  if (!text?.trim() && !imageUrls.length) {
    console.warn("Cannot send message: No text or images");
    return;
  }
  console.log("sendMessage: Received", { text, imageUrls, sessionId });

  let sessionIdToUse =
    sessionId && sessionId !== "new" ? sessionId : state.currentSessionId;
  if (!sessionIdToUse) {
    try {
      sessionIdToUse = await fetchNewSessionId();
      state.currentSessionId = sessionIdToUse;
      emit("update-session", state.currentSessionId);
    } catch (error) {
      handleErrorResponse(
        null,
        "Failed to start new chat session. Please try again."
      );
      return;
    }
  }

  if (!wsReady.value || state.chatSocket.readyState !== WebSocket.OPEN) {
    connectWebSocket();
    await waitForWebSocket();
    if (!wsReady.value) {
      handleErrorResponse(null, "Unable to connect to server");
      return;
    }
  }

  sendToModels(text || "Describe these images.", imageUrls, sessionIdToUse);

  emit("update-session", sessionIdToUse);
  emit("history-updated", sessionIdToUse);
  emit("message-sent");
};

const sendToModels = (text, imageUrls, sessionId) => {
  if (!isMounted.value) return;

  props.selectedModels.forEach((model) => {
    if (!state.messages[model.model_key]) state.messages[model.model_key] = [];
    const userMessage = {
      id: generateMessageId("user"),
      text: text || "Describe these images.",
      images: imageUrls.length > 0 ? imageUrls : [],
      isUser: true,
      timestamp: new Date(),
      sessionId: sessionId,
    };
    state.messages[model.model_key].push(userMessage);

    const thinkingId = generateMessageId("thinking");
    state.messages[model.model_key].push({
      id: thinkingId,
      text: "Thinking...",
      isUser: false,
      isThinking: true,
      timestamp: new Date(),
      sessionId: sessionId,
    });
    state.pendingThinkingMessages[model.model_key] = thinkingId;
  });

  if (!state.chatSocket || state.chatSocket.readyState !== WebSocket.OPEN) {
    props.selectedModels.forEach((model) => {
      state.messages[model.model_key].push({
        id: generateMessageId("error"),
        text: "The system is busy, please try again later.",
        isUser: false,
        isThinking: false,
        timestamp: new Date(),
        sessionId: sessionId,
      });
    });
    return;
  }

  const messageContent = [];
  if (text) {
    messageContent.push({
      type: "text",
      text: text || "Describe these images.",
    });
  }
  if (imageUrls.length > 0) {
    imageUrls.forEach((url) => {
      messageContent.push({ type: "image_url", image_url: { url } });
    });
  }

  const messages = [{ role: "user", content: messageContent }];

  const userId =
    props.userId && props.userId !== "anonymous"
      ? props.userId
      : "anonymous_user_" + Date.now();

  const payload = {
    messages,
    models: props.selectedModels.map((model) => model.model_key),
    user_id: userId,
    session_id: sessionId,
    is_multi: true,
    type: "default",
  };
  console.log("sendToModels: Sending WebSocket payload", payload);
  state.chatSocket.send(JSON.stringify(payload));
};

const waitForWebSocket = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (wsReady.value || !isMounted.value) {
        clearInterval(interval);
        resolve(true);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      resolve(false);
    }, 10000);
  });
};

const baseUrl = "https://abdul.synthetixor.com/api";

const loadHistory = async (sessionId) => {
  if (!isMounted.value) return;
  try {
    const response = await check_message(sessionId);
    console.log("loadHistory: Server response", response);
    if (response.status === 200) {
      state.currentSessionId = sessionId;
      state.messages = {};

      response.data.forEach((msg) => {
        const modelKey = msg.model;
        if (!state.messages[modelKey]) state.messages[modelKey] = [];

        if (msg.question) {
          state.messages[modelKey].push({
            id: `${msg.id}-user`,
            text: msg.question || "",
            images: msg.images ? JSON.parse(msg.images) : [],
            isUser: true,
            timestamp: new Date(msg.created_at),
            sessionId: msg.session_id,
            isHistory: true,
          });
        }

        if (msg.message) {
          state.messages[modelKey].push({
            id: `${msg.id}-ai`,
            text: msg.message,
            isUser: false,
            timestamp: new Date(msg.created_at),
            sessionId: msg.session_id,
            isHistory: true,
            isThinking: false,
          });
        }
      });

      props.selectedModels.forEach((model) => {
        if (!state.messages[model.model_key])
          state.messages[model.model_key] = [];
      });

      isReady.value = true;
      await nextTick();
      emit("update-session", state.currentSessionId);
      emit("history-updated", state.currentSessionId);
    } else {
      throw new Error("Failed to load history");
    }
  } catch (error) {
    console.error("Error loading history:", error);
    isReady.value = true;
  }
};

const check_message = async (sessionId) => {
  const response = await fetch(`${baseUrl}/check_message`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${useCookie("token")?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
};

const handleFeedback = async (data) => {
  if (!isMounted.value) return;
  try {
    const reportData = {
      reportable_id: data.reportableId,
      reportable_type: data.reportableType || "Message",
      ai_function: data.aiFunction || "text",
      user_id: props.userId || null,
      report_type: data.type,
      issue_category: data.issueType || null,
      reason: data.text || "No reason provided",
    };
    const response = await submitMessageReport(reportData);
    if (response.success) alert("Feedback submitted successfully");
    else throw new Error("Failed to submit feedback");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Failed to submit feedback: " + error.message);
  }
};

onMounted(async () => {
  isMounted.value = true;
  if (!validateModels(props.selectedModels)) return;
  initializeMessages(props.selectedModels);
  if (props.initialSessionId && props.initialSessionId !== "new") {
    await loadHistory(props.initialSessionId);
  } else {
    isReady.value = true;
  }
  await nextTick();
  connectWebSocket();
});

onBeforeUnmount(() => {
  isMounted.value = false;
  if (state.chatSocket?.readyState === WebSocket.OPEN) {
    state.chatSocket.close(1000, "Component unmounted");
  }
  if (state.pingInterval) clearInterval(state.pingInterval);
});

watch(
  () => props.selectedModels,
  (newModels) => {
    if (!isMounted.value) return;
    if (!validateModels(newModels)) return;
    initializeMessages(newModels);
  },
  { deep: true }
);

const setFocusedModel = (modelKey) => {
  if (!isMounted.value) return;
  focusedModel.value = modelKey;
};

const clearFocusedModel = () => {
  if (!isMounted.value) return;
  focusedModel.value = null;
};

const toggleSpeak = (text) => {
  if (!isMounted.value) return;
  emit("toggle-speak", text);
};

const refreshAnswer = (question) => {
  if (!isMounted.value) return;
  emit("refresh-answer", question);
};

const exportWord = (text) => {
  if (!isMounted.value) return;
  emit("export-word", text);
};

const exportPdf = (text) => {
  if (!isMounted.value) return;
  emit("export-pdf", text);
};

const deleteMessage = (messageId) => {
  if (!isMounted.value) return;
  emit("delete-message", messageId);
};

defineExpose({ sendMessage, loadHistory });
</script>

<style scoped>
.grid > div {
  @apply border border-gray-200 rounded-md;
}

.hidden {
  @apply opacity-0 pointer-events-none absolute;
}

.grid {
  @apply w-full h-full;
}
</style>
