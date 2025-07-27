# 🎬 Xylo Movie App - React Native

A feature-rich React Native movie application built with Expo, powered by TMDB API and Firebase Authentication.

![App Screenshots](assets/screenshots/1.jpg)

## ✨ Key Features

### 🎥 Movie Discovery
- **Trending, Popular & Top-rated** movies sections
- **Detailed movie pages** with runtime, ratings, cast, and trailers
- **Advanced search** with filters
- **Watch trailers** directly in-app

### 🔒 User Experience
- **Secure authentication** with Firebase
- **Personalized watchlist** and bookmarks
- **Continue watching** progress tracking
- **Viewing history** log

### 🎨 Modern UI/UX
- **Dark theme** interface with smooth animations
- **Interactive carousels** for featured content
- **Responsive design** for all device sizes
- **Intuitive navigation** and gestures

## 📸 Screenshots

<div align="center">
  <img src="assets/screenshots/4.jpg" width="24%" alt="Home Screen" />
  <img src="assets/screenshots/2.jpg" width="24%" alt="Movie Details" />
  <img src="assets/screenshots/1.jpg" width="24%" alt="Search" />
  <img src="assets/screenshots/3.jpg" width="24%" alt="Watchlist" />
</div>

## 🏗 Project Structure

```bash
movie-app/
├── app/                  # Main application screens
│   ├── _layout.tsx       # Root layout
│   ├── index.tsx         # Home screen
│   ├── all-movies.tsx    # Movies catalog
│   ├── movie-details.tsx # Single movie view
│   ├── bookmarks.tsx     # Saved content
│   └── auth/            # Authentication flows
├── components/           # Reusable components
│   ├── movie/           # Movie components
│   └── ui/              # UI elements
├── lib/                  # Core services
│   ├── tmdb.ts          # TMDB API client
│   └── firebase.ts      # Firebase integration
├── constants/           # App constants
├── hooks/               # Custom hooks
└── assets/              # Static resources
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- Expo CLI (`npm install -g expo-cli`)
- TMDB API key ([Get yours](https://www.themoviedb.org/settings/api))
- Firebase project ([Setup guide](https://firebase.google.com/docs/web/setup))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-app.git
cd movie-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your credentials:
```env
TMDB_API_KEY=your_api_key_here
FIREBASE_API_KEY=your_firebase_config
# ... other Firebase configs
```

4. Start the development server:
```bash
npx expo start
```

## 🌐 API Integration

The app leverages TMDB's comprehensive API:

| Endpoint | Description |
|----------|-------------|
| `/trending` | Daily/weekly trending content |
| `/movie/popular` | Currently popular movies |
| `/movie/top_rated` | Highest rated movies |
| `/movie/{id}` | Detailed movie information |
| `/search/movie` | Movie search functionality |

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
