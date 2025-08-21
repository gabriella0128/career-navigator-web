<script setup lang="ts">
import ValidationInput from "@/components/common/input/ValidationInput.vue";
import { useRouter } from "vue-router";
import { useModal } from "#imports";
import { useSignupStore } from "#imports";
import { storeToRefs } from "pinia";
import { computed } from "#imports";
import { useHandleApi } from "#imports";
import { ref } from "#imports";
definePageMeta({
  layout: false,
});
const router = useRouter();
const { modals } = useModal();

const signupStore = useSignupStore();

const {
  updateUserIdCheckIdDuplicationInfo,
  updateConfirmedId,
  isSignupInfoValid,
} = signupStore;

const { signupInfo, validationStatus, confirmedId } = storeToRefs(signupStore);

const checkIdDuplication = signupStore.checkIdDuplication();
const signupUser = () => signupStore.signupUser();

const duplicateIdMessage = ref<string>("중복을 확인해주세요.");

const isDuplicatedId = computed(() => {
  return confirmedId.value ? false : true;
});

const checkUserId: () => void = async () => {
  const userId = signupInfo.value.userId;
  const isValid = validationStatus.value.userId;
  if (!userId) {
    alert("아이디를 입력해주세요.");
    return;
  }
  if (!isValid) {
    alert("아이디 형식을 확인해주세요.");
    return;
  }
  updateUserIdCheckIdDuplicationInfo(signupInfo.value.userId);

  const result = await useHandleApi(checkIdDuplication);
  const isDuplicated = result?.data.isDuplicated;

  if (isDuplicated) {
    duplicateIdMessage.value = "중복된 아이디입니다.";
    updateConfirmedId("");
  } else {
    duplicateIdMessage.value = "사용가능한 아이디입니다.";
    updateConfirmedId(userId);
  }
};
const canSubmit = computed(() => {
  return (
    !!confirmedId.value &&
    signupInfo.value.userId === confirmedId.value &&
    isSignupInfoValid()
  );
});

const handleSignupRequest: () => void = async () => {
  const result = await useHandleApi(signupUser());
  if (result) router.push("/login");
};

const backToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="signup-wrapper">
    <div class="signup-card">
      <!-- 헤더 -->
      <header class="signup-header">
        <h2 class="signup-title">회원가입</h2>
        <div class="signup-underline"></div>
      </header>

      <!-- 폼 전체 -->
      <form class="signup-form">
        <!-- 아이디 + 중복확인 -->
        <div class="form-row form-row--inline">
          <ValidationInput
            class="form-input"
            input-name="userId"
            v-model="signupInfo.userId"
            label="아이디"
            placeholder="영문 소문자·숫자 포함 8–20자"
            :regex="/^[a-z0-9]{8,20}$/"
          />
          <v-btn class="btn btn--check" @click.prevent="checkUserId">
            중복확인
          </v-btn>
        </div>
        <div
          v-if="duplicateIdMessage"
          class="form-alert"
          :class="isDuplicatedId ? 'form-alert--error' : 'form-alert--success'"
        >
          {{ duplicateIdMessage }}
        </div>

        <!-- 비밀번호 -->
        <div class="form-row">
          <ValidationInput
            class="form-input"
            input-name="password"
            v-model="signupInfo.userPasswd"
            type="password"
            label="비밀번호"
            placeholder="대소문자·숫자·특수문자 포함 8–20자"
            :regex="
              /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
            "
          />
        </div>

        <!-- 이름 -->
        <div class="form-row">
          <ValidationInput
            class="form-input"
            input-name="name"
            v-model="signupInfo.userName"
            label="이름"
            placeholder="최소 2글자"
            :regex="/^[a-zA-Z가-힣]{2,}$/"
          />
        </div>

        <!-- 이메일 -->
        <div class="form-row">
          <ValidationInput
            class="form-input"
            input-name="email"
            v-model="signupInfo.userEmail"
            label="이메일"
            placeholder="abc@example.com"
            :regex="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
          />
        </div>

        <!-- 액션 버튼 -->
        <div class="form-actions">
          <v-btn
            class="btn btn--submit"
            :disabled="!canSubmit"
            @click.prevent="handleSignupRequest"
          >
            가입하기
          </v-btn>
          <v-btn class="btn btn--cancel" @click.prevent="backToLogin">
            취소
          </v-btn>
        </div>
      </form>
    </div>
  </div>
  <component
    v-for="(modalVNode, index) in modals"
    :is="modalVNode"
    :key="index"
  />
</template>
