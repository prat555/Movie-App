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
import { tmdbAPI } from '@/lib/tmdb';
import { useUser } from '@/lib/userContext';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Star
} from "lucide-react-native";
import React, { useEffect, useState } from 'react';

export default function Bookmarks() {
  const router = useRouter();
  const { getBookmarks, toggleBookmark } = useUser();
  const [bookmarkedMovies, setBookmarkedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarked movies from TMDB API
  useEffect(() => {
    const fetchBookmarkedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookmarkIds = getBookmarks();
        if (bookmarkIds.length === 0) {
          setBookmarkedMovies([]);
          return;
        }

        // Fetch movie details for each bookmarked movie
        const movies = await Promise.all(
          bookmarkIds.map(async (movieId) => {
            try {
              const movie = await tmdbAPI.getMovieDetails(movieId);
              return {
                id: movie.id,
                title: movie.title,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                rating: Math.round(movie.vote_average * 10) / 10,
                genre: movie.genres[0]?.name || 'Unknown',
                duration: movie.runtime ? `${movie.runtime} min` : 'Unknown',
                year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
                description: movie.overview,
                liked: true
              };
            } catch (error) {
              console.error(`Error fetching movie ${movieId}:`, error);
              return null;
            }
          })
        );

        setBookmarkedMovies(movies.filter(movie => movie !== null));
      } catch (err) {
        console.error('Error fetching bookmarked movies:', err);
        setError('Failed to load bookmarks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedMovies();
  }, [getBookmarks]);

  const removeBookmark = (movieId: number) => {
    toggleBookmark(movieId);
    setBookmarkedMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  const navigateToMovieDetails = (movieId: number) => {
    router.push(`/movie-details?id=${movieId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <Box className="flex-1 bg-gray-950 items-center justify-center">
        <Text className="text-white text-lg">Loading bookmarks...</Text>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box className="flex-1 bg-gray-950 items-center justify-center px-4">
        <Text className="text-red-400 text-lg text-center mb-4">{error}</Text>
        <Button className="bg-blue-500" onPress={() => window.location.reload()}>
          <ButtonText className="text-white">Retry</ButtonText>
        </Button>
      </Box>
    );
  }

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
        {bookmarkedMovies.length === 0 ? (
          <VStack className="flex-1 items-center justify-center px-4 py-12">
            <Icon as={Bookmark} size="xl" className="text-gray-600 mb-4" />
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
            {bookmarkedMovies.map((movie) => (
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