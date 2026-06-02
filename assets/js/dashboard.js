import { auth, db } from "../../firebase/firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


import {
    collection,
    getDocs,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Email
  document.getElementById("dashboardEmail").innerText = user.email;

  // Fallback name
  // Fallback name
let fullName = user.email.split("@")[0];

// Fetch Firestore name
const snap = await getDoc(doc(db, "users", user.uid));

if (snap.exists() && snap.data().fullName) {
  fullName = snap.data().fullName;
}

  // Extract first name
  const firstName = fullName.split(" ")[0];

  // Sidebar
  document.getElementById("dashboardName").innerText = fullName;
  document.getElementById("avatarLetter").innerText =
    firstName.charAt(0).toUpperCase();


 
  // Welcome message
  
  
document.getElementById("welcomeName").innerText =
firstName;



  await loadDashboardStats();
  
});


async function loadDashboardStats(){

    const uid = auth.currentUser.uid;

    // Records
    const recordsSnap =
    await getDocs(
        collection(db, "users", uid, "records")
    );

    document.getElementById("totalRecords").textContent =
    recordsSnap.size;

    // Shared Links
    const sharesQuery = query(
        collection(db, "share_records"),
        where("ownerUid", "==", uid)
    );

    const sharesSnap =
    await getDocs(sharesQuery);

    let active = 0;
    let revoked = 0;

    sharesSnap.forEach((doc) => {

        const data = doc.data();

        if(data.status === "active"){
            active++;
        }

        if(data.status === "revoked"){
            revoked++;
        }

    });

    document.getElementById("totalShares").textContent =
    sharesSnap.size;

    document.getElementById("activeShares").textContent =
    active;

    document.getElementById("revokedShares").textContent =
    revoked;
}