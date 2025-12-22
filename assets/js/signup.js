import { auth, db } from "../../firebase/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

console.log("signup.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  /* ================= EMAIL SIGNUP ================= */
  document.getElementById("signupBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const termsChecked = document.getElementById("terms").checked;

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!termsChecked) {
      alert("Please accept Terms & Privacy Policy");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 🔥 REDIRECT FIRST
      window.location.href = "dashboard.html";

      // 🔥 SAVE USER DATA IN BACKGROUND
      setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: email.split("@")[0],
        email: user.email,
        createdAt: serverTimestamp()
      }).catch(console.error);

    } catch (error) {
      alert(error.code + " : " + error.message);
    }
  });

  /* ================= GOOGLE SIGNUP ================= */
  const provider = new GoogleAuthProvider();

  document.getElementById("googleSignup").addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Google button clicked");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔥 REDIRECT FIRST (THIS FIXES YOUR ISSUE)
      window.location.href = "dashboard.html";

      // 🔥 SAVE USER DATA IN BACKGROUND
      setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
          createdAt: serverTimestamp()
        },
        { merge: true }
      ).catch(console.error);

    } catch (error) {
      alert(error.code + " : " + error.message);
    }
  });

});
