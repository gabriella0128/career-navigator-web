import { AuthAPI } from "~/api/authAPI";
import { ApiMethod } from "~/types/api";
import type { ReissueResponse } from "~/types/auth";
import type { CommonResponse } from "~/types/common";
import { joinURL } from "ufo"; // URL 경로 결합을 위한 라이브러리 추가

export const useAuth = () => {
  const getToken = () => sessionStorage.getItem("accessToken");
  const setToken = (token: string) =>
    sessionStorage.setItem("accessToken", token);
  const removeToken = () => sessionStorage.removeItem("accessToken");

  const reissueToken = async (url: string): Promise<number> => {
    const config = useRuntimeConfig();
    const statusCode = ref<number>(0);

    const { data, execute } = useFetch<CommonResponse<ReissueResponse>>(
      joinURL(config.public.VITE_API_URL, AuthAPI.REISSUE_TOKEN),
      {
        method: ApiMethod.POST,
        body: { urlPath: url },
        onRequest({ options }) {
          options.headers = new Headers({
            Authorization: `Bearer ${getToken() || ""}`,
          });
        },
        onResponse({ response }) {
          statusCode.value = response.status;
        },
      }
    );

    await execute();

    if (statusCode.value === 201 && data.value !== null) {
      setToken(data.value.data.accessToken);
    }

    return statusCode.value;
  };

  return {
    getToken,
    setToken,
    removeToken,
    reissueToken,
  };
};
