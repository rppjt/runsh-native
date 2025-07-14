// app/login.tsx

import { getAccessToken } from "@/api/authentication/authentication"; // orval 생성된 함수
import { getUserInfo } from "@/api/user/user";
import { KAKAO_LOGIN_URL } from "@env";
import { router } from "expo-router";
import React, { useRef } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const webviewRef = useRef(null);
  const { setAccessToken, setUser } = useAuth();

  const handleNavigationChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes("/login/callback?success=true")) {
      try {
        // 1️⃣ access token 가져오기
        const { data: tokenData } = await getAccessToken();
        const token = (tokenData as any).access_token; // ⚠️ access_token 타입 지정 안 된 경우 cast
        if (!token) throw new Error("❌ 토큰 없음");

        await setAccessToken(token); // AsyncStorage 저장 및 상태 관리

        // 2️⃣ 사용자 정보 가져오기
        const { data: userData } = await getUserInfo();
        setUser(userData);

        // 3️⃣ 홈으로 이동
        router.replace("/home");
      } catch (err) {
        console.error("❌ 로그인 처리 중 오류 발생:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/home.jpg")} style={styles.background} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Runsh</Text>
        <View style={styles.webviewBox}>
          <WebView
            ref={webviewRef}
            source={{ uri: KAKAO_LOGIN_URL }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
            renderLoading={() => <ActivityIndicator size='large' color='#ffffff' />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  webviewBox: {
    width: "90%",
    height: "60%",
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default LoginPage;
