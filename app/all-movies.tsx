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
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Filter,
  Search,
  Star
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from 'react';

const categories = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Comedy", "Horror", "Romance"];

export default function AllMovies() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedMovies, setBookmarkedMovies] = useState<number[]>([2, 4, 5]);
  const [sortBy, setSortBy] = useState<"rating" | "year" | "title">("rating");
  
  // State for API data
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = allMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movie.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || movie.genre === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "year":
          return parseInt(b.year) - parseInt(a.year);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Fetch movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch popular movies for the all movies page
        const movies = await tmdbAPI.getPopularMovies(1);
        setAllMovies(movies);
        
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const toggleBookmark = (movieId: number) => {
    setBookmarkedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const navigateToMovieDetails = (movieId: number) => {
    router.push(`/movie-details?id=${movieId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <Box className="flex-1 bg-gray-950 items-center justify-center">
        <Text className="text-white text-lg">Loading movies...</Text>
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
                All Movies
              </Heading>
            </VStack>
          </HStack>
          <Box className="bg-gray-800 rounded-full p-3">
            <Icon as={Filter} size="lg" className="text-blue-400" />
          </Box>
        </HStack>

        {/* Remove search, categories, and sort options here */}
      </Box>

      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {filteredAndSortedMovies.length === 0 ? (
          <VStack className="flex-1 items-center justify-center px-4 py-12">
            <Icon as={Search} size="xl" className="text-gray-600 mb-4" />
            <Heading size="lg" className="text-gray-400 text-center mb-2">
              No movies found
            </Heading>
            <Text className="text-gray-500 text-center">
              Try adjusting your search or filter criteria
            </Text>
          </VStack>
        ) : (
          <VStack className="px-4 gap-4">
            {filteredAndSortedMovies.map((movie) => (
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
                  
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleBookmark(movie.id);
                    }}
                    className="bg-gray-700/50 p-2 rounded-full self-start"
                  >
                    <Icon
                      as={Bookmark}
                      size="sm"
                      className={bookmarkedMovies.includes(movie.id) ? "text-blue-400 fill-blue-400" : "text-gray-400"}
                    />
                  </Pressable>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
} 