// import { auth } from "../../firebase/firebase-config.js";
// import { onAuthStateChanged, signOut }
// from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// console.log("dashboard.js loaded");

// document.addEventListener("DOMContentLoaded", () => {

//   onAuthStateChanged(auth, (user) => {
//     console.log("Auth state checked:", user);

//     if (!user) {
//       console.log("No user, redirecting");
//       return; // ❌ DO NOT redirect yet
//     }

//     // User exists
//     const welcomeName = document.getElementById("welcomeName");
//     if (welcomeName) {
//       welcomeName.innerText = user.email.split("@")[0];
//     }
//   });

// });
