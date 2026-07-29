import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBLbftyk3vIxLs-ALDfgWppeZ677v65IpA",
  authDomain: "wedding-catalog-b5ffe.firebaseapp.com",
  databaseURL: "https://wedding-catalog-b5ffe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-catalog-b5ffe",
  storageBucket: "wedding-catalog-b5ffe.firebasestorage.app",
  messagingSenderId: "533244849758",
  appId: "1:533244849758:web:5f466672eb81d3e5270ecf",
  measurementId: "G-72F5ZY87TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
