import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5gEZaVeBgEV-nW2k30lnfXZELBeMYDqo",
  authDomain: "xyz-app-6048d.firebaseapp.com",
  projectId: "xyz-app-6048d",
  storageBucket: "xyz-app-6048d.appspot.com",
  messagingSenderId: "435383088358",
  appId: "1:435383088358:web:YOUR_WEB_ID"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 