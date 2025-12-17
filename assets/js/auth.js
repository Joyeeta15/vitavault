import { auth } from "../../firebase/firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

alert("auth.js loaded ✅");

const provider = new GoogleAuthProvider();

// GOOGLE LOGIN
document.getElementById("googleBtn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Welcome " + result.user.displayName);
    })
    .catch((error) => {
      alert(error.code + " : " + error.message);
    });
});

// EMAIL LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful 🎉");
    })
    .catch((error) => {
      alert(error.code + " : " + error.message);
    });
});
