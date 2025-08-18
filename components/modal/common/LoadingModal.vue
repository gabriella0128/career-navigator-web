<script setup lang="ts">
import { computed } from "vue";
import { useModalStore } from "~/stores/modal";
import Spinner from "../../../components/common/modal/Spinner.vue";

const modalStore = useModalStore();
const { clearModal } = modalStore;

const props = defineProps<{
  id: string; // 모달 고유 아이디
  title?: string; // 모달 제목
  message?: string; // 모달 메시지
  persistent?: boolean;
}>();

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
    }
  },
});
</script>

<template>
  <v-dialog
    v-model="isOpen"
    :persistent="props.persistent ?? true"
    max-width="200px"
  >
    <v-card class="d-flex justify-center align-center pa-5">
      <Spinner />
    </v-card>
  </v-dialog>
</template>
