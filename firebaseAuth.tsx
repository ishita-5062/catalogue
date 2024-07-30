// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-AewnD40RrKDFODxuA38-7LrEuvMu1bw",
  authDomain: "catalogue-a9b2f.firebaseapp.com",
  projectId: "catalogue-a9b2f",
  storageBucket: "catalogue-a9b2f.appspot.com",
  messagingSenderId: "1077369271124",
  appId: "1:1077369271124:web:6ac1773f241c6727cd4ec1"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
