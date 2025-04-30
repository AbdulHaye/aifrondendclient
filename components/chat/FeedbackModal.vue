<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div
      class="bg-white text-gray-900 p-6 rounded-xl shadow-2xl w-96 border border-gray-200"
    >
      <div class="flex items-center gap-3 mb-5">
        <div class="p-2 rounded-lg bg-gray-100">
          <svg
            v-if="feedbackType === 'positive'"
            class="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">
          {{ feedbackType === "positive" ? "Positive Feedback" : "Report Issue" }}
        </h2>
      </div>

      <div class="space-y-4">
        <div v-if="feedbackType === 'positive'">
          <textarea
            v-model="feedbackText"
            class="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder-gray-400 text-sm transition-all"
            rows="4"
            placeholder="What was satisfying about this response?"
          ></textarea>
        </div>

        <div v-else-if="feedbackType === 'negative'" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-2"
              >Issue type (optional)</label
            >
            <select
              v-model="issueType"
              class="w-full p-2.5 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-sm appearance-none"
            >
              <option value="" disabled selected>Select issue type...</option>
              <option value="quality">Quality issue</option>
              <option value="accuracy">Inaccurate information</option>
              <option value="offensive">Offensive content</option>
              <option value="performance">Performance issue</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-2"
              >Details (optional)</label
            >
            <textarea
              v-model="feedbackText"
              class="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 placeholder-gray-400 text-sm"
              rows="4"
              placeholder="What was unsatisfying about this response?"
            ></textarea>
          </div>

          <p class="text-xs text-gray-500 leading-relaxed">
            Submitting this report will send the conversation to the support team.
            <a href="#" class="text-blue-500 hover:text-blue-600 underline"
              >Learn More →</a
            >
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          @click="submitFeedback"
          class="px-4 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "FeedbackModal",
  props: {
    isOpen: { type: Boolean, required: true },
    feedbackType: { type: String, required: true },
    messageId: { type: [String, Number], default: null },
    modelKey: { type: String, required: true },
  },
  setup(props, { emit }) {
    const feedbackText = ref("");
    const issueType = ref("");

    const closeModal = () => {
      feedbackText.value = "";
      issueType.value = "";
      emit("close");
    };

    const submitFeedback = () => {
      emit("submit", {
        type: props.feedbackType,
        text: feedbackText.value,
        issueType: props.feedbackType === "negative" ? issueType.value : null,
      });
      closeModal();
    };

    return { feedbackText, issueType, closeModal, submitFeedback };
  },
};
</script>