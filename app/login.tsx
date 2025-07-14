import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { auth, googleProvider } from "../lib/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // For web: signInWithPopup, for native: use expo-auth-session
      await signInWithPopup(auth, googleProvider);
      router.replace("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 8, borderRadius: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Sign in with Google" onPress={handleGoogleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Go to Signup" onPress={() => router.push("/signup")} />
      {error ? <Text style={{ color: "red", marginTop: 16 }}>{error}</Text> : null}
    </View>
  );
} 