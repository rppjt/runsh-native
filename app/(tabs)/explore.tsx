import { Image } from "expo-image";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏃‍♂️ Explore Screen</Text>
      <Image
        source={require("../../assets/images/icon.png")} // ✅ 실제 경로 확인 필요
        style={styles.image}
        contentFit='cover'
      />
      <Text style={styles.subtitle}>현재 플랫폼: {Platform.OS.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "#f5f5f5" : "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});
