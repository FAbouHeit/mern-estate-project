// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-project.firebaseapp.com",
  projectId: "mern-estate-project",
  storageBucket: "mern-estate-project.appspot.com",
  messagingSenderId: "911250805167",
  appId: "1:911250805167:web:cc91a7370a607fe9e39f5a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);