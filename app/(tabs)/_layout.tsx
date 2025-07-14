import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name='mypage'
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => <Ionicons name='person-outline' size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
