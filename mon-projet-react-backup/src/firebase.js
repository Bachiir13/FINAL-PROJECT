// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkIs3y17Ck0GYbw_bwK0jeZkxU3Yuy7SQ",
  authDomain: "projet-final-62a74.firebaseapp.com",
  projectId: "projet-final-62a74",
  storageBucket: "projet-final-62a74.firebasestorage.app",
  messagingSenderId: "166150147143",
  appId: "1:166150147143:web:da1dde7e9b806859d0f562",
  measurementId: "G-4CWX5NJVKW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
