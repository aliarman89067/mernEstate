// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-estate-second.firebaseapp.com",
  projectId: "mern-estate-second",
  storageBucket: "mern-estate-second.appspot.com",
  messagingSenderId: "609767027619",
  appId: "1:609767027619:web:e69b9514d6c95dbab8e016",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
