import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace these placeholder values with your actual Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyCUYn1n2nKKSsPIjOShFJcFtXekdxxzCsc",
  authDomain: "football-shirt-e507c.firebaseapp.com",
  projectId: "football-shirt-e507c",
  storageBucket: "football-shirt-e507c.firebasestorage.app",
  messagingSenderId: "906665091410",
  appId: "1:906665091410:web:be699bda0ef09e2ec31a8b",
  measurementId: "G-W262X1WF52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
