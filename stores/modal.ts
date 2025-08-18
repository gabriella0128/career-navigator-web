import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ModalInstance } from '~/types/modal';

/**
 *    모달 정보 관리용 store
 */
export const useModalStore = defineStore('modal', () => {
  const modalStack = ref<ModalInstance[]>([]);
  const baseZIndex = 1000;

  const openModal = (modal: ModalInstance) => {
    modalStack.value = modalStack.value.filter((m) => m.id !== modal.id);
    modalStack.value.push({ ...modal, isOpen: true });
  };

  const clearModal = (id: string) => {
    modalStack.value = modalStack.value.filter((modal) => modal.id !== id);
  };

  const getZIndex = (id: string) => {
    const index = modalStack.value.findIndex((modal) => modal.id === id);
    return baseZIndex + (modalStack.value.length - index);
  };

  const updateModalSubmitField = (
    modalId: string,
    fieldId: string,
    value: string
  ) => {
    const modal = modalStack.value.find((m) => m.id === modalId);
    if (modal) {
      modal.submitFields[fieldId] = value;
    }
  };

  const updateModalHiddenField = (
    modalId: string,
    fieldId: string,
    value: string
  ) => {
    const modal = modalStack.value.find((m) => m.id === modalId);
    if (modal) {
      modal.hiddenFields[fieldId] = value;
    }
  };

  const resetModalSubmitField = (modalId: string) => {
    const modal = modalStack.value.find((m) => m.id === modalId);
    if (modal) {
      modal.submitFields = {};
    }
  };

  const resetModalHiddenField = (modalId: string) => {
    const modal = modalStack.value.find((m) => m.id === modalId);
    if (modal) {
      modal.hiddenFields = {};
    }
  };

  const retrieveSubmitFieldValue: (
    modalId: string,
    fieldId: string
  ) => string = (modalId, fieldId) => {
    const modal = modalStack.value.find((m) => m.id === modalId);
    const modalFieldValue = modal?.submitFields[fieldId];
    return modalFieldValue ?? '';
  };

  return {
    modalStack,
    openModal,
    clearModal,
    getZIndex,
    updateModalSubmitField,
    updateModalHiddenField,
    resetModalSubmitField,
    resetModalHiddenField,
    retrieveSubmitFieldValue
  };
});
