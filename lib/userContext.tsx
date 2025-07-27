import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface WatchHistory {
  movieId: number;
  progress: number; // 0-100 percentage
  lastWatched: string;
  duration: number; // total duration in minutes
}

interface UserData {
  user: User | null;
  bookmarks: number[];
  watchHistory: WatchHistory[];
  preferences: {
    favoriteGenres: string[];
    preferredLanguage: string;
  };
}

interface UserContextType {
  userData: UserData;
  login: (user: User) => void;
  logout: () => void;
  toggleBookmark: (movieId: number) => void;
  updateWatchProgress: (movieId: number, progress: number, duration: number) => void;
  getBookmarks: () => number[];
  getWatchHistory: () => WatchHistory[];
  isBookmarked: (movieId: number) => boolean;
  getWatchProgress: (movieId: number) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    user: null,
    bookmarks: [],
    watchHistory: [],
    preferences: {
      favoriteGenres: [],
      preferredLanguage: 'en'
    }
  });

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = (user: User) => {
    const newUserData = {
      ...userData,
      user
    };
    setUserData(newUserData);
    saveUserData(newUserData);
  };

  const logout = () => {
    const newUserData = {
      user: null,
      bookmarks: [],
      watchHistory: [],
      preferences: {
        favoriteGenres: [],
        preferredLanguage: 'en'
      }
    };
    setUserData(newUserData);
    saveUserData(newUserData);
  };

  const toggleBookmark = (movieId: number) => {
    const newBookmarks = userData.bookmarks.includes(movieId)
      ? userData.bookmarks.filter(id => id !== movieId)
      : [...userData.bookmarks, movieId];
    
    const newUserData = {
      ...userData,
      bookmarks: newBookmarks
    };
    setUserData(newUserData);
    saveUserData(newUserData);
  };

  const updateWatchProgress = (movieId: number, progress: number, duration: number) => {
    const existingIndex = userData.watchHistory.findIndex(item => item.movieId === movieId);
    const newWatchHistory = [...userData.watchHistory];
    
    const watchEntry: WatchHistory = {
      movieId,
      progress: Math.min(progress, 100),
      lastWatched: new Date().toISOString(),
      duration
    };

    if (existingIndex >= 0) {
      newWatchHistory[existingIndex] = watchEntry;
    } else {
      newWatchHistory.push(watchEntry);
    }

    const newUserData = {
      ...userData,
      watchHistory: newWatchHistory
    };
    setUserData(newUserData);
    saveUserData(newUserData);
  };

  const getBookmarks = () => userData.bookmarks;
  
  const getWatchHistory = () => userData.watchHistory;
  
  const isBookmarked = (movieId: number) => userData.bookmarks.includes(movieId);
  
  const getWatchProgress = (movieId: number) => {
    const watchEntry = userData.watchHistory.find(item => item.movieId === movieId);
    return watchEntry ? watchEntry.progress : 0;
  };

  const value: UserContextType = {
    userData,
    login,
    logout,
    toggleBookmark,
    updateWatchProgress,
    getBookmarks,
    getWatchHistory,
    isBookmarked,
    getWatchProgress
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 