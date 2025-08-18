<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useModal } from "#imports";

const drawer = ref(false);
const { modals } = useModal();

import { storeToRefs, useHandleApi, useUserStore } from "#imports";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const retrieveUser = () => userStore.retrieveUser();

onMounted(async () => {
  await useHandleApi(retrieveUser());
});
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      width="256"
      class="app-drawer"
    >
      <v-list>
        <v-list-item href="/" class="user-item">
          <a href="/"></a>
          <!-- avatar 슬롯에 이미지 넣기 -->
          <template #prepend>
            <v-avatar size="40" class="user-avatar">
              <img src="/images/icons/home-circle.png" alt="User Icon" />
            </v-avatar>
          </template>

          <v-list-item-title>{{ userInfo.userName }}</v-list-item-title>
          <v-list-item-subtitle>{{ userInfo.userEmail }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list nav density="comfortable">
        <v-list-item link class="app-drawer-item">
          <a href="/resume">
            <v-list-item-title
              ><v-icon class="mdi mdi-file-document-outline"></v-icon>

              RESUME</v-list-item-title
            >
          </a>
        </v-list-item>
        <v-list-item link class="app-drawer-item">
          <a href="/interview">
            <v-list-item-title
              ><v-icon class="mdi mdi-comment-question-outline"></v-icon>

              INTERVIEW</v-list-item-title
            ></a
          >
        </v-list-item>

        <v-list-item link class="app-drawer-item">
          <a href="/learning">
            <v-list-item-title
              ><v-icon class="mdi mdi-pen-plus"></v-icon>

              LEARNING</v-list-item-title
            ></a
          >
        </v-list-item>
        <!--
        <v-list-item link class="app-drawer-item">
          <a href="/timeline">
            <v-list-item-title
              ><v-icon class="mdi mdi-timeline-clock-outline"></v-icon>

              TIMELINE</v-list-item-title
            ></a
          >
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="app-bar">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="app-bar-icon" />
      </template>
      <v-toolbar-title class="app-bar-title">Career Navigator </v-toolbar-title>
    </v-app-bar>

    <v-main class="app-main">
      <div class="app-content">
        <slot />
      </div>
    </v-main>

    <v-footer app class="app-footer">
      <div>&copy; 2025 Career Navigator</div>
    </v-footer>
  </v-app>
  <component
    v-for="(modalVNode, index) in modals"
    :is="modalVNode"
    :key="index"
  />
</template>
