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
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bookmark,
    Cast,
    Check,
    Clock,
    Download,
    Play,
    Star,
    Youtube
} from "lucide-react-native";
import React, { useState } from 'react';
import { Linking } from 'react-native';

// Mock movie data
const movieData = {
  id: 1,
  title: "Dune: Part Two",
  poster: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=600&fit=crop",
  backdrop: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800&h=400&fit=crop",
  rating: 8.5,
  genre: "Sci-Fi",
  duration: "166 min",
  year: "2024",
  director: "Denis Villeneuve",
  cast: [
    {
      name: "Timothée Chalamet",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Zendaya",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rebecca Ferguson",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Javier Bardem",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Josh Brolin",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Stellan Skarsgård",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Charlotte Rampling",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ],
  description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. As he tries to prevent a terrible future, he must reconcile the loves of his life with the fate of the universe.",
  longDescription: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. As he tries to prevent a terrible future, he must reconcile the loves of his life with the fate of the universe. The film explores themes of destiny, power, and the consequences of choice in a complex political landscape.",
  trailerUrl: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
  liked: false
};

export default function MovieDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = params.id ? parseInt(params.id as string) : 1;
  
  // State for user interactions
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Use mock data
  const movie = movieData;

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
    }, 2000);
  };

  const handleWatchTrailer = () => {
    if (movie.trailerUrl) {
      Linking.openURL(movie.trailerUrl);
    }
  };

  return (
    <Box className="flex-1 bg-gray-950">
      {/* Header with Back Button */}
      <Box className="absolute top-12 left-4 right-4 z-10">
        <HStack className="items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="bg-black/50 p-3 rounded-full"
          >
            <Icon as={ArrowLeft} size="lg" className="text-white" />
          </Pressable>
          <HStack className="gap-3">
            <Pressable
              className="bg-black/50 p-3 rounded-full"
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Icon
                as={Bookmark}
                size="lg"
                className={isBookmarked ? "text-blue-500 fill-blue-500" : "text-white"}
              />
            </Pressable>
            <Pressable className="bg-black/50 p-3 rounded-full" onPress={() => router.push('/device-connection')}> 
              <Icon as={Cast} size="lg" className="text-white" />
            </Pressable>
          </HStack>
        </HStack>
      </Box>

      <ScrollView className="flex-1">
        {/* Hero Section */}
        <Box className="relative h-96">
          <Image
            source={{ uri: movie.backdrop }}
            alt={movie.title}
            className="w-full h-full"
          />
          <Box className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          
          {/* Movie Info Overlay */}
          <Box className="absolute bottom-0 left-0 right-0 p-6">
            <VStack className="gap-4">
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
              
              <Heading size="2xl" className="text-white font-bold">
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
            </VStack>
          </Box>
        </Box>

        {/* Content */}
        <VStack className="p-6 gap-6">
          {/* Action Buttons */}
          <VStack className="gap-3">
            <HStack className="gap-3">
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-full flex-1">
                <Icon as={Play} size="sm" className="text-white mr-2" />
                <ButtonText className="text-white font-medium">
                  Watch Now
                </ButtonText>
              </Button>
            </HStack>
            
            {/* Watch Trailer Button */}
            <Button 
              variant="outline" 
              className="border-gray-700 rounded-full"
              onPress={handleWatchTrailer}
            >
              <Icon as={Youtube} size="sm" className="text-red-500 mr-2" />
              <ButtonText className="text-white font-medium">
                Watch Trailer
              </ButtonText>
            </Button>
            
            {/* Download Button */}
            <Button 
              variant="outline" 
              className={`border-gray-700 rounded-full ${isDownloaded ? 'bg-green-500/20 border-green-500' : ''}`}
              onPress={handleDownload}
              disabled={isDownloading || isDownloaded}
            >
              <Icon 
                as={isDownloaded ? Check : Download} 
                size="sm" 
                className={`mr-2 ${isDownloaded ? 'text-green-400' : 'text-white'}`} 
              />
              <ButtonText className={`font-medium ${isDownloaded ? 'text-green-400' : 'text-white'}`}>
                {isDownloading ? 'Downloading...' : isDownloaded ? 'Downloaded' : 'Download'}
              </ButtonText>
            </Button>
          </VStack>

          {/* Synopsis */}
          <VStack className="gap-3">
            <Heading size="lg" className="text-white">
              Synopsis
            </Heading>
            <Text className="text-gray-300 leading-6">
              {movie.longDescription}
            </Text>
          </VStack>

          {/* Director */}
          <VStack className="gap-3">
            <Heading size="lg" className="text-white">
              Director
            </Heading>
            <Text className="text-gray-300">
              {movie.director}
            </Text>
          </VStack>

          {/* Cast */}
          <VStack className="gap-3">
            <Heading size="lg" className="text-white">
              Cast
            </Heading>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="gap-4 px-1">
                {movie.cast.map((actor, index) => (
                  <VStack key={index} className="items-center gap-2 min-w-20">
                    <Image
                      source={{ uri: actor.photo }}
                      alt={actor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <Text className="text-gray-300 text-sm text-center max-w-20">
                      {actor.name}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Additional Info */}
          <VStack className="gap-4">
            <Heading size="lg" className="text-white">
              Details
            </Heading>
            <VStack className="gap-3">
              <HStack className="items-center justify-between">
                <Text className="text-gray-400">Release Year</Text>
                <Text className="text-white">{movie.year}</Text>
              </HStack>
              <HStack className="items-center justify-between">
                <Text className="text-gray-400">Duration</Text>
                <Text className="text-white">{movie.duration}</Text>
              </HStack>
              <HStack className="items-center justify-between">
                <Text className="text-gray-400">Genre</Text>
                <Text className="text-white">{movie.genre}</Text>
              </HStack>
              <HStack className="items-center justify-between">
                <Text className="text-gray-400">Rating</Text>
                <HStack className="items-center gap-1">
                  <Icon as={Star} size="sm" className="text-yellow-400 fill-yellow-400" />
                  <Text className="text-white">{movie.rating}/10</Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
} 