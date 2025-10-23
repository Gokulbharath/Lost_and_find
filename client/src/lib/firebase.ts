import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9nMMg7gfq5oP-MFnVxHXKQLtREZp5TOM",
  authDomain: "quizzz-cfca6.firebaseapp.com",
  projectId: "quizzz-cfca6",
  storageBucket: "quizzz-cfca6.firebasestorage.app",
  messagingSenderId: "559427296081",
  appId: "1:559427296081:web:5efac23b522e046c211170",
  measurementId: "G-9PZG9PD2L3",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
