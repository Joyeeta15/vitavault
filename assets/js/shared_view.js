import { db } from "../../firebase/firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {

    if(!user){

        document.getElementById("sharedData").innerHTML = `
            <h2>Login Required</h2>
            <p>Please login to view shared records.</p>
        `;
        return;
    }

    if(
        user.email.toLowerCase() !==
        shareData.doctorEmail.toLowerCase()
    ){

        document.getElementById("sharedData").innerHTML = `
            <h2>Access Denied</h2>
            <p>This link was not shared with your account.</p>
        `;
        return;
    }

    // Load records here
});



const params = new URLSearchParams(window.location.search);
const shareId = params.get("id");

async function loadSharedData() {

    try {

        if (!shareId) {

            document.getElementById("sharedData").innerHTML =
                "<h3>Invalid Share Link</h3>";

            return;
        }

        const shareRef =
        doc(db, "share_records", shareId);

        const shareSnap =
        await getDoc(shareRef);

        if (!shareSnap.exists()) {

            document.getElementById("sharedData").innerHTML =
                "<h3>Share Link Not Found</h3>";

            return;
        }

        const shareData =
        shareSnap.data();

        // LOGIN CHECK

        const user =
        auth.currentUser;

        if(!user){

            document.getElementById("sharedData").innerHTML = `
                <h2>Login Required</h2>
                <p>Please login to view shared records.</p>
            `;

            return;
        }

        // EMAIL CHECK

        if(
            shareData.doctorEmail &&
            user.email.toLowerCase() !==
            shareData.doctorEmail.toLowerCase()
        ){

            document.getElementById("sharedData").innerHTML = `
                <h2>Access Denied</h2>
                <p>This link was not shared with your account.</p>
            `;

            return;
        }

        // REVOKED CHECK

        if(shareData.status === "revoked"){

            document.getElementById("sharedData").innerHTML = `
                <h2>Access Revoked</h2>
                <p>This shared link is no longer available.</p>
            `;

            return;
        }

        const ownerUid =
        shareData.ownerUid;

        const allowedCategories =
        shareData.selectedCategories || [];

        const recordsRef =
        collection(
            db,
            "users",
            ownerUid,
            "records"
        );

        const recordsSnap =
        await getDocs(recordsRef);

        let html = `
            <h2>Shared Medical Records</h2>

            <p>
                <strong>Shared With:</strong>
                ${shareData.doctorEmail || "Anyone"}
            </p>

            <p>
                <strong>Status:</strong>
                <span class="status-badge">
                    ${shareData.status}
                </span>
            </p>

            <hr><br>
        `;

        if(recordsSnap.empty){

            html += `
                <p>No records available.</p>
            `;
        }

        else{

            recordsSnap.forEach((recordDoc) => {

                const record =
                recordDoc.data();

                if(
                    allowedCategories.length > 0 &&
                    !allowedCategories.includes(record.recordType)
                ){
                    return;
                }

                html += `
<div class="record-card">

    <h3>${record.recordType || "Medical Record"}</h3>

    <p><strong>Doctor:</strong> ${record.doctor || "N/A"}</p>

    <p><strong>Hospital:</strong> ${record.hospital || "N/A"}</p>

    <p><strong>Visit Date:</strong> ${record.visitDate || "N/A"}</p>

    <p><strong>Caption:</strong> ${record.caption || "N/A"}</p>

    <a
        href="${record.fileUrl}"
        target="_blank"
        class="view-btn">
        View File
    </a>

</div>
`;
            });

        }

        document.getElementById("sharedData").innerHTML =
        html;

    }

    catch(error){

        console.error(error);

        document.getElementById("sharedData").innerHTML = `
            <h3>Error Loading Records</h3>
            <p>${error.message}</p>
        `;
    }
}

loadSharedData();