import { API_BASE_URL } from "@env"; // RN용 환경변수
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAccessToken } from "../contexts/AuthContextUtils";
// import { navigate } from "../navigations/NavigationService"; // 필요 시 사용

const authAxios: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 - accessToken 헤더에 추가
authAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken(); // RN에선 AsyncStorage 사용 가능
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터 - 401(J001) 발생 시 refresh
authAxios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      (error.response.data as any)?.code === "J001" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          {}
        );

        const newToken = refreshRes.data.accessToken;
        if (newToken) {
          await setAccessToken(newToken);
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          return authAxios(originalRequest); // ⬅️ 재시도
        }
      } catch (refreshError) {
        console.log("🔁 refresh 실패 - 로그아웃 필요");

        // ❗ 여기는 앱 로직에 맞게 처리 필요
        // 예시:
        // await AsyncStorage.clear();
        // navigate("Login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;
