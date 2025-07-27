import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUser } from '@/lib/userContext';
import { useRouter } from 'expo-router';
import {
  Bookmark,
  Download,
  LogOut,
  Settings,
  User,
  X
} from "lucide-react-native";
import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserMenu({ visible, onClose }: UserMenuProps) {
  const { userData, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onClose();
    router.replace('/login');
  };

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your account',
      onPress: () => handleNavigation('/profile'),
      color: 'text-blue-400'
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      description: 'Your saved movies',
      onPress: () => handleNavigation('/bookmarks'),
      color: 'text-green-400'
    },
    {
      icon: Download,
      label: 'Downloads',
      description: 'Offline content',
      onPress: () => handleNavigation('/downloads'),
      color: 'text-purple-400'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
      onPress: () => handleNavigation('/settings'),
      color: 'text-gray-400'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Box className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <Box className="bg-gray-900 rounded-t-3xl border-t border-gray-700">
              {/* Header */}
              <Box className="px-6 pt-6 pb-4">
                <HStack className="items-center justify-between mb-4">
                  <VStack>
                    <Heading size="lg" className="text-white font-bold">
                      Account
                    </Heading>
                    <Text className="text-gray-400 text-sm">
                      {userData.user?.email}
                    </Text>
                  </VStack>
                  <Pressable
                    onPress={onClose}
                    className="bg-gray-800 p-2 rounded-full"
                  >
                    <Icon as={X} size="sm" className="text-gray-400" />
                  </Pressable>
                </HStack>

                {/* User Info Card */}
                <Box className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
                  <HStack className="items-center gap-3">
                    <Box className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center">
                      <Text className="text-white font-bold text-lg">
                        {userData.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </Box>
                    <VStack className="flex-1">
                      <Text className="text-white font-semibold text-lg">
                        {userData.user?.name || 'User'}
                      </Text>
                      <Text className="text-blue-400 text-sm">
                        {userData.bookmarks.length} bookmarks • {userData.watchHistory.length} watched
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>

              {/* Menu Items */}
              <VStack className="px-6 pb-4">
                {menuItems.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={item.onPress}
                    className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700/50"
                  >
                    <HStack className="items-center gap-4">
                      <Box className="bg-gray-700/50 p-3 rounded-full">
                        <Icon as={item.icon} size="sm" className={item.color} />
                      </Box>
                      <VStack className="flex-1">
                        <Text className="text-white font-medium">
                          {item.label}
                        </Text>
                        <Text className="text-gray-400 text-sm">
                          {item.description}
                        </Text>
                      </VStack>
                      <Icon as={require('lucide-react-native').ChevronRight} size="sm" className="text-gray-500" />
                    </HStack>
                  </Pressable>
                ))}
              </VStack>

              {/* Logout Button */}
              <Box className="px-6 pb-8">
                <Button
                  className="bg-red-500/20 border border-red-500/30 rounded-xl py-4"
                  onPress={handleLogout}
                >
                  <HStack className="items-center gap-2">
                    <Icon as={LogOut} size="sm" className="text-red-400" />
                    <ButtonText className="text-red-400 font-medium">
                      Logout
                    </ButtonText>
                  </HStack>
                </Button>
              </Box>
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
