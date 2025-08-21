import type { ReissueResponse, LoginInfo, LoginResponse } from "~/types/auth";
import type { CommonResponse } from "~/types/common";
import { AuthAPI } from "~/api/authAPI";
import type { ApiObject } from "~/types/api";
import { ApiMethod } from "~/types/api";
import { joinURL } from "ufo";

export const useAuthStore = defineStore("auth", () => {
  const loginInfo: Ref<LoginInfo> = ref({
    // 로그인 정보
    userId: "", // 사용자 아이디
    userPasswd: "", // 사용자 비밀번호
  });

  const resetLoginInfo = () => {
    loginInfo.value.userId = "";
    loginInfo.value.userPasswd = "";
  };

  const resetTokenSessionStorage = () => {
    sessionStorage.removeItem("authToken");
  };

  const reissueToken = async (): Promise<boolean> => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch<CommonResponse<ReissueResponse>>(
        config.public.VITE_API_URL + AuthAPI.REISSUE_TOKEN,
        {
          method: ApiMethod.POST,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urlPath: pageUrl.value }),
        }
      );
      if (response.success) {
        sessionStorage.setItem("authToken", response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const loginUser: () => ApiObject<LoginResponse> = () => {
    const apiDesc = "로그인";
    const { data, error, execute } = useCallAPI<CommonResponse<LoginResponse>>(
      AuthAPI.USER_LOGIN,
      loginInfo.value
    );
    return { data, error, execute, apiDesc };
  };

  const logoutUser: () => ApiObject<void> = () => {
    const apiDesc = "로그아웃";
    const { data, error, execute } = useCallAPI<CommonResponse<void>>(
      AuthAPI.USER_LOGOUT
    );
    return { data, error, execute, apiDesc };
  };

  const pageUrl = ref<string>(""); // 이동하는 (인증, 권한을 확인하고자 하는) 페이지 URL

  const isPageAuthenticated = ref<boolean | null>(false);
  const isMaintainLogin = ref<boolean>(false);

  const updatePageUrl = (url: string) => {
    pageUrl.value = url;
  };
  /**
   * 페이지 인증 시도 method
   */
  const pageAuthCheck = async (retryCount: number = 1): Promise<void> => {
    try {
      const config = useRuntimeConfig();
      const apiUrl = joinURL(
        config.public.VITE_API_URL,
        AuthAPI.PAGE_AUTH_CHECK
      );
      const response = await $fetch<CommonResponse<void>>(apiUrl, {
        method: ApiMethod.POST,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pageUrl.value }),
      });

      isPageAuthenticated.value = response.success;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // any : 예측할 수 없는 에러
      if (error.status === 401 && retryCount > 0) {
        const newAccessTokenIssuedStatus = await reissueToken();
        if (!newAccessTokenIssuedStatus) {
          return pageAuthCheck(retryCount - 1);
        }
      }
      isPageAuthenticated.value = false;
    }
  };

  const resetLoginReqFromSessionStorage = () => {
    if (!isMaintainLogin.value) {
      sessionStorage.removeItem("auth");
    }
  };
  return {
    // state
    loginInfo,
    isPageAuthenticated,

    // actions

    resetLoginInfo,
    updatePageUrl,
    resetTokenSessionStorage,
    resetLoginReqFromSessionStorage,

    // api call
    loginUser,
    logoutUser,

    reissueToken,
    pageAuthCheck,
  };
});
