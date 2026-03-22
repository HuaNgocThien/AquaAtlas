import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Colors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="fish/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="plant/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="tank/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
