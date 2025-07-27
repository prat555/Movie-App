import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { auth } from "../lib/firebase";
import { useUser } from "@/lib/userContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user context
      login({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User'
      });
      
      router.replace("/");
    } catch (e: any) {
      // Handle Firebase auth errors
      let errorMessage = "An error occurred during sign in";
      
      switch (e.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = "Sign in failed. Please try again";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };



  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <Box className="flex-1 bg-gray-950">
          {/* Header */}
          <Box className="px-4 pt-12 pb-4">
            <HStack className="items-center justify-between mb-8">
              <Pressable onPress={() => router.back()}>
                <Icon as={ArrowLeft} size="lg" className="text-white" />
              </Pressable>
              <Heading size="xl" className="text-white font-bold">
                Welcome Back
              </Heading>
              <Box className="w-8" />
            </HStack>
          </Box>

          {/* Content */}
          <ScrollView className="flex-1" contentContainerClassName="px-6 pb-6">
            <VStack className="gap-6">
              {/* Welcome Text */}
              <VStack className="gap-2">
                <Heading size="2xl" className="text-white font-bold">
                  Sign In
                </Heading>
                <Text className="text-gray-400 text-lg">
                  Continue your movie journey
                </Text>
              </VStack>

              {/* Form */}
              <VStack className="gap-4">
                {/* Email Input */}
                <VStack className="gap-2">
                  <Text className="text-gray-300 font-medium">Email</Text>
                  <Input className="bg-gray-800 border-gray-700 rounded-xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Mail} className="text-gray-400" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError(""); // Clear error when user types
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      className="text-white placeholder:text-gray-500"
                    />
                  </Input>
                </VStack>

                {/* Password Input */}
                <VStack className="gap-2">
                  <Text className="text-gray-300 font-medium">Password</Text>
                  <Input className="bg-gray-800 border-gray-700 rounded-xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Lock} className="text-gray-400" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setError(""); // Clear error when user types
                      }}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      className="text-white placeholder:text-gray-500"
                    />
                    <InputSlot className="pr-4">
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon as={showPassword ? EyeOff : Eye} className="text-gray-400" />
                      </Pressable>
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Error Message */}
                {error ? (
                  <Box className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                    <Text className="text-red-400 text-sm">{error}</Text>
                  </Box>
                ) : null}

                            {/* Login Button */}
            <Button 
              className="bg-blue-500 hover:bg-blue-600 rounded-xl py-4 mt-4"
              onPress={handleLogin}
              disabled={loading}
            >
              <ButtonText className="text-white font-semibold text-lg">
                {loading ? "Signing In..." : "Sign In"}
              </ButtonText>
            </Button>


          </VStack>

              {/* Sign Up Link */}
              <HStack className="justify-center mt-8">
                <Text className="text-gray-400">Don't have an account? </Text>
                <Pressable onPress={() => router.push("/signup")}>
                  <Text className="text-blue-400 font-medium">Sign Up</Text>
                </Pressable>
              </HStack>

              {/* Forgot Password */}
              <HStack className="justify-center">
                <Pressable onPress={() => Alert.alert("Forgot Password", "This feature is coming soon!")}>
                  <Text className="text-gray-500 text-sm">Forgot Password?</Text>
                </Pressable>
              </HStack>
            </VStack>
          </ScrollView>
        </Box>
      </View>
    </TouchableWithoutFeedback>
  );
} 