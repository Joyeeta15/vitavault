import { auth, db } from "../../firebase/firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

console.log("editprofile.js loaded ✅");

const form = document.getElementById("profileForm");

/* ---------------- LOAD USER DATA ---------------- */

onAuthStateChanged(auth, async (user) => {


    
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();

    // Set name beside profile picture
const profileNameEl = document.getElementById("profileName");
if (profileNameEl) {
  profileNameEl.innerText = data.name || "User";
}


    // Fetch name & email from Firestore
const fullName = data.name || "User";
const email = user.email; // always from Auth



// Set sidebar name
const nameEl = document.getElementById("dashboardName");
if (nameEl) nameEl.innerText = fullName;

// Set sidebar email
const emailEl = document.getElementById("dashboardEmail");
if (emailEl) emailEl.innerText = email;

// Set avatar letter (first letter of name)
const avatarEl = document.getElementById("avatarLetter");
if (avatarEl) avatarEl.innerText = fullName.charAt(0).toUpperCase();


    // Auto-fill inputs
    document.getElementById("name").value = data.name || "";
    document.getElementById("dob").value = data.dob || "";
    document.getElementById("gender").value = data.gender || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("address").value = data.address || "";

    document.getElementById("bloodGroup").value = data.bloodGroup || "";
    document.getElementById("height").value = data.height || "";
    document.getElementById("weight").value = data.weight || "";

    document.getElementById("emergencyName").value = data.emergencyName || "";
    document.getElementById("relationship").value = data.relationship || "";
    document.getElementById("emergencyPhone").value = data.emergencyPhone || "";
    
  }
});

/* ---------------- SAVE USER DATA ---------------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: document.getElementById("name").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,

        bloodGroup: document.getElementById("bloodGroup").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,

        emergencyName: document.getElementById("emergencyName").value,
        relationship: document.getElementById("relationship").value,
        emergencyPhone: document.getElementById("emergencyPhone").value,

        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    alert("Profile updated successfully ✅");

  } catch (error) {
    alert(error.message);
  }
});
