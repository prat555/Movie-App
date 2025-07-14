import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import React from "react";

export default function DeviceConnection() {
  const router = useRouter();
  return (
    <Box className="flex-1 bg-gray-950 justify-center items-center px-6">
      <VStack className="gap-6 items-center">
        <Heading size="xl" className="text-white font-bold">
          Device Connection
        </Heading>
        <Text className="text-gray-300 text-center">
          This is a placeholder screen for connecting to devices via Bluetooth or WiFi.
          {'\n'}
          In a real app, you would scan for available devices and allow the user to connect.
        </Text>
        <Box className="w-full items-center mt-8">
          <Button className="bg-blue-500 rounded-full px-8" onPress={() => router.back()}>
            <ButtonText className="text-white font-medium">Go Back</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
} 