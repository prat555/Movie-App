import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
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
  Filter,
  Search,
  Star
} from "lucide-react-native";
import React, { useMemo, useState } from 'react';

// Mock data for all movies
const allMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=600&fit=crop",
    rating: 8.5,
    genre: "Sci-Fi",
    duration: "166 min",
    year: "2024",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    trending: true
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    poster: "https://images.unsplash.com/photo-1489599815540-4c069a1e3ea0?w=400&h=600&fit=crop",
    rating: 8.2,
    genre: "Action",
    duration: "130 min",
    year: "2022",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs.",
    trending: true
  },
  {
    id: 3,
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
    rating: 7.6,
    genre: "Adventure",
    duration: "192 min",
    year: "2022",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    trending: true
  },
  {
    id: 4,
    title: "Spider-Man: No Way Home",
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=600&fit=crop",
    rating: 8.4,
    genre: "Adventure",
    duration: "148 min",
    year: "2021",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help.",
    trending: true
  },
  {
    id: 5,
    title: "No Time to Die",
    poster: "https://images.unsplash.com/photo-1489599815540-4c069a1e3ea0?w=400&h=600&fit=crop",
    rating: 7.3,
    genre: "Action",
    duration: "163 min",
    year: "2021",
    description: "James Bond has left active service. His peace is short-lived when Felix Leiter turns up asking for help.",
    trending: false
  },
  {
    id: 6,
    title: "The Batman",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 7.8,
    genre: "Action",
    duration: "176 min",
    year: "2022",
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham.",
    trending: false
  },
  {
    id: 7,
    title: "Black Panther: Wakanda Forever",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
    rating: 7.2,
    genre: "Adventure",
    duration: "161 min",
    year: "2022",
    description: "The people of Wakanda fight to protect their home from intervening world powers.",
    trending: false
  },
  {
    id: 8,
    title: "Doctor Strange in the Multiverse of Madness",
    poster: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=600&fit=crop",
    rating: 7.0,
    genre: "Adventure",
    duration: "126 min",
    year: "2022",
    description: "Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse.",
    trending: false
  },
  {
    id: 9,
    title: "Thor: Love and Thunder",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 6.8,
    genre: "Adventure",
    duration: "119 min",
    year: "2022",
    description: "Thor enlists the help of Valkyrie, Korg and ex-girlfriend Jane Foster to fight Gorr the God Butcher.",
    trending: false
  },
  {
    id: 10,
    title: "Black Adam",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
    rating: 6.3,
    genre: "Action",
    duration: "125 min",
    year: "2022",
    description: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods.",
    trending: false
  }
];

const categories = ["All", "Action", "Adventure", "Drama", "Sci-Fi", "Comedy", "Horror", "Romance"];

export default function AllMovies() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedMovies, setBookmarkedMovies] = useState<number[]>([2, 4, 5]);
  const [sortBy, setSortBy] = useState<"rating" | "year" | "title">("rating");

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