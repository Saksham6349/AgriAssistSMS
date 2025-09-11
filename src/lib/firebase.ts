
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let db: Firestore;

// Initialize Firebase App
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error", error);
}

// Initialize Firestore safely
const getDb = () => {
  if (!db) {
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({})
      });
    } catch (error) {
      console.error("Firestore initialization error", error);
      // Fallback to in-memory persistence if indexedDB fails
      try {
        db = getFirestore(app);
      } catch (e) {
        console.error("Fallback Firestore initialization failed", e);
        db = null as any;
      }
    }
  }
  return db;
};

// Check for client side before initializing Firestore
if (typeof window !== 'undefined') {
  db = getDb();
}

export { app, db };
