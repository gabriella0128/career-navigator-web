import { defineNuxtPlugin } from '#app';
import { useNuxtApp } from '#app';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = useNuxtApp().$pinia;
  pinia.use(piniaPluginPersistedState);
});
