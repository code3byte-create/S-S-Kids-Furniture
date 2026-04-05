// 1. Firebase ki zaroori cheezen import karna
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Database ke liye
import { getAuth } from "firebase/auth"; // Login ke liye
import { getStorage } from "firebase/storage"; // Images ke liye

// 2. Aapki Secret Configuration (Ise Firebase Console se copy karke replace karen)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPBaHUoEvxrOG8ZuEc6ppdg5M7Mkh_Krs",
  authDomain: "faizi-kids-furniture.firebaseapp.com",
  projectId: "faizi-kids-furniture",
  storageBucket: "faizi-kids-furniture.firebasestorage.app",
  messagingSenderId: "657683261100",
  appId: "1:657683261100:web:b4f277e9f8b80c438fa109",
};

// 3. Firebase Engine Start karna
const app = initializeApp(firebaseConfig);

// 4. Tools ko export karna taake puri app me use ho saken
export const db = getFirestore(app); // Database (Firestore)
export const auth = getAuth(app); // Authentication
export const storage = getStorage(app); // Storage (Images)

export default app;
