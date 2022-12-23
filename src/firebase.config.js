// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYCdUo1XgAm8tLdMVT0jJImr2R0C-kBHU",
  authDomain: "house-marketplace-app-e83fa.firebaseapp.com",
  projectId: "house-marketplace-app-e83fa",
  storageBucket: "house-marketplace-app-e83fa.appspot.com",
  messagingSenderId: "962649960689",
  appId: "1:962649960689:web:8e83aa811ff1c7c9b73950"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()