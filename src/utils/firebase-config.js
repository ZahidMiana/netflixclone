// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIQKV04ipxw7aQol9yWM-G8KnVO3CZKMU",
  authDomain: "react-netflix-clone-29d13.firebaseapp.com",
  projectId: "react-netflix-clone-29d13",
  storageBucket: "react-netflix-clone-29d13.firebasestorage.app",
  messagingSenderId: "113338194300",
  appId: "1:113338194300:web:3b0d9672a80013595c6cf9",
  measurementId: "G-JQG8Y14M46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
