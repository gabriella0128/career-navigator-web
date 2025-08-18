<script setup lang="ts">
import { computed } from "vue";
import { useModalStore } from "~/stores/modal";
import type { ModalButton } from "~/types/modal";

/**
 *    메시지만 표시하는 모달
 */
const modalStore = useModalStore();
const { clearModal, getZIndex } = modalStore;

interface Props {
  id: string; // 모달 고유 아이디
  title: string; // 모달 제목
  message: string; // 모달 메시지
  buttons: ModalButton[]; // 모달 버튼
  hiddenFields?: Record<string, string>; // 모달 숨김 필드
  modalIconUrl?: string;
  onClose?: () => void;
}

const props = defineProps<Props>();

const currentModal = computed(() => {
  return modalStore.modalStack.find((modal) => modal.id === props.id);
});

const isOpen = computed({
  get() {
    return currentModal.value?.isOpen || false;
  },
  set(newValue) {
    if (!newValue) {
      clearModal(props.id);
      if (props.onClose) {
        props.onClose();
      }
    }
  },
});

const zIndex = computed(() => getZIndex(props.id));

const close = () => {
  clearModal(props.id);
  if (props.onClose) {
    props.onClose();
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" :id="props.id">
    <div class="modal-container">
      <!-- 닫기 버튼 -->
      <div class="modal-header">
        <v-btn class="modal-close" @click="close">
          <v-icon class="mdi mdi-close"></v-icon>
        </v-btn>
      </div>
      <div class="modal-body">
        <!-- 아이콘 -->
        <img
          v-if="props.modalIconUrl"
          :src="props.modalIconUrl"
          alt="Icon"
          class="modal-icon"
        />

        <!-- 텍스트 -->
        <div class="modal-message" v-html="props.message"></div>

        <!-- 액션 버튼들 -->
        <div class="modal-actions">
          <v-btn
            v-for="(btn, idx) in props.buttons"
            :key="idx"
            class="modal-action-button"
            :class="btn.class"
            @click="btn.onClick"
          >
            {{ btn.label }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
