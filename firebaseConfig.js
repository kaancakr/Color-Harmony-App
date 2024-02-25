// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZUHp4Wnho-5yND1ncsVyd1D_GDbZQbLo",
  authDomain: "color-harmony-7f03d.firebaseapp.com",
  projectId: "color-harmony-7f03d",
  storageBucket: "color-harmony-7f03d.appspot.com",
  messagingSenderId: "419843001672",
  appId: "1:419843001672:web:19290b854f96c641eff77d",
  measurementId: "G-394G0T1WRB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
