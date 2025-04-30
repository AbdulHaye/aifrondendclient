// ~/utils/request.ts
import { $fetch } from "ofetch";
import { Message } from "@arco-design/web-vue";

// Base URL (can be overridden by runtimeConfig in Nuxt)
const BASE_URL = "https://abdul.synthetixor.com/api/";

// Helper function to get headers with token
const getHeaders = () => {
  const token = useCookie("token"); // Access token from cookie
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token.value) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }
  return headers;
};

// Generic API fetch function
export const apiFetch = async (
  url: string,
  options: any = {}
): Promise<any> => {
  const reqUrl = `${BASE_URL}${url}`;
  try {
    const response = await $fetch(reqUrl, {
      method: options.method || "POST", // Default to POST if not specified
      headers: getHeaders(),
      body: options.params ? JSON.stringify(options.params) : undefined, // Use params for body
      ...options,
    });

    // Check response status
    if (response.status !== 200 && response.status !== 201) {
      Message.error(response.message || "Request failed");
      throw new Error(response.message);
    }
    return response; // Return the raw response data
  } catch (error: any) {
    // Handle specific error cases
    if (error.data?.message === "检测到多端登录，请重新登录") {
      const token = useCookie("token");
      token.value = null; // Clear token
      const router = useRouter();
      router.push("/login");
    } else {
      Message.error(error.data?.message || "Network error occurred");
    }
    throw error; // Re-throw for caller to handle
  }
};
