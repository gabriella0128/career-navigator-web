import type { UseFetchOptions } from '#app';
import type { ApiError, CommonResponse } from '~/types/common';
import type { Ref } from 'vue';

export enum ApiMethod {
  POST = 'POST'
}

export type AsyncDataExecuteOptions<T = unknown> = Partial<UseFetchOptions<T>>;

export interface ApiObject<T> {
  data: Ref<CommonResponse<T> | null>;
  error: Ref<ApiError | null>;
  execute: (opts?: AsyncDataExecuteOptions<CommonResponse<T>>) => Promise<void>;
  apiDesc: string;
}
