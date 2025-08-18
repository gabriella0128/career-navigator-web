import { defineAsyncComponent, h } from "vue";
import { useModalStore } from "~/stores/modal";
import type {
  ModalField,
  ModalButton,
  VerificationOptions,
  ModalType,
  ModalRenderInstance,
} from "~/types/modal";

const modals = ref<VNode[]>([]);
const modalInstances = ref<ModalRenderInstance[]>([]);

/**
 *    모달을 사용할 때 사용하는 함수
 */
export function useModal() {
  const modalStore = useModalStore();
  // 배경 스크롤 비활성화
  let scrollPos = 0;
  const disableBodyScroll = () => {
    scrollPos = window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPos}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };
  const enableBodyScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPos);
  };
  /**
   *  모달을 띄우는 method
   */
  const showModal = (options: {
    id: string;
    category?: string;
    component: ModalType;
    title: string;
    message?: string;
    fields?: ModalField[];
    submitFields?: Record<string, string>;
    hiddenFields?: Record<string, string>;
    buttons?: ModalButton[];
    modalIconUrl?: string;
    verificationOptions?: VerificationOptions;
    data?: string | null;
    onFunction?: () => void;
    onClose?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFunctionParam?: (param: any) => any;
    persistent?: boolean;
  }) => {
    modalInstances.value = modalInstances.value.filter(
      (modal) => modal.props.id !== options.id
    );

    const asyncComponent = markRaw(
      defineAsyncComponent(() => {
        if (options.category && options.category != "") {
          return import(
            `~/components/modal/${options.category}/${options.component}.vue`
          );
        } else {
          return import(`~/components/modal/${options.component}.vue`);
        }
      })
    );
    modalStore.openModal({
      id: options.id,
      isOpen: true,
      component: options.component,
      title: options.title,
      fields: options.fields || [],
      buttons: options.buttons || [],
      modalIconUrl: options.modalIconUrl || "",
      submitFields: options.submitFields || {},
      hiddenFields: options.hiddenFields || {},
      verificationOptions: options.verificationOptions || { duration: 60 },
      data: options.data || null,
    });

    modalInstances.value.push({
      component: asyncComponent,
      props: {
        id: options.id,
        title: options.title,
        message: options.message || "",
        fields: options.fields || [],
        buttons: options.buttons || [],
        modalIconUrl: options.modalIconUrl || "",
        verificationOptions: options.verificationOptions || { duration: 60 },
        data: options.data,
        onFunction: options.onFunction,
        onClose: (() => {
          if (options.onClose) {
            return options.onClose;
          }
          return () => hideModal(options.id);
        })(),
        onFunctionParam: options.onFunctionParam,
        persistent: options.persistent || false,
      },
    });

    modals.value = renderModal();
    disableBodyScroll();
  };

  /**
   *  모달을 내리는 method
   */
  const hideModal = (id: string) => {
    modalStore.clearModal(id);
    modalInstances.value = modalInstances.value.filter(
      (modal) => modal.props.id !== id
    );
    modals.value = renderModal();
    if (modalInstances.value.length === 0) {
      enableBodyScroll();
    }
  };
  /**
   *  모달 간 이동하는 method
   */
  const switchModal = async (options: {
    prevId: string;
    id: string;
    category?: string;
    component: ModalType;
    message?: string;
    title: string;
    fields?: ModalField[];
    submitFields?: Record<string, string>;
    hiddenFields?: Record<string, string>;
    buttons?: ModalButton[];
    modalIconUrl: string;
    verificationOptions?: VerificationOptions;
    data: string | null;
  }) => {
    hideModal(options.prevId);
    const { prevId, ...newOptions } = options;
    setTimeout(() => {
      showModal(newOptions);
    }, 300);
  };

  const renderModal = () => {
    return modalInstances.value.map((modal) => {
      const baseZIndex = modalStore.getZIndex(modal.props.id) || 1000;
      return h(modal.component, {
        ...modal.props,
        hideOverlay: false,
        style: { baseZIndex },
      });
    });
  };

  const resetModal = () => {
    modalInstances.value.forEach((modal) => hideModal(modal.props.id));
  };

  return {
    showModal,
    hideModal,
    switchModal,
    renderModal,
    resetModal,
    modals,
  };
}
