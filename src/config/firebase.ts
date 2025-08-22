import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKuv0VKUNQergtbyg1UgsiKK_oA4W-2rc",
  authDomain: "canteen-7c2ac.firebaseapp.com",
  projectId: "canteen-7c2ac",
  storageBucket: "canteen-7c2ac.firebasestorage.app",
  messagingSenderId: "765006965253",
  appId: "1:765006965253:web:77542c3707d3af17be4a6c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);