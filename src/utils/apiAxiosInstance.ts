import { AxiosRequestConfig } from "axios";
import authAxios from "./authAxios";

// ✅ 에러 타입 정의 (orval에서 자동 생성된 타입과 호환)
export type ErrorType<T = unknown> = {
  message: string;
  status?: number;
  data?: T;
};

// ✅ orval이 예상하는 시그니처와 맞춤
export const apiAxiosInstance = async <T = unknown>(
  config: AxiosRequestConfig,
  _options?: unknown // 확장성을 위해 받지만 사용하지 않음
): Promise<T> => {
  try {
    const response = await authAxios(config);
    return response.data;
  } catch (error: any) {
    // 필요 시 여기서 공통 에러 처리 가능
    // 예: toast.show(), Sentry.captureException(error) 등

    // ✅ orval이 예상하는 형식으로 throw
    throw {
      message: error?.message || "Unknown error",
      status: error?.response?.status,
      data: error?.response?.data,
    } as ErrorType<T>;
  }
};
