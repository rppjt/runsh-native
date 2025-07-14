// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext"; // 경로 맞게
import { LocationProvider } from "../src/contexts/LocationContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Slot />
      </LocationProvider>
    </AuthProvider>
  );
}
