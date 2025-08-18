import type { ApiError, CommonResponse } from "~/types/common";
import { useModal } from "./useModal";
import type { ApiObject } from "~/types/api";

export function useApiResponse<T>(
  customErrorHandler?: (apiResult: ApiObject<T>) => void
) {
  const { showModal, hideModal } = useModal();

  /**
   * 기본 에러 처리 함수
   * @param title 모달 제목
   * @param message 에러 메시지
   */
  const showErrorModal = (title: string, message: string) => {
    showModal({
      id: "error-message-modal",
      component: "MessageModal",
      category: "common",
      title,
      message,
      buttons: [
        {
          id: "confirm",
          label: "확인",
          class: "btn-blue",
          onClick: () => hideModal("error-message-modal"),
        },
      ],
    });
  };

  const handleApiResponse = async (
    apiDesc: string,
    apiResult: ApiObject<T>
  ): Promise<CommonResponse<T> | null> => {
    // API 오류 처리 (네트워크 오류, 서버 오류 등)
    if (apiResult.error.value) {
      if (apiResult.error.value.status === 401) {
        return null;
      }

      // 에러 핸들러가 있으면 호출
      if (customErrorHandler) {
        customErrorHandler(apiResult);
        return null;
      }

      // 기본 에러 처리
      const errorMessage = getErrorMessage(apiResult.error.value);
      showErrorModal(`${apiDesc} 에러`, errorMessage);
      return null;
    }

    // API 응답은 성공했지만 비즈니스 로직 오류가 있는 경우
    if (apiResult.data.value && !apiResult.data.value.success) {
      // 에러 핸들러가 있으면 호출
      if (customErrorHandler) {
        customErrorHandler(apiResult);
        return null;
      }

      // 에러 코드가 있는 경우에만 모달 표시
      if (apiResult.data.value.code) {
        showErrorModal(`${apiDesc} 에러`, apiResult.data.value.message);
      }
      return null;
    }

    // 정상적인 응답 반환
    return apiResult.data.value;
  };

  /**
   * API 에러 객체에서 에러 메시지를 추출하는 헬퍼 함수
   * @param error API 에러 객체
   * @returns 에러 메시지
   */
  const getErrorMessage = (error: ApiError): string => {
    // data 속성에 메시지가 있는 경우
    if (error.data?.message) {
      return error.data.message;
    }

    // response 속성에 메시지가 있는 경우
    if (error.response?._data?.message) {
      return error.response._data.message;
    }

    return error?.message || "알 수 없는 오류가 발생했습니다.";
  };

  return {
    handleApiResponse,
    showErrorModal,
  };
}
