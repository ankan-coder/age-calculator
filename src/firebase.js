// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore functions
import { getAnalytics } from "firebase/analytics"; // Firebase Analytics (optional)
import { getAuth } from 'firebase/auth';

// Firebase configuration object
// const firebaseConfig = {
//   apiKey: "AIzaSyBdo3PA1tcYdRPEp1Sqq_Ru0IWV8E8JDdo",
//   authDomain: "age-calculator-me-122024.firebaseapp.com",
//   projectId: "age-calculator-me-122024",
//   storageBucket: "age-calculator-me-122024.firebasestorage.app",
//   messagingSenderId: "1041780875251",
//   appId: "1:1041780875251:web:dbbb06674becb52a3dbc86",
//   measurementId: "G-YBZFWE10DF",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBdo3PA1tcYdRPEp1Sqq_Ru0IWV8E8JDdo",
  authDomain: "age-calculator-me-122024.firebaseapp.com",
  projectId: "age-calculator-me-122024",
  storageBucket: "age-calculator-me-122024.firebasestorage.app",
  messagingSenderId: "1041780875251",
  appId: "1:1041780875251:web:dbbb06674becb52a3dbc86",
  measurementId: "G-YBZFWE10DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
