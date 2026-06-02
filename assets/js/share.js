import { db, auth } from "../../firebase/firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document
.getElementById("viewSharedBtn")
.addEventListener("click", () => {

    const link =
        document.getElementById("sharedLink").value;

    window.location.href = link;

});


document
.getElementById("copyLinkBtn")
.addEventListener("click", async () => {

    const link =
    document.getElementById("generatedLink").value;

    await navigator.clipboard.writeText(link);

    alert("Link copied!");

});

const generateBtn =
document.getElementById("generateLinkBtn");


generateBtn.addEventListener("click", async () => {

    try {

        const doctorEmail =
        document.getElementById("doctorEmail").value.trim();

        const expiresIn =
        document.querySelector("select").value;

        const selectedCategories = [];

// if(document.getElementById("healthRecords").checked){
//     selectedCategories.push("Health Records");
// }

// if(document.getElementById("prescriptions").checked){
//     selectedCategories.push("Prescription");
// }

// if(document.getElementById("reports").checked){
//     selectedCategories.push("Medical Report");
// }

// if(document.getElementById("diagnosis").checked){
//     selectedCategories.push("Diagnosis");
// }


// if(selectedCategories.length === 0){

//     alert("Please select at least one category");

//     return;
// }


// console.log("Selected Categories:", selectedCategories);


        const shareDoc =
        await addDoc(
            collection(db, "share_records"),
            {
                ownerUid: auth.currentUser.uid,
                doctorEmail: doctorEmail,
                expiresIn: expiresIn,
                createdAt: serverTimestamp(),
                status: "active",
                // selectedCategories: selectedCategories,
            }
        );

        const link =
        `${window.location.origin}/pages/shared_view.html?id=${shareDoc.id}`;

        document.getElementById("generatedLink").value = link;

        alert("Secure link generated!");

    }

    catch(error){

    console.error(error);

    alert(error.message);

}

});

window.revokeAccess = async function(shareId){

    try{

        await updateDoc(
            doc(db, "share_records", shareId),
            {
                status: "revoked"
            }
        );

        alert("Access Revoked");

    }

    catch(error){

        console.error(error);

        alert("Failed to revoke access");

    }

}

async function loadSharedLinks() {

    const container =
    document.getElementById("activeLinksContainer");

    const q = query(
        collection(db, "share_records"),
        where("ownerUid", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

if(snapshot.empty){

    container.innerHTML = `
        <div class="empty-links">

            <div class="empty-icon">🔗</div>

            <h3>No Active Links</h3>

            <p>
                Generate a secure link to share
                your medical records.
            </p>

        </div>
    `;

    return;
}

let html = "";

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        const link =
`${window.location.origin}/pages/shared_view.html?id=${docSnap.id}`;

html += `
<div class="link-card">

    <div class="link-top">

        <div>

            <h3>${data.doctorEmail || "Anyone"}</h3>

            <span class="
                status-badge
                ${data.status === "active"
                    ? "active"
                    : "revoked"}
            ">
                ${data.status}
            </span>

        </div>

        <div class="link-actions">

            <button
                class="copy-btn"
                onclick="copySharedLink('${link}')">
                Copy Link
            </button>

            <button
                class="${
                    data.status === "active"
                    ? "revoke-btn"
                    : "activate-btn"
                }"
                onclick="toggleAccess(
                    '${docSnap.id}',
                    '${data.status}'
                )">

                ${
                    data.status === "active"
                    ? "Revoke Access"
                    : "Activate Access"
                }

            </button>

        </div>

    </div>

</div>
`;
    });

    container.innerHTML = html;
}

auth.onAuthStateChanged((user) => {

    if(user){

        loadSharedLinks();

    }

});

window.copySharedLink = async function(link){

    await navigator.clipboard.writeText(link);

    alert("Link copied!");

}

window.revokeLink = async function(docId){

    const confirmRevoke =
    confirm("Are you sure you want to revoke access?");

    if(!confirmRevoke) return;

    try{

        await updateDoc(
            doc(db, "share_records", docId),
            {
                status: "revoked"
            }
        );

        alert("Access revoked successfully!");

        loadSharedLinks();

    }

    catch(error){

        console.error(error);

        alert("Failed to revoke access");

    }

}

window.toggleAccess = async function(docId, currentStatus){

    try{

        const newStatus =
        currentStatus === "active"
        ? "revoked"
        : "active";

        await updateDoc(
            doc(db, "share_records", docId),
            {
                status: newStatus
            }
        );

        alert(
            newStatus === "active"
            ? "Access Activated!"
            : "Access Revoked!"
        );

        loadSharedLinks();

    }

    catch(error){

        console.error(error);

        alert("Failed to update access");

    }

}

auth.onAuthStateChanged(async (user) => {

    if(user){

        document.getElementById("dashboardEmail").innerText =
        user.email;

        const snap =
await getDoc(
    doc(db, "users", user.uid)
);

let fullName =
user.email.split("@")[0];

if(
    snap.exists() &&
    snap.data().fullName
){
    fullName =
    snap.data().fullName;
}

        document.getElementById("dashboardName").innerText =
        fullName;

        document.getElementById("avatarLetter").innerText =
        fullName.charAt(0).toUpperCase();

    }

});


