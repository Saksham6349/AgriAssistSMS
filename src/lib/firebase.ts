
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSr_Ak6hH3aoCHhzMCJJMUwVbT2MSZ6N0",
  authDomain: "agri-assist-7aca4.firebaseapp.com",
  projectId: "agri-assist-7aca4",
  storageBucket: "agri-assist-7aca4.appspot.com",
  messagingSenderId: "384682277906",
  appId: "1:384682277906:web:8e6eaf5448fab73841eccb",
  measurementId: "G-W7PEKQ18V0"
};

let app: FirebaseApp;
let db: Firestore;

// Initialize Firebase
try {
  // This prevents re-initializing the app on hot reloads
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Initialize Firestore with offline persistence.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({})
  });

} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Set db to null if initialization fails to prevent the app from crashing.
  db = null as any; 
}

export { app, db };
