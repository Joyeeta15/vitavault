import { auth, db } from "../../firebase/firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Email
  document.getElementById("dashboardEmail").innerText = user.email;

  // Fallback name
  let fullName = user.email.split("@")[0];

  // Fetch Firestore name
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && snap.data().name) {
    fullName = snap.data().name;
  }

  // Extract first name
  const firstName = fullName.split(" ")[0];

  // Sidebar
  document.getElementById("dashboardName").innerText = fullName;
  document.getElementById("avatarLetter").innerText =
    firstName.charAt(0).toUpperCase();

  // Welcome message
  document.getElementById("welcomeName").innerText = firstName;
});
