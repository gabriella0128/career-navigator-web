export type ModalType =
  | "InputModal"
  | "VerificationModal"
  | "MessageModal"
  | "ResumeModal"
  | "LoadingModal"
  | "InterviewModal";

export interface ModalField {
  id: string; // 입력 필드의 아이디
  label: string; // 입력 필드의 라벨
  type: string; // 입력 필드의 타입
  defaultValue?: string; // 기본값 (선택사항)
  placeholder?: string; // 입력값 힌트 (선택사항)
  regex?: RegExp; // 정규식 (선택사항)
}

export interface ModalButton {
  id: string; // 버튼의 아이디
  label: string; // 라벨 이름
  class?: string; // 버튼 클래스명 (선택사항)
  onClick: () => void; // 버튼 클릭 시 실행 함수
  disabled?: boolean; // 버튼 활성화/비활성화 속성 (선택사항)
}

export interface VerificationOptions {
  duration: number; // 카운트 다운 지속 시간 (초)
  onTimeout?: () => void; // 타임아웃 시 실행 함수 (선택사항)
}

export interface ModalRenderInstance {
  component: string | Component;
  props: {
    id: string;
    title: string;
    message?: string;
    fields: ModalField[];
    buttons: ModalButton[];
    modalIconUrl: string;
    verificationOptions: VerificationOptions;
    data?: string | null;
    onFunction?: () => void;
    onFunctionParam?: (param: unknown) => unknown;
    onClose: () => void;
    persistent?: boolean;
  };
}

export interface ModalInstance {
  id: string;
  isOpen: boolean;
  component: ModalType;
  title: string;
  fields: ModalField[];
  buttons: ModalButton[];
  modalIconUrl: string;
  submitFields: Record<string, string>;
  hiddenFields: Record<string, string>;
  verificationOptions: VerificationOptions;
  data: string | null;
}
