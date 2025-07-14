import { getUserInfo } from "@/api/user/user"; // ✅ 사용자 정보 요청
import type { UserInfoResponse } from "@/api/userInfoResponse"; // ✅ 타입
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => Promise<void>;
  user: UserInfoResponse | null;
  setUser: (user: UserInfoResponse | null) => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setAccessToken = async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem("accessToken", token);
    } else {
      await AsyncStorage.removeItem("accessToken");
    }
    setAccessTokenState(token);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          setUser(null);
          setIsAuthReady(true);
          return;
        }

        setAccessTokenState(token);

        // ✅ 사용자 정보 요청은 getUserInfo 사용
        const { data } = await getUserInfo();
        setUser(data as UserInfoResponse);
      } catch (err) {
        console.error("❌ 사용자 정보 불러오기 실패", err);
        setUser(null);
      } finally {
        setIsAuthReady(true);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        isAuthReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  return context;
};
