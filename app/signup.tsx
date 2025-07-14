import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { auth } from "../lib/firebase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>Sign Up</Text>
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
      <Button title="Sign Up" onPress={handleSignup} />
      <View style={{ height: 12 }} />
      <Button title="Go to Login" onPress={() => router.push("/login")} />
      {error ? <Text style={{ color: "red", marginTop: 16 }}>{error}</Text> : null}
    </View>
  );
} 