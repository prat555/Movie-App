import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from 'expo-router';
import {
    Bookmark,
    Clock,
    Play,
    Search,
    Star,
    TrendingUp,
    Users
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from 'react';
import { Linking, RefreshControl, ScrollView as RNScrollView, View } from 'react-native';

// Mock data for movies
const featuredMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=600&fit=crop",
    rating: 8.5,
    genre: "Sci-Fi",
    duration: "166 min",
    year: "2024",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    liked: false
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=338&fit=crop",
    rating: 8.2,
    genre: "Action",
    duration: "130 min",
    year: "2022",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
    liked: true
  },
  {
    id: 3,
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
    rating: 7.6,
    genre: "Adventure",
    duration: "192 min",
    year: "2022",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.",
    liked: false
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
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1467987506553-8f3916508521?w=400&h=600&fit=crop",
    rating: 8.8,
    genre: "Sci-Fi",
    duration: "148 min",
    year: "2010",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    liked: false
  }
];

// Add trailerDate to each trendingMovies entry
const trendingMovies = [
  {
    id: 4,
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=960&h=540&fit=crop",
    rating: 7.6,
    genre: "Adventure",
    duration: "192 min",
    year: "2022",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started.",
    liked: false,
    trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
    trailerDate: "1 Jul"
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=960&h=540&fit=crop",
    rating: 8.2,
    genre: "Action",
    duration: "130 min",
    year: "2022",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
    liked: true,
    trailerUrl: "https://www.youtube.com/watch?v=qSqVVsw0_eo",
    trailerDate: "21 May"
  },
  {
    id: 6,
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=960&h=540&fit=crop",
    rating: 8.4,
    genre: "Adventure",
    duration: "148 min",
    year: "2021",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    liked: true,
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    trailerDate: "2025"
  },
  {
    id: 7,
    title: "No Time to Die",
    poster: "https://images.unsplash.com/photo-1468071174046-657d9d351a40?w=960&h=540&fit=crop",
    rating: 7.3,
    genre: "Action",
    duration: "163 min",
    year: "2021",
    description: "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help.",
    liked: true,
    trailerUrl: "https://www.youtube.com/watch?v=BpJYNVhGf2g",
    trailerDate: "2025"
  }
];



const categories = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Comedy", "Horror", "Romance"];

