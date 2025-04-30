import { Message } from "@arco-design/web-vue";

const fetch = (url: string, options?: any): Promise<any> => {
  const token = useCookie("token");

  // console.log("Token:", token.value);
  const headers = {
    Authorization: `Bearer ${token.value}`,
  };

  // Use VITE_SERVER_NAME from environment variables
  const baseUrl = "https://abdul.synthetixor.com/api/";
  const reqUrl = `${baseUrl}${url}`; // Construct the full URL
  // console.log(baseUrl);
  return new Promise(async (resolve, reject) => {
    useFetch(reqUrl, {
      ...options,
      headers,
      onResponseError({ response }) {
        console.error("Server Error:", response._data); // Log detailed error
      },
    })
      .then(({ data, error }: any) => {
        if (error.value) {
          // Handle errors gracefully
          if (error.value.data?.message === "检测到多端登录，请重新登录") {
            const token = useCookie("token");
            token.value = "";
            let router = useRouter();
            router.push("/login");
          }
          error.value &&
            Message.error(error.value.data?.message || "Request failed");
          reject(error.value);
          return;
        }

        const value = data.value;
        if (!data._rawValue) {
          // Handle case where _rawValue is null or undefined
          Message.error("No data received from server");
          reject(new Error("No data received"));
        } else if (data._rawValue.type === "application/pdf") {
          resolve(ref(data));
        } else if (
          data._rawValue.status !== 200 &&
          data._rawValue.status !== 201
        ) {
          Message.error(data._rawValue.message);
          reject(new Error(data._rawValue.message));
        } else {
          resolve(ref(data));
        }
      })
      .catch((err: any) => {
        Message.error("Network error occurred");
        reject(err);
      });
  });
};

export default new (class Http {
  get(url: string, params?: any): Promise<any> {
    return fetch(url, { method: "get", params });
  }

  post(url: string, params?: any): Promise<any> {
    return fetch(url, { method: "post", params });
  }

  put(url: string, body?: any): Promise<any> {
    return fetch(url, { method: "put", body });
  }

  delete(url: string, body?: any): Promise<any> {
    return fetch(url, { method: "delete", body });
  }
})();
