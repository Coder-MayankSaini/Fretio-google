import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyBQaM9FXbmmGLRf0k1gL27ydm6v-U7CO-I",
  authDomain: "fretio-820b6.firebaseapp.com",
  projectId: "fretio-820b6",
  storageBucket: "fretio-820b6.firebasestorage.app",
  messagingSenderId: "1024229000130",
  appId: "1:1024229000130:web:63304c2b7f77b4cbd00c5b",
  measurementId: "G-J33M3PTSHW"
};

const app = initializeApp(firebaseConfig);

// Export services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);