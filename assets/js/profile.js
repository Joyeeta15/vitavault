import { auth, db } from "../../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let editMode = false;

// LOAD USER DATA

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef =
        doc(db, "users", user.uid);

        const snap =
        await getDoc(userRef);

        const data =
        snap.exists() ? snap.data() : {};

        // NAME FROM EMAIL

        const fullName =
data.fullName ||
user.email.split("@")[0];

        // SIDEBAR

        document.getElementById("dashboardName").innerText =
        fullName;

        document.getElementById("dashboardEmail").innerText =
        user.email;

        document.getElementById("avatarLetter").innerText =
        fullName.charAt(0);

        // INPUT FIELDS

        document.getElementById("fullName").value =
        fullName;

        document.getElementById("emailText").innerText =
        user.email;

        document.getElementById("phone").value =
        data.phone || "";

        document.getElementById("address").value =
        data.address || "";

        document.getElementById("dob").value =
        data.dob || "";

        document.getElementById("gender").value =
        data.gender || "";

        document.getElementById("bloodGroup").value =
        data.bloodGroup || "";

        document.getElementById("emergencyName").value =
        data.emergencyName || "";

        document.getElementById("relationship").value =
        data.relationship || "";

        document.getElementById("emergencyPhone").value =
        data.emergencyPhone || "";

        document.getElementById("emergencyEmail").value =
        data.emergencyEmail || "";

        // USER ID

        document.getElementById("patientIdText").innerText =
        user.uid.substring(0, 6).toUpperCase();

        // AGE

        let age = "";

        if(data.dob){

            const birthDate =
            new Date(data.dob);

            const today =
            new Date();

            age =
            today.getFullYear() -
            birthDate.getFullYear();

            const monthDiff =
            today.getMonth() -
            birthDate.getMonth();

            if(
                monthDiff < 0 ||
                (
                    monthDiff === 0 &&
                    today.getDate() < birthDate.getDate()
                )
            ){
                age--;
            }
        }

        // VIEW MODE TEXTS

        document.getElementById("fullNameText").innerText =
        fullName;

        document.getElementById("dobText").innerText =
        data.dob || "Not Added";

        document.getElementById("ageText").innerText =
        age || "Not Added";

        document.getElementById("genderText").innerText =
        data.gender || "Not Added";

        document.getElementById("bloodGroupText").innerText =
        data.bloodGroup || "Not Added";

        document.getElementById("phoneText").innerText =
        data.phone || "Not Added";

        document.getElementById("addressText").innerText =
        data.address || "Not Added";

        document.getElementById("emergencyNameText").innerText =
        data.emergencyName || "Not Added";

        document.getElementById("relationshipText").innerText =
        data.relationship || "Not Added";

        document.getElementById("emergencyPhoneText").innerText =
        data.emergencyPhone || "Not Added";

        document.getElementById("emergencyEmailText").innerText =
        data.emergencyEmail || "Not Added";

    }

    catch(error){

        console.error(error);

    }

});

// EDIT BUTTON

const editBtn =
document.getElementById("editBtn");

editBtn.addEventListener("click", async () => {

    const fields =
    document.querySelectorAll(".editable");

    // EDIT MODE

    if(!editMode){

        document.querySelectorAll(".view-mode")
        .forEach(el => {
            el.style.display = "none";
        });

        document.querySelectorAll(".edit-mode")
        .forEach(el => {
            el.style.display = "block";
        });

        editBtn.textContent =
        "Save Changes";

        editMode = true;

        return;
    }

    // SAVE MODE

    try{

        const user =
        auth.currentUser;

        await updateDoc(
            doc(db, "users", user.uid),
            {

                fullName:
                document.getElementById("fullName").value,

                phone:
                document.getElementById("phone").value,

                address:
                document.getElementById("address").value,

                dob:
                document.getElementById("dob").value,

                gender:
                document.getElementById("gender").value,

                bloodGroup:
                document.getElementById("bloodGroup").value,

                emergencyName:
                document.getElementById("emergencyName").value,

                relationship:
                document.getElementById("relationship").value,

                emergencyPhone:
                document.getElementById("emergencyPhone").value,

                emergencyEmail:
                document.getElementById("emergencyEmail").value
            }
        );

        location.reload();

    }

    catch(error){

        console.error(error);
        alert(error.message);

    }

});


// AGE CALCULATION

document.getElementById("dob")
.addEventListener("change", () => {

    const dob =
    document.getElementById("dob").value;

    if(!dob) return;

    const birthDate =
    new Date(dob);

    const today =
    new Date();

    let age =
    today.getFullYear() -
    birthDate.getFullYear();

    const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

    if(
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ){
        age--;
    }

    document.getElementById("ageText").innerText =
    age;
});

const logoutBtn =
document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

    const confirmLogout =
    confirm("Are you sure you want to logout?");

    if(!confirmLogout) return;

    try{

        await signOut(auth);

        window.location.href =
        "login.html";

    }

    catch(error){

        alert(error.message);

    }

});