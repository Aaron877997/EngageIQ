import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Shared Firebase configuration with EngageIQ
const firebaseConfig = {
  apiKey: "AIzaSyA5uTREBqqiasXHMQn67K35NWfq8qDc2LU",
  authDomain: "engageiqv1.firebaseapp.com",
  projectId: "engageiqv1",
  storageBucket: "engageiqv1.firebasestorage.app",
  messagingSenderId: "197140300835",
  appId: "1:197140300835:web:1b75d14100e201c78f5d96",
  measurementId: "G-NLTYPP93R4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
