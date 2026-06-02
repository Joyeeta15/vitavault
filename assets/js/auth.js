// auth.js

import { auth, db } from "../../firebase/firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

console.log("auth.js loaded");

const provider = new GoogleAuthProvider();

/* ================= GOOGLE LOGIN ================= */
document.getElementById("googleBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const result = await signInWithPopup(auth, provider);
const user = result.user;

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,
    name: user.displayName || user.email.split("@")[0],
    email: user.email,
    lastLogin: serverTimestamp()
  },
  { merge: true }
);

window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.code + " : " + error.message);
  }
});

/* ================= EMAIL LOGIN ================= */
document.getElementById("loginBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // 🔥 Redirect immediately
    window.location.href = "dashboard.html";

    // 🔥 Update last login in Firestore (background)
    setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp()
      },
      { merge: true }
    ).catch(console.error);

  } catch (error) {
    alert(error.code + " : " + error.message);
  }
});
