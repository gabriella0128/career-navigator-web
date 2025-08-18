import type { UseFetchOptions } from "#app";
import { ApiMethod, type AsyncDataExecuteOptions } from "~/types/api";
import { retryStrategy } from "~/utils/retryStrategy";
import { useAuth } from "~/composables/useAuth";
import type { ApiError } from "~/types/common";
import { ref } from "vue";
import { joinURL } from "ufo"; // URL 경로 결합을 위한 라이브러리 추가

interface ResponseWithStatus {
  status?: number;
  message?: string;
}

/**
 *  api 호출에 공통으로 사용되는 method
 *  accessToken으로 인증 실패 시(401) 서버의 refreshToken을 확인해 토큰 재발급 시도 로직 포함
 *  refreshToken 만료 시 로그인 페이지로 이동하고 그 외의 이유로 토큰 재발급 실패 시 에러 표시
 */
export default function useCallAPI<T>(
  url: string,
  body?: unknown,
  postProcess?: (result: T | null | void) => Promise<void> | void,
  customHeader?: Record<string, string>
): {
  data: Ref<T | null>;
  error: Ref<ApiError | null>;
  execute: (opts?: AsyncDataExecuteOptions<T>) => Promise<void>;
} {
  const retryNumber = ref(0);
  // 데이터와 에러 상태
  const data = ref<T | null>(null);
  const error = ref<ApiError | null>(null);
  const auth = useAuth();
  const config = useRuntimeConfig();
  const apiUrl = joinURL(config.public.VITE_API_URL, url);
  const nuxtApp = useNuxtApp();
  const isMounted = import.meta.client && !nuxtApp.isHydrating;

  // 헤더 생성
  const generateHeaders = (
    existing?: HeadersInit,
    extra?: Record<string, string>,
    requestBody?: unknown
  ) => {
    const headers = new Headers(existing);

    if (requestBody instanceof FormData) {
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "application/json; charset=UTF-8");
    }
    // 2) 토큰 자동 추가
    const token = auth.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // 3) customHeader 에 같은 키가 있으면 override
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => {
        headers.set(k, v);
      });
    }
    console.log(
      "[generateHeaders] final Content-Type:",
      headers.get("Content-Type")
    );
    return headers;
  };

  // 인증 에러 처리 함수
  const handleAuthError = async (status: number): Promise<boolean> => {
    if (
      status === 401 &&
      retryStrategy.shouldRetry(retryNumber.value, status)
    ) {
      const result = await auth.reissueToken(url);
      retryNumber.value++;
      return result === 201;
    }
    return false;
  };

  // 재시도 카운터 리셋 함수
  const resetRetryCounter = () => {
    retryNumber.value = 0;
  };

  // 서버 또는 하이드레이션 중
  if (!isMounted) {
    const fetchOptions: UseFetchOptions<T> = {
      method: ApiMethod.POST,
      body: body || {},
      retry: retryStrategy.maxAttempts,
      retryStatusCodes: [401],
      lazy: true,
      immediate: false,
      onRequest({ options }) {
        options.headers = generateHeaders(
          options.headers,
          customHeader,
          options.body
        );
      },
      async onResponseError({ response }) {
        if (response?.status) {
          await handleAuthError(response.status);
        }
      },
      onResponse() {
        resetRetryCounter();
      },
    };

    const fetchResult = useFetch(apiUrl, fetchOptions);

    const execute = async (opts?: AsyncDataExecuteOptions<T>) => {
      await fetchResult.execute(opts);
      if (postProcess && fetchResult.data.value) {
        await postProcess(fetchResult.data.value as T);
      }
    };

    return {
      data: fetchResult.data as Ref<T | null>,
      error: fetchResult.error as Ref<ApiError | null>,
      execute,
    };
  }

  const execute = async (opts?: AsyncDataExecuteOptions<T>) => {
    try {
      const requestBody = opts?.body ?? body ?? {};
      const headers = generateHeaders(undefined, customHeader, requestBody);

      let result: T | null = null;
      let retries = 0;

      while (retries <= retryStrategy.maxAttempts) {
        try {
          result = await $fetch(apiUrl, {
            method: ApiMethod.POST,
            body: requestBody,
            headers: headers,
          });
          break;
        } catch (err) {
          const fetchError = err as { response?: ResponseWithStatus };
          if (
            fetchError.response?.status === 401 &&
            retries < retryStrategy.maxAttempts
          ) {
            // 토큰 재발급 시도
            const reissueSuccess = await handleAuthError(
              fetchError.response.status
            );

            if (reissueSuccess) {
              retries++;
            } else {
              // 재발급 실패 시 즉시 중단
              throw err;
            }
          } else {
            throw err;
          }
        }
      }

      data.value = result;
      if (postProcess && result) {
        await postProcess(result);
      }
      resetRetryCounter();

      return result;
    } catch (err) {
      error.value = err as ApiError;
      // throw err;
    }
  };

  return {
    data: data as Ref<T | null>,
    error: error as Ref<ApiError | null>,
    execute: execute as unknown as (
      opts?: AsyncDataExecuteOptions<T>
    ) => Promise<void>,
  };
}
