import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7ac-IkhbCEXBERLL0K1gdOQ3pVBiSwuQ",
    authDomain: "otp-generation-8ec8d.firebaseapp.com",
    projectId: "otp-generation-8ec8d",
    storageBucket: "otp-generation-8ec8d.firebasestorage.app",
    messagingSenderId: "114820837715",
    appId: "1:114820837715:web:6d24d667279748a57bf1a6",
    measurementId: "G-1PR2ZLSP7L"
  };

// Initialize Firebase with a check to prevent multiple initializations
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    app = getApp(); // Get the existing initialized app if it exists
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig }; 