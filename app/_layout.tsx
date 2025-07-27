import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UserProvider } from "@/lib/userContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <UserProvider>
      <GluestackUIProvider mode="light">
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['bottom']}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie-details"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="bookmarks"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="all-movies"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="device-connection"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="signup"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </GluestackUIProvider>
    </UserProvider>
  );
}
