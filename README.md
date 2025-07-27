# Movie App

A React Native movie app built with Expo, powered by TMDB API and Firebase authentication.

## Features

- **Real Movie Data**: Browse movies using the TMDB API
- **User Authentication**: Secure login/signup with Firebase
- **Movie Details**: Comprehensive information including cast, crew, ratings
- **Personalization**: Like and save your favorite movies
- **Modern UI**: Dark theme with responsive design
- **Offline Support**: Cached data for better performance

## Screenshots

<p align="center">
  <img src="assets/screenshots/4.jpg" width="24%" />
  <img src="assets/screenshots/2.jpg" width="24%" />
  <img src="assets/screenshots/1.jpg" width="24%" />
  <img src="assets/screenshots/3.jpg" width="24%" />
</p>

## Getting Started

### Prerequisites

- TMDB API key (get from [TMDB](https://www.themoviedb.org/settings/api))
- Firebase configuration (set up at [Firebase Console](https://console.firebase.google.com/))

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with your API keys:

```env
TMDB_API_KEY=your_tmdb_api_key_here
FIREBASE_API_KEY=your_firebase_config_values
FIREBASE_AUTH_DOMAIN=your_firebase_config_values
FIREBASE_PROJECT_ID=your_firebase_config_values
# Add other Firebase config values as needed
```

### 3. Start the App

```bash
npx expo start
```

## Project Structure

```
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── movie-details.tsx
│   └── auth/               # Authentication screens
│       ├── login.tsx
│       └── signup.tsx
├── components/
│   └── ui/
├── services/
│   ├── tmdb.ts             # TMDB API service
│   └── firebase.ts         # Firebase service
└── hooks/                  # Custom hooks
    ├── use-auth.ts
    └── use-movies.ts
```

## Key Technologies

- **React Native** with **Expo** for cross-platform development
- **TMDB API** for real movie data
- **Firebase Authentication** for secure user management
- **React Navigation** for seamless screen transitions
- **React Query** for efficient data fetching and caching

## Configuration

To use this app, you'll need to:

1. Create a TMDB account and get an API key
2. Set up a Firebase project and configure Authentication
3. Add your configuration details to the `.env` file

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
