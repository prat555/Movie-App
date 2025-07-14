import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bookmark,
    Calendar,
    Clock,
    Star
} from "lucide-react-native";
import React, { useState } from 'react';

// Mock bookmarked movies data
const bookmarkedMovies = [
  {
    id: 2,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1489599815540-4c069a1e3ea0?w=400&h=600&fit=crop",
    rating: 8.2,
    genre: "Action",
    duration: "130 min",
    year: "2022",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
    liked: true
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=600&fit=crop",
    rating: 8.4,
    genre: "Adventure",
    duration: "148 min",
    year: "2021",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    liked: true
  },
  {
    id: 5,
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
    rating: 7.6,
    genre: "Adventure",
    duration: "192 min",
    year: "2022",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.",
    liked: true
  },
  {
    id: 7,
    title: "No Time to Die",
    poster: "https://images.unsplash.com/photo-1489599815540-4c069a1e3ea0?w=400&h=600&fit=crop",
    rating: 7.3,
    genre: "Action",
    duration: "163 min",
    year: "2021",
    description: "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help.",
    liked: true
  }
];

export default function Bookmarks() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState(bookmarkedMovies);

  const removeBookmark = (movieId: number) => {
    setBookmarks(prev => prev.filter(movie => movie.id !== movieId));
  };

  const navigateToMovieDetails = (movieId: number) => {
    router.push(`/movie-details?id=${movieId}`);
  };

  return (
    <Box className="flex-1 bg-gray-950">
      {/* Header */}
      <Box className="px-4 pt-12 pb-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <HStack className="items-center justify-between mb-6">
          <HStack className="items-center gap-3">
            <Pressable
              onPress={() => router.back()}
            >
              <Icon as={ArrowLeft} size="lg" className="text-white" />
            </Pressable>
            <VStack>
              <Heading size="xl" className="text-white font-bold">
                My Bookmarks
              </Heading>
            </VStack>
          </HStack>
          <Box className="bg-gray-800 rounded-full p-3">
            <Icon as={Bookmark} size="lg" className="text-blue-400" />
          </Box>
        </HStack>
      </Box>

      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {bookmarks.length === 0 ? (
          <VStack className="flex-1 items-center justify-center px-4 py-12">
            <Icon as={Bookmark} size="4xl" className="text-gray-600 mb-4" />
            <Heading size="lg" className="text-gray-400 text-center mb-2">
              No bookmarks yet
            </Heading>
            <Text className="text-gray-500 text-center mb-6">
              Start bookmarking your favorite movies to see them here
            </Text>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
              onPress={() => router.back()}
            >
              <ButtonText className="text-white font-medium">
                Discover Movies
              </ButtonText>
            </Button>
          </VStack>
        ) : (
          <VStack className="px-4 gap-4">
            {bookmarks.map((movie) => (
              <Pressable 
                key={movie.id} 
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                onPress={() => navigateToMovieDetails(movie.id)}
              >
                <HStack className="gap-4">
                  <Image
                    source={{ uri: movie.poster }}
                    alt={movie.title}
                    className="w-16 h-24 rounded-lg"
                  />
                  <VStack className="flex-1 gap-2">
                    <VStack className="gap-1">
                      <Text className="text-white font-medium" numberOfLines={1}>
                        {movie.title}
                      </Text>
                      <HStack className="items-center gap-2">
                        <Badge className="bg-blue-500/20 border-blue-500/30">
                          <BadgeText className="text-blue-400 text-xs">
                            {movie.genre}
                          </BadgeText>
                        </Badge>
                        <HStack className="items-center gap-1">
                          <Icon as={Calendar} size="xs" className="text-gray-400" />
                          <Text className="text-gray-400 text-xs">
                            {movie.year}
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                    
                    <HStack className="items-center gap-4">
                      <HStack className="items-center gap-1">
                        <Icon as={Star} size="xs" className="text-yellow-400 fill-yellow-400" />
                        <Text className="text-yellow-400 text-sm">
                          {movie.rating}
                        </Text>
                      </HStack>
                      <HStack className="items-center gap-1">
                        <Icon as={Clock} size="xs" className="text-gray-400" />
                        <Text className="text-gray-400 text-sm">
                          {movie.duration}
                        </Text>
                      </HStack>
                    </HStack>
                    
                    <Text className="text-gray-400 text-sm leading-4" numberOfLines={2}>
                      {movie.description}
                    </Text>
                  </VStack>
                  
                  <VStack className="gap-2 self-start">
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        removeBookmark(movie.id);
                      }}
                      className="bg-gray-700/50 p-2 rounded-full border border-gray-600/50"
                    >
                      <Icon
                        as={require('lucide-react-native').X}
                        size="sm"
                        className="text-gray-400"
                      />
                    </Pressable>
                  </VStack>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
} 