export default function MovieApp() {
  const router = useRouter();
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedMovies, setBookmarkedMovies] = useState<number[]>([2, 5, 7]);
  const [refreshing, setRefreshing] = useState(false);
  const [username] = useState("Pratyush Goutam"); // You can replace this with actual user data
  const scrollRef = useRef<RNScrollView>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  // Auto-rotate featured movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => {
        const next = (prev + 1) % featuredMovies.length;
        if (scrollRef.current && carouselWidth) {
          scrollRef.current.scrollTo({
            x: next * carouselWidth,
            animated: true,
          });
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselWidth]);

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

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate an async refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const featured = featuredMovies[currentFeatured];

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <Box className="flex-1 bg-gray-950">
        {/* Header */}
        <Box className="px-4 pt-12 pb-4 bg-gradient-to-b from-gray-900 to-gray-950">
          <HStack className="items-center justify-between mb-6">
            <VStack>
              <Heading size="xl" className="text-white font-bold">
                Welcome,
              </Heading>
              <Text size="md" className="text-blue-400 font-medium">
                {username}
              </Text>
            </VStack>
            <HStack className="items-center gap-4">
              <Pressable
                onPress={() => router.push('/bookmarks')}
                className="bg-gray-800/60 p-3 rounded-full border border-gray-700"
              >
                <Icon as={Bookmark} size="sm" className="text-gray-400" />
              </Pressable>
              <Box className="bg-gray-800 rounded-full p-3">
                <Pressable onPress={() => router.push('/login')}>
                  <Icon as={Users} size="lg" className="text-blue-400" />
                </Pressable>
              </Box>
            </HStack>
          </HStack>

          {/* Search Bar */}
          <Input className="bg-gray-800 border-gray-700 rounded-full">
            <InputSlot className="pl-4">
              <InputIcon as={Search} className="text-gray-400" />
            </InputSlot>
            <InputField
              placeholder="Search movies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-white placeholder:text-gray-400"
            />
          </Input>
        </Box>

        <ScrollView 
          className="flex-1" 
          contentContainerClassName="pb-6"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Featured Movie Carousel */}
          <Box className="px-4 mb-8">
            <HStack className="items-center justify-between mb-4">
              <Heading size="lg" className="text-white">
                Featured
              </Heading>
              <HStack className="items-center gap-2">
                {featuredMovies.map((_, index) => (
                  <Box
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentFeatured ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </HStack>
            </HStack>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onLayout={e => {
                setCarouselWidth(e.nativeEvent.layout.width);
              }}
              onScroll={e => {
                const page = Math.round(
                  e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width
                );
                if (page !== currentFeatured) setCurrentFeatured(page);
              }}
              scrollEventThrottle={16}
              style={{ width: '100%' }}
            >
              {featuredMovies.map((movie, index) => (
                <Pressable
                  key={movie.id}
                  className="relative rounded-2xl overflow-hidden"
                  style={{ width: carouselWidth || '100%' }}
                  onPress={() => navigateToMovieDetails(movie.id)}
                >
                  <Image
                    source={{ uri: movie.poster }}
                    alt={movie.title}
                    className="w-full h-96 rounded-2xl"
                  />
                  <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" />
                  <Box className="absolute bottom-0 left-0 right-0 p-6">
                    <VStack className="gap-3">
                      <HStack className="items-center gap-2">
                        <Badge className="bg-blue-500/20 border-blue-500/30">
                          <BadgeText className="text-blue-400 font-medium">
                            {movie.genre}
                          </BadgeText>
                        </Badge>
                        <Badge className="bg-gray-800/60 border-gray-700">
                          <BadgeText className="text-gray-300">
                            {movie.year}
                          </BadgeText>
                        </Badge>
                      </HStack>
                      <Heading size="xl" className="text-white font-bold">
                        {movie.title}
                      </Heading>
                      <HStack className="items-center gap-4">
                        <HStack className="items-center gap-1">
                          <Icon as={Star} size="sm" className="text-yellow-400 fill-yellow-400" />
                          <Text className="text-yellow-400 font-medium">
                            {movie.rating}
                          </Text>
                        </HStack>
                        <HStack className="items-center gap-1">
                          <Icon as={Clock} size="sm" className="text-gray-400" />
                          <Text className="text-gray-400">
                            {movie.duration}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text className="text-gray-300 leading-5" numberOfLines={2}>
                        {movie.description}
                      </Text>
                      <HStack className="items-center gap-3 mt-2">
                        <Button className="bg-blue-500 hover:bg-blue-600 rounded-full flex-1">
                          <Icon as={Play} size="sm" className="text-white mr-2" />
                          <ButtonText className="text-white font-medium">
                            Watch Now
                          </ButtonText>
                        </Button>
                        <Pressable
                          onPress={() => toggleBookmark(movie.id)}
                          className="bg-gray-800/60 p-3 rounded-full border border-gray-700"
                        >
                          <Icon
                            as={Bookmark}
                            size="sm"
                            className={bookmarkedMovies.includes(movie.id) ? "text-blue-400 fill-blue-400" : "text-gray-400"}
                          />
                        </Pressable>
                      </HStack>
                    </VStack>
                  </Box>
                </Pressable>
              ))}
            </ScrollView>
          </Box>

                    {/* Continue Watching */}
                    <VStack className="mb-8">
            <HStack className="items-center justify-between px-4 mb-4">
              <Heading size="lg" className="text-white">
                Continue Watching
              </Heading>
              <Button variant="link" className="p-0" onPress={() => router.push('/continue-watching')}>
                <ButtonText className="text-blue-400 font-medium">
                  View All
                </ButtonText>
              </Button>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="px-4 gap-4">
                {featuredMovies.slice(0, 4).map((movie) => (
                  <Pressable 
                    key={movie.id} 
                    className="w-80"
                    onPress={() => navigateToMovieDetails(movie.id)}
                  >
                    <Box className="relative">
                      <Image
                        source={{ uri: movie.poster }}
                        alt={movie.title}
                        className="w-full h-44 rounded-xl"
                      />
                                             <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                       {/* Play button overlay */}
                       <Pressable
                         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full"
                         onPress={(e) => {
                           e.stopPropagation();
                           navigateToMovieDetails(movie.id);
                         }}
                       >
                         <Icon as={Play} size="lg" className="text-white" />
                       </Pressable>
                       {/* Progress bar */}
                       <Box className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                         <Box 
                           className="h-full bg-blue-500" 
                           style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}
                         />
                       </Box>
                      <Box className="absolute bottom-6 left-0 right-0 p-3">
                        <VStack className="gap-1">
                          <Text className="text-white font-medium" numberOfLines={1}>
                            {movie.title}
                          </Text>
                          <HStack className="items-center gap-2">
                            <Text className="text-gray-400 text-xs">
                              {Math.floor(Math.random() * 60) + 20} min left
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Trending Movies */}
          <VStack className="mb-8">
            <HStack className="items-center justify-between px-4 mb-4">
              <HStack className="items-center gap-2">
                <Heading size="lg" className="text-white">
                  Trending Now
                </Heading>
                <Icon as={TrendingUp} size="lg" className="text-blue-400" />
              </HStack>
              <Button variant="link" className="p-0" onPress={() => router.push('/all-movies')}>
                <ButtonText className="text-blue-400 font-medium">
                  View All
                </ButtonText>
              </Button>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="px-4 gap-4">
                {trendingMovies.map((movie) => (
                  <Pressable 
                    key={movie.id} 
                    className="w-40"
                    onPress={() => navigateToMovieDetails(movie.id)}
                  >
                    <Box className="relative">
                      <Image
                        source={{ uri: movie.poster }}
                        alt={movie.title}
                        className="w-full h-56 rounded-xl"
                      />
                      <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleBookmark(movie.id);
                        }}
                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                      >
                        <Icon
                          as={Bookmark}
                          size="sm"
                          className={bookmarkedMovies.includes(movie.id) ? "text-blue-400 fill-blue-400" : "text-white"}
                        />
                      </Pressable>
                      <Box className="absolute bottom-0 left-0 right-0 p-3">
                        <VStack className="gap-1">
                          <Text className="text-white font-medium" numberOfLines={1}>
                            {movie.title}
                          </Text>
                          <HStack className="items-center gap-2">
                            <HStack className="items-center gap-1">
                              <Icon as={Star} size="xs" className="text-yellow-400 fill-yellow-400" />
                              <Text className="text-yellow-400 text-xs">
                                {movie.rating}
                              </Text>
                            </HStack>
                            <Text className="text-gray-400 text-xs">
                              {movie.genre}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Trending Trailers */}
          <VStack className="mb-8">
            <HStack className="items-center px-4 mb-4 gap-2">
              <Heading size="lg" className="text-white">
                Trending Trailers
              </Heading>
              <Icon as={TrendingUp} size="lg" className="text-blue-400" />
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="px-4 gap-4">
                {trendingMovies.map((movie) => (
                  <Pressable
                    key={movie.id}
                    className="w-80"
                    onPress={() => {
                      const url = movie.trailerUrl || 'https://www.youtube.com';
                      window.open ? window.open(url, '_blank') : Linking.openURL(url);
                    }}
                  >
                    <Box className="relative">
                      <Image
                        source={{ uri: movie.poster }}
                        alt={movie.title}
                        className="w-full h-44 rounded-xl"
                      />
                      <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                      <Box className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs">{movie.year}</Text>
                      </Box>
                      <Pressable
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full"
                        onPress={(e) => {
                          e.stopPropagation();
                          const url = movie.trailerUrl || 'https://www.youtube.com';
                          window.open ? window.open(url, '_blank') : Linking.openURL(url);
                        }}
                      >
                        <Icon as={Play} size="lg" className="text-white" />
                      </Pressable>
                      <Box className="absolute bottom-0 left-0 right-0 p-3">
                        <Text className="text-white font-semibold" numberOfLines={1}>
                          {movie.title}
                        </Text>
                      </Box>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Recommendations */}
          <VStack className="mb-8">
            <HStack className="items-center justify-between px-4 mb-4">
              <Heading size="lg" className="text-white">
                Recommended for You
              </Heading>
              <Button variant="link" className="p-0" onPress={() => router.push('/all-movies')}>
                <ButtonText className="text-blue-400 font-medium">
                  View All
                </ButtonText>
              </Button>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="px-4 gap-4">
                {featuredMovies.slice(0, 3).map((movie) => (
                  <Pressable 
                    key={movie.id} 
                    className="w-40"
                    onPress={() => navigateToMovieDetails(movie.id)}
                  >
                    <Box className="relative">
                      <Image
                        source={{ uri: movie.poster }}
                        alt={movie.title}
                        className="w-full h-56 rounded-xl"
                      />
                      <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleBookmark(movie.id);
                        }}
                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                      >
                        <Icon
                          as={Bookmark}
                          size="sm"
                          className={bookmarkedMovies.includes(movie.id) ? "text-blue-400 fill-blue-400" : "text-white"}
                        />
                      </Pressable>
                      <Box className="absolute bottom-0 left-0 right-0 p-3">
                        <VStack className="gap-1">
                          <Text className="text-white font-medium" numberOfLines={1}>
                            {movie.title}
                          </Text>
                          <HStack className="items-center gap-2">
                            <HStack className="items-center gap-1">
                              <Icon as={Star} size="xs" className="text-yellow-400 fill-yellow-400" />
                              <Text className="text-yellow-400 text-xs">
                                {movie.rating}
                              </Text>
                            </HStack>
                            <Text className="text-gray-400 text-xs">
                              {movie.genre}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Watch by Genre */}
          <VStack className="mb-8">
            <HStack className="items-center justify-between px-4 mb-4">
              <Heading size="lg" className="text-white">
                Watch by Genre
              </Heading>
              <Button variant="link" className="p-0" onPress={() => router.push('/all-movies')}>
                <ButtonText className="text-blue-400 font-medium">
                  View All
                </ButtonText>
              </Button>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="px-4 gap-4">
                {categories.slice(1).map((genre) => {
                  // Define genre-specific images
                  const genreImages = {
                    Action: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop",
                    Adventure: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop",
                    Drama: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=400&fit=crop",
                    "Sci-Fi": "https://images.unsplash.com/photo-1467987506553-8f3916508521?w=400&h=400&fit=crop",
                    Comedy: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=400&fit=crop",
                    Horror: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop",
                    Romance: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop"
                  };
                  
                  return (
                    <Pressable
                      key={genre}
                      className="w-32 h-32 rounded-xl overflow-hidden"
                      onPress={() => {
                        // Navigate to genre-specific movies
                        router.push(`/all-movies?genre=${genre}`);
                      }}
                    >
                      <Box className="relative w-full h-full">
                        <Image
                          source={{ uri: genreImages[genre as keyof typeof genreImages] || genreImages.Action }}
                          alt={genre}
                          className="w-full h-full"
                        />
                        <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <VStack className="absolute bottom-0 left-0 right-0 p-3 items-center">
                          <Text className="text-white font-bold text-sm text-center">
                            {genre}
                          </Text>
                          <Text className="text-white/80 text-xs">
                            {Math.floor(Math.random() * 50) + 10} movies
                          </Text>
                        </VStack>
                      </Box>
                    </Pressable>
                  );
                })}
              </HStack>
            </ScrollView>
          </VStack>


        </ScrollView>
      </Box>
    </View>
  );
}