import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGCSf-kRu_R3YKkdHPZgVS9KAaOMY8RoQ",
  authDomain: "vinder-9f5d2.firebaseapp.com",
  projectId: "vinder-9f5d2",
  storageBucket: "vinder-9f5d2.appspot.com",
  messagingSenderId: "172415882777",
  appId: "1:172415882777:web:463a9fd383efae724c7c88",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db, auth };
