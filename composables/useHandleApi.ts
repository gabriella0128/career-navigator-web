import type { ApiObject } from '~/types/api';
import { useLoading } from './useLoading';
import type { CommonResponse } from '~/types/common';

export async function useHandleApi<T>(
  apiObject: ApiObject<T>,
  useLoader?: boolean,
  customErrorHandler?: (apiObject: ApiObject<T>) => void,
  updateProcess?: (param?: unknown) => Promise<void>
): Promise<CommonResponse<T> | null> {
  const call = async () => {
    if (updateProcess) {
      await updateProcess();
    }
    await apiObject.execute();
    const response = await useApiResponse<T>(
      customErrorHandler
    ).handleApiResponse(apiObject.apiDesc || '', apiObject);
    return response as CommonResponse<T> | null;
  };

  return useLoader ? await useLoading(call) : await call();
}
