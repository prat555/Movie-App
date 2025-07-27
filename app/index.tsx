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
import { tmdbAPI } from '@/lib/tmdb';
import { useUser } from '@/lib/userContext';
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
import { useEffect, useRef, useState } from 'react';
import { Linking, RefreshControl, ScrollView as RNScrollView, View } from 'react-native';

// Categories for genre filtering
const categories = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Comedy", "Horror", "Romance"];

export default function MovieApp() {
  const router = useRouter();
  const { userData, toggleBookmark, isBookmarked, getWatchHistory, getWatchProgress } = useUser();
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<RNScrollView>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  // State for API data
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's watch history and create continue watching list
  const watchHistory = getWatchHistory();
  
  // Fetch data from TMDB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trending movies for featured section
        const trending = await tmdbAPI.getTrendingMovies('week', 1);
        
        // Get runtime for featured movies
        const featuredWithRuntime = await Promise.all(
          trending.slice(0, 5).map(async (movie: any) => {
            try {
              const details = await tmdbAPI.getMovieDetails(movie.id);
              return {
                ...movie,
                duration: details.runtime ? `${details.runtime} min` : 'Unknown'
              };
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.id}:`, error);
              return movie;
            }
          })
        );
        
        setFeaturedMovies(featuredWithRuntime);
        
        // Fetch popular movies for trending section
        const popular = await tmdbAPI.getPopularMovies(1);
        setTrendingMovies(popular.slice(0, 4).map((movie: any) => ({
          ...movie,
          trailerUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Placeholder trailer URL
          trailerDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })));
        
        // Fetch top rated movies for recommendations
        const topRated = await tmdbAPI.getTopRatedMovies(1);
        setPopularMovies(topRated.slice(0, 3));
        
        // Create continue watching list from user's watch history
        if (watchHistory.length > 0) {
          const continueWatchingMovies = await Promise.all(
            watchHistory.slice(0, 4).map(async (watchEntry) => {
              try {
                const movie = await tmdbAPI.getMovieDetails(watchEntry.movieId);
                return {
                  id: movie.id,
                  title: movie.title,
                  poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  progress: watchEntry.progress,
                  duration: watchEntry.duration,
                  timeLeft: Math.round((watchEntry.duration * (100 - watchEntry.progress)) / 100)
                };
              } catch (error) {
                console.error(`Error fetching movie ${watchEntry.movieId}:`, error);
                return null;
              }
            })
          );
          setContinueWatching(continueWatchingMovies.filter(movie => movie !== null));
        }
        
        // Create personalized recommendations based on user's watch history
        if (watchHistory.length > 0) {
          // Get user's most watched genres
          const genreCounts: { [key: string]: number } = {};
          for (const entry of watchHistory) {
            try {
              const movie = await tmdbAPI.getMovieDetails(entry.movieId);
              movie.genres.forEach((genre: any) => {
                genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
              });
            } catch (error) {
              console.error(`Error fetching movie details for recommendations:`, error);
            }
          }
          
          // Get top genres and fetch movies from those genres
          const topGenres = Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([genre]) => genre);
          
          if (topGenres.length > 0) {
            const recommendedMovies = await tmdbAPI.getPopularMovies(1);
            const filteredRecommendations = recommendedMovies
              .filter((movie: any) => 
                movie.genre && topGenres.some(genre => 
                  movie.genre.toLowerCase().includes(genre.toLowerCase())
                )
              )
              .slice(0, 3);
            setRecommendations(filteredRecommendations);
          } else {
            setRecommendations(topRated.slice(0, 3));
          }
        } else {
          setRecommendations(topRated.slice(0, 3));
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [watchHistory]);

  // Auto-rotate featured movies
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
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
  }, [carouselWidth, featuredMovies.length]);

  const navigateToMovieDetails = (movieId: number) => {
    router.push(`/movie-details?id=${movieId}`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch data from API
      const trending = await tmdbAPI.getTrendingMovies('week', 1);
      setFeaturedMovies(trending.slice(0, 5));
      
      const popular = await tmdbAPI.getPopularMovies(1);
      setTrendingMovies(popular.slice(0, 4).map((movie: any) => ({
        ...movie,
        trailerUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        trailerDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })));
      
      const topRated = await tmdbAPI.getTopRatedMovies(1);
      setPopularMovies(topRated.slice(0, 3));
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const featured = featuredMovies[currentFeatured];

  // Show loading state
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <Box className="flex-1 bg-gray-950 items-center justify-center">
          <Text className="text-white text-lg">Loading movies...</Text>
        </Box>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <Box className="flex-1 bg-gray-950 items-center justify-center px-4">
          <Text className="text-red-400 text-lg text-center mb-4">{error}</Text>
          <Button className="bg-blue-500" onPress={() => window.location.reload()}>
            <ButtonText className="text-white">Retry</ButtonText>
          </Button>
        </Box>
      </View>
    );
  }

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
                {userData.user?.name || 'Guest'}
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
          {featuredMovies.length > 0 && (
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
                            className={isBookmarked(movie.id) ? "text-blue-400 fill-blue-400" : "text-gray-400"}
                          />
                        </Pressable>
                      </HStack>
                    </VStack>
                  </Box>
                </Pressable>
              ))}
            </ScrollView>
          </Box>
          )}

          {/* Continue Watching - User Specific */}
          {continueWatching.length > 0 && (
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
                  {continueWatching.map((movie) => (
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
                            style={{ width: `${movie.progress}%` }}
                          />
                        </Box>
                        <Box className="absolute bottom-6 left-0 right-0 p-3">
                          <VStack className="gap-1">
                            <Text className="text-white font-medium" numberOfLines={1}>
                              {movie.title}
                            </Text>
                            <HStack className="items-center gap-2">
                              <Text className="text-gray-400 text-xs">
                                {movie.timeLeft} min left
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
          )}

          {/* Trending Movies */}
          {trendingMovies.length > 0 && (
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
                          className={isBookmarked(movie.id) ? "text-blue-400 fill-blue-400" : "text-white"}
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
          )}

          {/* Trending Trailers */}
          {trendingMovies.length > 0 && (
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
          )}

          {/* Recommendations - User Specific */}
          {recommendations.length > 0 && (
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
                  {recommendations.map((movie) => (
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
                          className={isBookmarked(movie.id) ? "text-blue-400 fill-blue-400" : "text-white"}
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
          )}

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