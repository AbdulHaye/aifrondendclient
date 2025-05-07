import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  telemetry: false,
  ssr: false,
  plugins: ["~/plugins/airwallex.client.ts"],

  app: {
    head: {
      title: "聊天学习交流 - 免费AI问答",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
      link: [{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
      script: [
        {
          src: "https://cdn.dingxiang-inc.com/ctu-group/captcha-ui/v5/index.js",
          crossorigin: "anonymous",
          id: "dx-captcha-script",
        },
        { src: "/config.js" },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  css: [
    "~/assets/css/style.min.css",
    "~/assets/css/main.css",
    "~/assets/css/dark.css",
    "~/assets/css/mobile.css",
  ],

  modules: [
    "@nuxt/devtools",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-icon",
    "nuxt-security",
    "@nuxt/ui",
  ],

  devtools: {
    enabled: false,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.VITE_SERVER_NAME,
    },
  },

  routeRules: {
    "/ai_chat": { ssr: false },
    "/editor/**": { ssr: false },
    "/mark_me": { ssr: false },
  },

  vite: {
    server: {
      allowedHosts: ["0447-119-73-101-111.ngrok-free.app", "*.ngrok-free.app"],
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        "script-src": [
          "'self'",
          "https://cdn.dingxiang-inc.com",
          "https://checkout.airwallex.com",
          "https://static-demo.airwallex.com",
          "https://dlthst9q2beh8.cloudfront.net",
          "https://cdn-scripts.signifyd.com",
          "https://imgs.signifyd.com",
          "https://aac5fb818cb3.cdn4.forter.com",
          "https://static-demo.airwallex.com/cdn-cgi/challenge-platform/",
          "https://static-demo.airwallex.com/cdn-cgi/challenge-platform/h/b/scripts/jsd/", // Add this for Cloudflare challenge scripts
          "https://h64.online-metrix.net",
          "https://*.airwallex.com",
          "https://*.cloudfront.net",
          "https://vercel.live",
          "'unsafe-inline'", // Allow inline scripts (required for some Airwallex functionality)
          "'unsafe-eval'", // May be needed for some third-party scripts (optional, test without first)
        ],
        "script-src-elem": [
          "'self'",
          "https://cdn.dingxiang-inc.com",
          "https://checkout.airwallex.com",
          "https://static-demo.airwallex.com",
          "https://dlthst9q2beh8.cloudfront.net",
          "https://cdn-scripts.signifyd.com",
          "https://imgs.signifyd.com",
          "https://aac5fb818cb3.cdn4.forter.com",
          "https://static-demo.airwallex.com/cdn-cgi/challenge-platform/",
          "https://static-demo.airwallex.com/cdn-cgi/challenge-platform/h/b/scripts/jsd/", // Add this for Cloudflare challenge scripts
          "https://h64.online-metrix.net",
          "https://*.airwallex.com",
          "https://*.cloudfront.net",
          "https://vercel.live",
          "'unsafe-inline'", // Allow inline scripts
        ],
        "frame-src": [
          "'self'",
          "https://*.airwallex.com",
          "https://imgs.signifyd.com",
          "https://h.online-metrix.net",
          "https://static-demo.airwallex.com", // Add for Airwallex iframes
        ],
        "connect-src": [
          "'self'",
          "https://*.airwallex.com",
          "https://pci-api-demo.airwallex.com",
          "http://localhost:3000",
          "https://abdul.synthetixor.com/api/",
          "https://api.iconify.design",
          "https://*.signifyd.com",
          "https://*.forter.com",
          "https://*.cloudflare.com",
          "https://*.cloudfront.net",
          "wss://*.airwallex.com",
          "wss://*.cloudfront.net",
          "wss://abdul.synthetixor.com:6001",
          "wss://abdul.synthetixor.com/ws",
          "https://static-demo.airwallex.com", // Add for Airwallex connections
        ],
        "worker-src": [
          "'self'",
          "blob:", // Allow blob workers (required for Airwallex)
          "https://static-demo.airwallex.com",
          "https://*.airwallex.com",
        ],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https://imgs.signifyd.com", "*"],
      },
      permissionsPolicy: {
        microphone: ["'self'"], // Allow microphone for the current origin
      },
    },
  },
  

  compatibilityDate: "2024-08-15",
  experimental: {
    extraPageMetaExtractionKeys: [],
  },
});
