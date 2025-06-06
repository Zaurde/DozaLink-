import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDREoEi2SvvLJbhWmPLX1NCx7AFVd-etyU",
  authDomain: "kleinanzeigen-62bc9.firebaseapp.com",
  projectId: "kleinanzeigen-62bc9",
  storageBucket: "kleinanzeigen-62bc9.firebasestorage.app",
  messagingSenderId: "97228552209",
  appId: "1:97228552209:web:28ca2e1a88859f3cf399b0",
  measurementId: "G-K4PLL0TJHN"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 