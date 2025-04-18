// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4_YoA01AN3jEwbQAXyw6Q7GFty1g9BHg",
  authDomain: "t-mart-gowronodi.firebaseapp.com",
  projectId: "t-mart-gowronodi",
  storageBucket: "t-mart-gowronodi.appspot.com",
  messagingSenderId: "1000488120347",
  appId: "1:1000488120347:web:d003c1562051aa2e2d08be",
  measurementId: "G-10M2C230N5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
