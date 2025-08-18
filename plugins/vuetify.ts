import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/assets/scss/index.scss";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  app.vueApp.use(vuetify);
});
