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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { auth } from "../lib/firebase";
import { useUser } from "@/lib/userContext";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    // Clear previous errors
    setError("");

    if (!email || !password || !confirmPassword || !fullName.trim()) {
      setError("Please fill in all fields");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user context
      login({
        id: user.uid,
        email: user.email || '',
        name: fullName.trim()
      });
      
      router.replace("/");
    } catch (e: any) {
      // Handle Firebase auth errors
      let errorMessage = "An error occurred during sign up";
      
      switch (e.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = "Sign up failed. Please try again";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const clearError = () => {
    setError("");
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
                Create Account
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
                  Sign Up
                </Heading>
                <Text className="text-gray-400 text-lg">
                  Join the movie community
                </Text>
              </VStack>

              {/* Form */}
              <VStack className="gap-4">
                {/* Full Name Input */}
                <VStack className="gap-2">
                  <Text className="text-gray-300 font-medium">Full Name</Text>
                  <Input className="bg-gray-800 border-gray-700 rounded-xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={User} className="text-gray-400" />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your full name"
                      value={fullName}
                      onChangeText={(text) => {
                        setFullName(text);
                        clearError();
                      }}
                      autoComplete="name"
                      className="text-white placeholder:text-gray-500"
                    />
                  </Input>
                </VStack>

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
                        clearError();
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
                      placeholder="Create a password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        clearError();
                      }}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                      className="text-white placeholder:text-gray-500"
                    />
                    <InputSlot className="pr-4">
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon as={showPassword ? EyeOff : Eye} className="text-gray-400" />
                      </Pressable>
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Confirm Password Input */}
                <VStack className="gap-2">
                  <Text className="text-gray-300 font-medium">Confirm Password</Text>
                  <Input className="bg-gray-800 border-gray-700 rounded-xl">
                    <InputSlot className="pl-4">
                      <InputIcon as={Lock} className="text-gray-400" />
                    </InputSlot>
                    <InputField
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        clearError();
                      }}
                      secureTextEntry={!showConfirmPassword}
                      autoComplete="new-password"
                      className="text-white placeholder:text-gray-500"
                    />
                    <InputSlot className="pr-4">
                      <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <InputIcon as={showConfirmPassword ? EyeOff : Eye} className="text-gray-400" />
                      </Pressable>
                    </InputSlot>
                  </Input>
                </VStack>

                {/* Password Requirements */}
                <VStack className="gap-2">
                  <Text className="text-gray-400 text-sm font-medium">Password Requirements:</Text>
                  <VStack className="gap-1">
                    <HStack className="items-center gap-2">
                      <Icon 
                        as={CheckCircle} 
                        size="xs" 
                        className={password.length >= 6 ? "text-green-400" : "text-gray-500"} 
                      />
                      <Text className={`text-xs ${password.length >= 6 ? "text-green-400" : "text-gray-500"}`}>
                        At least 6 characters
                      </Text>
                    </HStack>
                    <HStack className="items-center gap-2">
                      <Icon 
                        as={CheckCircle} 
                        size="xs" 
                        className={password === confirmPassword && password.length > 0 ? "text-green-400" : "text-gray-500"} 
                      />
                      <Text className={`text-xs ${password === confirmPassword && password.length > 0 ? "text-green-400" : "text-gray-500"}`}>
                        Passwords match
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>

                {/* Error Message */}
                {error ? (
                  <Box className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                    <Text className="text-red-400 text-sm">{error}</Text>
                  </Box>
                ) : null}

                {/* Sign Up Button */}
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 rounded-xl py-4 mt-4"
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <ButtonText className="text-white font-semibold text-lg">
                    {loading ? "Creating Account..." : "Create Account"}
                  </ButtonText>
                </Button>
              </VStack>

              {/* Sign In Link */}
              <HStack className="justify-center mt-8">
                <Text className="text-gray-400">Already have an account? </Text>
                <Pressable onPress={() => router.push("/login")}>
                  <Text className="text-blue-400 font-medium">Sign In</Text>
                </Pressable>
              </HStack>

              {/* Terms and Privacy */}
              <VStack className="items-center mt-4">
                <Text className="text-gray-500 text-xs text-center">
                  By signing up, you agree to our{" "}
                  <Text className="text-blue-400">Terms of Service</Text> and{" "}
                  <Text className="text-blue-400">Privacy Policy</Text>
                </Text>
              </VStack>
            </VStack>
          </ScrollView>
        </Box>
      </View>
    </TouchableWithoutFeedback>
  );
} 