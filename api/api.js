import axios from "axios";

const API_BASE_URL = "https://abdul.synthetixor.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Fetch all AI models
 * @returns {Promise<Object>} { data: Array, success: boolean }
 */
export const fetchModels = async () => {
  try {
    const response = await apiClient.get("/api/ai_models");
    console.log("Fetched models:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error.message);
    return { data: [], success: false };
  }
};

/**
 * Fetch enabled AI models
 * @returns {Promise<Object>} { data: Array, success: boolean }
 */
export const fetchEnabledModels = async () => {
  try {
    const response = await apiClient.get("/api/ai_models");
    return response.data;
  } catch (error) {
    console.error("Error fetching enabled models:", error.message);
    return { data: [], success: false };
  }
};

/**
 * Fetch model settings mode
 * @returns {Promise<string|Array>} Mode value(s) or default "default"
 */
export const fetchModelSettingsMode = async () => {
  try {
    const response = await apiClient.get("/api/modelsettings/mode");
    const modes = response.data.data;
    console.log("Fetched model settings mode:", modes);
    return modes.length > 0 ? modes : "manual";
  } catch (error) {
    console.error("Error fetching model settings mode:", error.message);
    return "default";
  }
};

/**
 * Submit a report to the reports table
 * @param {Object} reportData - Data to submit (message_id, user_id, reason, report_type, issue_category)
 * @returns {Promise<Object>} { success: boolean, report_id: number }
 */
export const submitReport = async (reportData) => {
  try {
    const response = await apiClient.post("/api/reports", reportData);
    console.log("Report submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting report:", error.message);
    throw error;
  }
};

export const submitMessageReport = async (reportData) => {
  try {
    const response = await apiClient.post("/api/reports", reportData);
    console.log("Message report submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting message report:", error.message);
    throw error;
  }
};

// Add file processing methods
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/process-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const processFileContent = async (fileId) => {
  try {
    const response = await apiClient.post(`/process-file/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("File processing failed:", error);
    throw error;
  }
};
