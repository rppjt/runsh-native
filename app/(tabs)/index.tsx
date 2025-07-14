import { Image } from "expo-image";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏃 Welcome to Runsh Native</Text>
      <Image
        source={require("../assets/images/icon.png")} // 존재하는 이미지 경로로 변경
        style={styles.image}
        contentFit='cover'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "ios" ? "#fff" : "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
});
