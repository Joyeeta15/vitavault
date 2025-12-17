// firebase/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMBXooTuzQFwrpAOxZPJLxPfkNs6c1emk",
  authDomain: "vitavault-596ea.firebaseapp.com",
  projectId: "vitavault-596ea",
  appId: "1:638821537238:web:3da3088d7ac43a45054077",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
