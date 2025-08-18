<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useAuth } from "~/composables/useAuth";
import { useModal } from "~/composables/useModal";
import { storeToRefs, useHandleApi } from "#imports";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const router = useRouter();
const { modals } = useModal();
const { loginInfo } = storeToRefs(authStore);
const { showModal, hideModal } = useModal();

const login = () => authStore.loginUser();
const handleLoginRequest: () => void = async () => {
  if (!loginInfo.value.userId || !loginInfo.value.userPasswd) {
    showModal({
      id: "msg-modal",
      component: "MessageModal",
      category: "common",
      title: "필수값 누락",
      message: "아이디와 패스워드를 입력해주세요.",
      buttons: [
        {
          id: "completed",
          label: "확인",
          class: "btn-blue",
          onClick: () => hideModal("msg-modal"),
        },
      ],
      onClose: () => hideModal("msg-modal"),
    });
    return;
  }
  const result = await useHandleApi(login());
  if (!result) return;
  useAuth().setToken(result.data.accessToken);
  router.push("/");
};

const moveToSignup: () => void = () => {
  router.push("/signup");
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-logo">
        <img src="/images/icons/career-navigator-logo.png" alt="User Icon" />
      </div>
      <div class="login-title">Career Navigator</div>
      <div class="login-form">
        <v-text-field
          v-model="loginInfo.userId"
          type="text"
          placeholder="아이디"
          class="login-input"
        />
        <v-text-field
          v-model="loginInfo.userPasswd"
          type="password"
          placeholder="비밀번호"
          class="login-input"
        />
        <v-btn
          class="login-button"
          @click="handleLoginRequest"
          @keyup.enter="handleLoginRequest"
        >
          로그인
        </v-btn>
      </div>
      <hr class="divider" />
      <v-btn class="signup-button" @click="moveToSignup"> 회원가입 </v-btn>
    </div>
    <component
      v-for="(modalVNode, index) in modals"
      :is="modalVNode"
      :key="index"
    />
  </div>
</template>
