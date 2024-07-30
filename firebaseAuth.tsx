// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "firebase_domain",
  projectId: "catalogue-a9b2f",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "add_id"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
