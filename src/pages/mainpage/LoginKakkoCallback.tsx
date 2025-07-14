import { getAccessToken } from "@/api/authentication/authentication"; // ✅ orval API
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoginKakkoCallback = () => {
  const { success, error } = useLocalSearchParams();
  const { setAccessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        if (success === "true") {
          const { data } = await getAccessToken(); // ✅ orval로 대체
          const token = (data as any).access_token;

          if (!token) throw new Error("❌ 토큰 없음");

          await setAccessToken(token);
          router.replace("/home");
        } else {
          console.error("❌ 로그인 실패:", error);
          router.replace("/");
        }
      } catch (err) {
        console.error("❌ 로그인 처리 실패:", err);
        router.replace("/");
      }
    };

    handleLogin();
  }, [success, error]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' />
      <Text>🔐 로그인 처리 중입니다...</Text>
    </View>
  );
};

export default LoginKakkoCallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
