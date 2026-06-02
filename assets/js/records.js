import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


const auth = getAuth();

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "../../firebase/firebase-config.js";



// ================= MODAL =================

const modal = document.getElementById("uploadModal");

const openModalBtn = document.getElementById("openModal");

const closeModalBtn = document.getElementById("closeModal");

const saveBtn = document.getElementById("saveRecord");


// OPEN

openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});


// CLOSE

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});


// CLOSE ON OUTSIDE CLICK

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});


// ================= SAVE RECORD =================

saveBtn.addEventListener("click", async () => {

    try {

        const caption =
            document.getElementById("caption").value;

        const recordType =
            document.getElementById("recordType").value;

        const doctor =
            document.getElementById("doctor").value;

        const hospital =
            document.getElementById("hospital").value;

        const visitDate =
            document.getElementById("visitDate").value;

        const file =
            document.getElementById("fileInput").files[0];

        if (!file) {
            alert("Please select a file");
            return;
        }

        // CLOUDINARY UPLOAD

        const formData = new FormData();

        formData.append("file", file);

        formData.append(
            "upload_preset",
            "vitavault_upload"
        );

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dn97qi026/auto/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        console.log("Cloudinary Response:", data);

        // FIRESTORE SAVE

        const record = {
            caption: caption,
            recordType: recordType,
            doctor: doctor,
            hospital: hospital,
            visitDate: visitDate,
            fileUrl: data.secure_url,
            createdAt: new Date().toISOString()
        };

        await addDoc(
            collection(
            db,
            "users",
            auth.currentUser.uid,
            "records"
            ),
            record
        );
        await loadRecords();


        alert("Record Saved Successfully!");

        console.log(record);

        // RESET FORM

        document.getElementById("caption").value = "";
        document.getElementById("doctor").value = "";
        document.getElementById("hospital").value = "";
        document.getElementById("visitDate").value = "";
        document.getElementById("fileInput").value = "";

        modal.style.display = "none";

    }

    catch (error) {

        console.error(error);

        alert("Upload Failed");

    }

});

async function loadRecords() {

    const recordsList =
        document.getElementById("recordsList");

    recordsList.innerHTML = "";

    const querySnapshot =
await getDocs(
    collection(
        db,
        "users",
        auth.currentUser.uid,
        "records"
    )
);

// NO RECORDS FOUND

if(querySnapshot.empty){

    recordsList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📄</div>
            <h3>No Records Found</h3>
            <p>
                Upload your first medical record to get started.
            </p>
        </div>
    `;

    return;
}

querySnapshot.forEach((doc) => {

        const record = doc.data();
        record.id = doc.id;

        recordsList.innerHTML += `
<div class="record-card">

    <div class="record-left">

        <div class="record-icon">
            📄
        </div>

        <div class="record-info">

            <h3>${record.caption}</h3>

            <div class="record-meta">
                <span><strong>Date:</strong> ${record.visitDate}</span>
                <span><strong>Doctor:</strong> ${record.doctor}</span>
                <span><strong>hospital:</strong>${record.hospital}</span>
            </div>

            <span class="record-tag">
                ${record.recordType}
            </span>

        </div>

    </div>

   <div class="record-actions">

    <button
    onclick="window.location.href='view_record.html?file=${encodeURIComponent(record.fileUrl)}'">
        View
    </button>

    <button onclick="downloadFile('${record.fileUrl}')">
        Download
    </button>

    <button onclick="deleteRecord('${record.id}')">
        Delete
    </button>

</div>

</div>
`;
    });
}

onAuthStateChanged(auth, async (user) => {

    if(user){

        loadRecords();

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

window.downloadFile = function(url) {

    const downloadUrl =
        url.replace("/upload/", "/upload/fl_attachment/");

    window.open(downloadUrl, "_blank");

}
 

window.deleteRecord = async function(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this record?");

    if (!confirmDelete) return;

    try {

        await deleteDoc(
    doc(
        db,
        "users",
        auth.currentUser.uid,
        "records",
        id
    )
);

        alert("Record Deleted!");

        loadRecords();

    }

    catch(error) {

        console.error(error);

        alert("Delete Failed");

    }

}

