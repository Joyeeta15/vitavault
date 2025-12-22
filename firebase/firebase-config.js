// firebase/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMBXooTuzQFwrpAOxZPJLxPfkNs6c1emk",
  authDomain: "vitavault-596ea.firebaseapp.com",
  projectId: "vitavault-596ea",
  storageBucket: "vitavault-596ea.appspot.com",
  appId: "1:638821537238:web:3da3088d7ac43a45054077",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
