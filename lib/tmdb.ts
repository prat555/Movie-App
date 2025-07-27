import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN, TMDB_API_KEY } from '@env';

// TMDB API Configuration

// Types for TMDB API responses
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBMovieCredits {
  id: number;
  cast: TMDBCastMember[];
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

// Genre mapping
const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Helper function to get full image URL
const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get genre name from genre IDs
const getGenreName = (genreIds: number[]): string => {
  if (!genreIds || genreIds.length === 0) return 'Unknown';
  const firstGenre = genreMap[genreIds[0]];
  return firstGenre || 'Unknown';
};

// Helper function to format movie data for the app
export const formatMovieForApp = (movie: TMDBMovie) => ({
  id: movie.id,
  title: movie.title,
  poster: getImageUrl(movie.poster_path, 'w500'),
  backdrop: getImageUrl(movie.backdrop_path, 'w1280'),
  rating: Math.round(movie.vote_average * 10) / 10,
  genre: getGenreName(movie.genre_ids),
  duration: 'Unknown', // Runtime requires movie details API call
  year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
  description: movie.overview,
  liked: false
});

// API request helper
const makeRequest = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  // Add API key as query parameter
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// TMDB API functions
export const tmdbAPI = {
  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
    const response = await makeRequest('/trending/movie/week', {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    const response = await makeRequest('/movie/popular', {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    const response = await makeRequest('/movie/top_rated', {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    const response = await makeRequest('/movie/now_playing', {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    const response = await makeRequest('/movie/upcoming', {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<TMDBMovieDetails> => {
    return await makeRequest(`/movie/${movieId}`);
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (movieId: number): Promise<TMDBMovieCredits> => {
    return await makeRequest(`/movie/${movieId}/credits`);
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId: number): Promise<TMDBVideosResponse> => {
    return await makeRequest(`/movie/${movieId}/videos`);
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1) => {
    const response = await makeRequest('/search/movie', {
      query,
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await makeRequest('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc',
    });
    return response.results.map(formatMovieForApp);
  },

  // Get genres list
  getGenres: async () => {
    const response = await makeRequest('/genre/movie/list');
    return response.genres;
  },

  // Get movie recommendations
  getMovieRecommendations: async (movieId: number, page: number = 1) => {
    const response = await makeRequest(`/movie/${movieId}/recommendations`, {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number, page: number = 1) => {
    const response = await makeRequest(`/movie/${movieId}/similar`, {
      page: page.toString(),
    });
    return response.results.map(formatMovieForApp);
  },
};

// Enhanced movie formatter with additional details
export const formatMovieWithDetails = async (movieId: number) => {
  try {
    const [details, credits, videos] = await Promise.all([
      tmdbAPI.getMovieDetails(movieId),
      tmdbAPI.getMovieCredits(movieId),
      tmdbAPI.getMovieVideos(movieId),
    ]);

    // Find the official trailer
    const trailer = videos.results.find(
      video => video.type === 'Trailer' && video.official
    ) || videos.results.find(video => video.type === 'Trailer');

    return {
      id: details.id,
      title: details.title,
      poster: getImageUrl(details.poster_path, 'w500'),
      backdrop: getImageUrl(details.backdrop_path, 'w1280'),
      rating: Math.round(details.vote_average * 10) / 10,
      genre: details.genres[0]?.name || 'Unknown',
      duration: details.runtime ? `${details.runtime} min` : 'Unknown',
      year: details.release_date ? details.release_date.split('-')[0] : 'Unknown',
      description: details.overview,
      longDescription: details.overview,
      director: credits.crew.find(person => person.job === 'Director')?.name || 'Unknown',
      cast: credits.cast.slice(0, 7).map(actor => ({
        name: actor.name,
        photo: getImageUrl(actor.profile_path, 'w185'),
      })),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      liked: false,
      genres: details.genres,
      runtime: details.runtime,
      releaseDate: details.release_date,
      status: details.status,
      tagline: details.tagline,
      budget: details.budget,
      revenue: details.revenue,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}; 