// 📁 src/contexts/AuthContextUtils.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

let accessTokenCache: string | null = null;

/**
 * accessToken을 AsyncStorage + 메모리에 저장
 */
export const setAccessToken = async (token: string | null): Promise<void> => {
  accessTokenCache = token;
  if (token) {
    await AsyncStorage.setItem("accessToken", token);
  } else {
    await AsyncStorage.removeItem("accessToken");
  }
};

/**
 * 메모리에 있는 accessToken 반환. 없다면 AsyncStorage에서 불러옴
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (accessTokenCache) return accessTokenCache;

  const token = await AsyncStorage.getItem("accessToken");
  accessTokenCache = token;
  return token;
};
