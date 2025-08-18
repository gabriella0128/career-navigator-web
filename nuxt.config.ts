// https://nuxt.com/docs/api/configuration/nuxt-config
import { loadEnv } from "vite";

const envName = process.argv[process.argv.indexOf("--mode") + 1];
const envData = loadEnv(envName, "env");

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  app: {
    baseURL: envData.VITE_CONTEXT_PT,
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      ],
    },
  },
  runtimeConfig: {
    public: envData,
  },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "@/assets/scss/index.scss",
    "swiper/css",
    "swiper/css/navigation",
    "swiper/css/pagination",
  ],

  build: {
    transpile: ["vuetify", "swiper"],
  },
  vite: {
    envDir: "~/env",
  },
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  ssr: false,
});
