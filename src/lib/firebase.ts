// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// =================================================================================================
// IMPORTANT: PASTE YOUR FIREBASE CONFIG OBJECT HERE TO FIX THE CONNECTION ERROR
// You can get this from your Firebase project settings.
//
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project.
// 3. Click the gear icon ⚙️ -> Project settings.
// 4. In the "General" tab, scroll down to "Your apps".
// 5. Click on your web app, then select "Config" to see the firebaseConfig object.
// 6. Copy the entire object and paste it here, replacing the placeholder below.
// =================================================================================================
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Only initialize Firebase if the config is not using placeholder values
if (!firebaseConfig.apiKey.startsWith("PASTE_YOUR")) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
    console.warn("*****************************************************************");
    console.warn("FIREBASE CONFIGURATION IS MISSING!");
    console.warn("Please paste your Firebase project's config object into 'src/lib/firebase.ts'");
    console.warn("The app will not connect to Firestore until this is updated.");
    console.warn("*****************************************************************");
}


export { app, db };
