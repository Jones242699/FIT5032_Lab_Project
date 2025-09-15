// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmv_xT2IOcQMJ5C5KrVeXQvxbwYfRWn0c",
  authDomain: "week7-junhong.firebaseapp.com",
  projectId: "week7-junhong",
  storageBucket: "week7-junhong.firebasestorage.app",
  messagingSenderId: "165187060655",
  appId: "1:165187060655:web:01a72c27e101d542aa655a"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore()
export default db