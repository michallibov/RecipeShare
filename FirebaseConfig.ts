// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2UxWdeWyI7L2PCY8GeJYZbl7HRqrTsUA",
  authDomain: "donewithit-f4d7f.firebaseapp.com",
  projectId: "donewithit-f4d7f",
  storageBucket: "donewithit-f4d7f.appspot.com",
  messagingSenderId: "91135477271",
  appId: "1:91135477271:web:ab3a4f755f2889c983fe52",
  measurementId: "G-GL8KSBHVBT"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  
export const FIREBASE_DB = getFirestore(FIREBASE_APP);