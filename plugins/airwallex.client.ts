export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) return {};

  const loadAirwallexScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Airwallex) {
        console.log("Airwallex SDK already loaded");
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://checkout.airwallex.com/assets/elements.bundle.min.js";
      script.async = true;
      script.onload = () => {
        console.log("Airwallex SDK loaded via plugin");
        resolve(true);
      };
      script.onerror = () => reject(new Error("Failed to load Airwallex SDK"));
      document.head.appendChild(script);
    });
  };

  const initializeAirwallex = async () => {
    try {
      await loadAirwallexScript();
      if (!window.Airwallex) {
        throw new Error("Airwallex SDK not available after loading script");
      }
      // const env =
      //   process.env.NODE_ENV === "production" ? "production" : "demo";
      // For testing, hardcode to 'demo'
      const env = "demo";
      const config = {
        env,
        origin: window.location.origin,
      };
      window.Airwallex.init(config);
      console.log("Airwallex initialized with config:", config);
      return window.Airwallex;
    } catch (error) {
      console.error("Airwallex initialization failed:", error);
      throw error;
    }
  };

  try {
    const airwallexInstance = await initializeAirwallex();
    return { provide: { airwallex: airwallexInstance } };
  } catch (error) {
    console.warn(
      "Airwallex not provided due to initialization failure:",
      error
    );
    return { provide: { airwallex: null } };
  }
});
