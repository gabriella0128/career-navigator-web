<script setup lang="ts">
import { ResumeModalRegister } from "#components";
import { computed } from "vue";
import { useModalStore, useResumeStore, storeToRefs } from "#imports";
import type { ModalButton } from "~/types/modal";
const resumeStore = useResumeStore();
const modalStore = useModalStore();
const { clearModal } = modalStore;

const { modalMode } = storeToRefs(resumeStore);

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
        <ResumeModalRegister v-if="modalMode === 'register'" :id="props.id" />
        <ResumeModalUpdate v-if="modalMode === 'update'" :id="props.id" />
      </div>
    </div>
  </div>
</template>
