<script setup lang="ts">
import { computed } from "vue";
import { useModalStore } from "#imports";
import type { ModalButton } from "~/types/modal";

const modalStore = useModalStore();
const { clearModal } = modalStore;

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

const close = () => {
  clearModal(props.id);
  if (props.onClose) {
    props.onClose();
  }
};

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
</script>
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <!-- 닫기 버튼 -->
      <div class="modal-header">
        <v-btn class="modal-close" @click="close">
          <v-icon class="mdi mdi-close"></v-icon>
        </v-btn>
      </div>
      <div class="modal-body">
        <ResumeModalList :id="props.id" />
      </div>
    </div>
  </div>
</template>
