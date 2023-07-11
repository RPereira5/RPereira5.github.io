const navbar = document.querySelector('.navbar');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const addBtn = document.getElementById('addCardButton');
const themeToggler = document.getElementById('themeToggler');
const sortBtn = document.getElementById('sortButton');

const modalWrapper = document.querySelector('.modal-wrapper');

// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

// modal details
const detailsModal = document.querySelector('.details-modal');
const closeDtlsBtn = document.querySelector('.close-details-btn');

// modal delete
const deleteModal = document.querySelector('.delete-modal');
const deleteModalButton = document.querySelector('.btn-delete-modal');
const cancelBtn = document.querySelector('.btn-secondary-modal');

// modal sort
const sortModal = document.querySelector('.sort-modal');
const alphaAsc = document.querySelector('.alphaAsc');
const alphaDesc = document.querySelector('.alphaDesc');
const createdAsc = document.querySelector('.createdAsc');
const createdDesc = document.querySelector('.createdDesc');
const editedAsc = document.querySelector('.editedAsc');
const editedDesc = document.querySelector('.editedDesc');

// modal account
const accountBtn = document.getElementById('accountDetails');
const accountModal = document.getElementById('modal-account');
const accountDetails = document.querySelector('.account-details');

// auth
const signupModal = document.querySelector('#modal-signup');
const signupLink = document.querySelector('#signup');
const loginModal = document.querySelector('#modal-login');
const loginLink = document.querySelector('#login');

const resetPassword = document.querySelector('.resetPassword');
const resetPwModal = document.getElementById('modal-reset-pw');
const resetPwEmail = document.getElementById('resetPwEmail');
const submitResetEmail = document.getElementById('submitResetEmail');

const emailVerificationPopup = document.getElementById('modal-email-ver');
const closeEmailVerModal = document.getElementById('closeEmailVerModal');

const resetPwConfirmPopup = document.getElementById('modal-reset-pw-confirm');
const closePwResetConfirmModal = document.getElementById('closePwResetConfirmModal');

const flashCardsList = document.querySelector('.flashCardsList');
const noCards = document.querySelector('.noCards');

let id;

const setupUI = user => {
    if (user) { // logged in

        // account info
        db.collection('users').doc(user.uid).get().then(_doc => {
            const html = `<div>Logged in as ${user.email}</div>`;
            accountDetails.innerHTML = html;
        })

        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        
    } else { // logged out

        // hide account info
        accountDetails.innerHTML = "";

        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

// Create element and render flashCardsList
const renderCards = doc => {
    const accordion = `
        <div class="accordion accordion-flush" id="accordionCards${doc.id}">
            <div class="accordion-item" data-id='${doc.id}'>
                <h2 class="accordion-header" id="flush-heading${doc.id}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${doc.id}" aria-expanded="false" aria-controls="flush-collapse${doc.id}">${doc.data().title}</button>
                </h2>
                <div id="flush-collapse${doc.id}" class="accordion-collapse collapse" aria-labelledby="flush-heading${doc.id}">
                    <div class="accordion-body">${doc.data().desc}
                        <button class="btn btn-delete" id="deleteBtn${doc.id}" title="Delete this card." style="float:right">Delete</button>
                        <button class="btn btn-edit" id="editBtn${doc.id}" title="Edit this card's information." style="float:right">Edit</button>
                        <button class="btn btn-details" id="detailsBtn${doc.id}" title="Show this card's details." style="float:right">Details</button>
                    </div>
                </div>
            </div>
        </div>`;
    flashCardsList.insertAdjacentHTML('beforeend', accordion);
    
        // Click details
        const btnDetails = document.querySelector(`[data-id='${doc.id}'] .btn-details`);
        btnDetails.addEventListener('click', () => {
            document.getElementById('detailsModalTitle').innerHTML = `<b>Title: </b>${doc.data().title}`
            document.getElementById('detailsModalDesc').innerHTML = `<b>Description: </b>${doc.data().desc}`
            document.getElementById('detailsModalTimestampCreated').innerHTML = `<b>Date Created: </b>${doc.data().dateCreated.toDate().toDateString()}, ${doc.data().dateCreated.toDate().toLocaleTimeString()}`;
            document.getElementById('detailsModalTimestampModified').innerHTML = `<b>Last Modified: </b>${doc.data().dateModified.toDate().toDateString()}, ${doc.data().dateModified.toDate().toLocaleTimeString()}`
            detailsModal.classList.add('modal-show');
            navbar.classList.remove('sticky-top');
        });

        // Click edit
        const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
        btnEdit.addEventListener('click', () => {
            editModal.classList.add('modal-show');
            navbar.classList.remove('sticky-top');

            id = doc.id;
            editModalForm.title.value = doc.data().title;
            editModalForm.desc.value = doc.data().desc;
        });

        // Click delete
        const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
        btnDelete.addEventListener('click', () => {
            document.getElementById('deleteModalTitle').innerHTML = `<b>Title: </b>${doc.data().title}`
            document.getElementById('deleteModalDesc').innerHTML = `<b>Description: </b>${doc.data().desc}`
            document.getElementById('deleteModalTimestampCreated').innerHTML = `<b>Date Created: </b>${doc.data().dateCreated.toDate().toDateString()}, ${doc.data().dateCreated.toDate().toLocaleTimeString()}`;
            document.getElementById('deleteModalTimestampModified').innerHTML = `<b>Last Modified: </b>${doc.data().dateModified.toDate().toDateString()}, ${doc.data().dateModified.toDate().toLocaleTimeString()}`
            deleteModal.classList.add('modal-show');
            navbar.classList.remove('sticky-top');
            let id = doc.id
            deleteModalButton.addEventListener('click', deleteFromDB => {
                db.collection('flashCardsList').doc(id).delete().then(() => {
                    console.log('Document', id, 'successfully deleted!');
                    deleteModal.classList.remove('modal-show');
                    navbar.classList.add('sticky-top');
                }).catch(err => console.log('Error removing document: ', err));
                deleteModalButton.removeEventListener('click', deleteFromDB);
            });
        });
}

// Click Add Card 
addBtn.addEventListener('click', () => {
    addModal.classList.add('modal-show');
    navbar.classList.remove('sticky-top');

    addModalForm.title.value = '';
    addModalForm.desc.value = '';
});

// Click Sign Up
signupLink.addEventListener('click', () => {
    signupModal.classList.add('modal-show');
    navbar.classList.remove('sticky-top');
})

// Click Close (Email Ver Popup)
closeEmailVerModal.addEventListener('click', () => {
    emailVerificationPopup.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
})

// Click Login
loginLink.addEventListener('click', () => {
    loginModal.classList.add('modal-show');
    navbar.classList.remove('sticky-top');
})

// Click Forgot Password
resetPassword.addEventListener('click', () => {
    loginModal.classList.remove('modal-show');
    resetPwModal.classList.add('modal-show');
})

// Click Close (Password Reset Confirmation Popup)
closePwResetConfirmModal.addEventListener('click', () => {
    resetPwConfirmPopup.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
})

// Click Account
accountBtn.addEventListener('click', () => {
    accountModal.classList.add('modal-show');
    navbar.classList.remove('sticky-top');
})

// Realtime listener
function setupListener(user){
    if (user) {
        db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("dateCreated").onSnapshot(snapshot => {
            if (snapshot.docs.length <= 0) {
                noCards.innerHTML = '<div class="noCardsText" style="text-align:center; padding:10rem"><h4><strong>No Cards</strong></h4><h5>Click <a href="#" class="add-nocards span-link">Add Card</a> to create one.<br></h5><img src="noun_Cactus_1578234.svg" alt="Cactus Vector Image" title="Cactus" width="100px" height="200px"></div>';
                const noCardsAddLink = document.querySelector('.add-nocards');
                flashCardsList.innerHTML = "";
                noCardsAddLink.addEventListener('click', () => {
                    addModal.classList.add('modal-show');
                    navbar.classList.remove('sticky-top');
            
                    addModalForm.title.value = '';
                    addModalForm.desc.value = '';
                })
            } else {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added'){
                        renderCards(change.doc);
                        if (noCards.innerHTML !== ""){
                            noCards.innerHTML = "";
                        }
                    }
                    if (change.type === 'removed'){
                        let accordion0 = document.querySelector(`[data-id='${change.doc.id}']`);
                        flashCardsList.removeChild(accordion0.parentElement);
                    }
                    if (change.type === 'modified'){
                        let accordion0 = document.querySelector(`[data-id='${change.doc.id}']`);
                        flashCardsList.removeChild(accordion0.parentElement);
                        renderCards(change.doc);
                    }
                })
            }
        })
    }
}

// User clicks outside of modal
window.addEventListener('click', e => {
    if(e.target === addModal){
        addModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === detailsModal){
        detailsModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === editModal){
        editModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === deleteModal){
        deleteModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === sortModal){
        sortModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === signupModal){
        signupModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
        signupForm.reset();
    }
    if(e.target === loginModal){
        loginModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
        loginForm.reset();
    }
    if(e.target === accountModal){
        accountModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
    if(e.target === resetPwModal){
        resetPwModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
});

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
    e.preventDefault();
    if (addModalForm.title.value == ""){
        alert("Please input a title.");
    }
    else if (addModalForm.desc.value == ""){
        alert("Please input a description.");
    }
    else {
        db.collection('flashCardsList').add({
            title: addModalForm.title.value,
            desc: addModalForm.desc.value,
            dateCreated: new Date(),
            dateModified: new Date(),
            user: auth.currentUser.uid
        }).then(() => {
            modalWrapper.classList.remove('modal-show');
            navbar.classList.add('sticky-top');
            addModalForm.reset();
        }).catch(err => {
            console.log(err.message);
        })
    }
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    if (editModalForm.title.value == ""){
        alert("Please input a title.");
    }
    else if (editModalForm.desc.value == ""){
        alert("Please input a description.");
    }
    else {
        db.collection('flashCardsList').doc(id).update({
            title: editModalForm.title.value,
            desc: editModalForm.desc.value,
            dateModified: new Date()
        });
        editModal.classList.remove('modal-show');
        navbar.classList.add('sticky-top');
    }
});

// Click sort cards
sortBtn.addEventListener('click', () => {
    sortModal.classList.add('modal-show');
    navbar.classList.remove('sticky-top');
});

// Click sort buttons (any)
alphaAsc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("title").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show')
    alphaAsc.classList.add('active');
    alphaDesc.classList.remove('active');
    createdAsc.classList.remove('active');
    createdDesc.classList.remove('active');
    editedAsc.classList.remove('active');
    editedDesc.classList.remove('active');
    
});
alphaDesc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("title", "desc").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show');
    alphaDesc.classList.add('active');
    alphaAsc.classList.remove('active');
    createdAsc.classList.remove('active');
    createdDesc.classList.remove('active');
    editedAsc.classList.remove('active');
    editedDesc.classList.remove('active');
});
createdAsc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("dateCreated").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show');
    createdAsc.classList.add('active');
    alphaAsc.classList.remove('active');
    alphaDesc.classList.remove('active');
    createdDesc.classList.remove('active');
    editedAsc.classList.remove('active');
    editedDesc.classList.remove('active');
});
createdDesc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("dateCreated", "desc").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show');
    alphaAsc.classList.remove('active');
    alphaDesc.classList.remove('active');
    createdAsc.classList.remove('active');
    createdDesc.classList.add('active');
    editedAsc.classList.remove('active');
    editedDesc.classList.remove('active');
});
editedAsc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("dateModified").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show');
    editedAsc.classList.add('active');
    alphaAsc.classList.remove('active');
    alphaDesc.classList.remove('active');
    createdAsc.classList.remove('active');
    createdDesc.classList.remove('active');
    editedDesc.classList.remove('active');
});
editedDesc.addEventListener('click', () => {
    flashCardsList.innerHTML = "";
    db.collection('flashCardsList').where("user", "==", auth.currentUser.uid).orderBy("dateModified", "desc").get().then (snapshot => snapshot.docs.forEach(doc => renderCards(doc)));
    sortModal.classList.remove('modal-show');
    editedDesc.classList.add('active');
    alphaAsc.classList.remove('active');
    alphaDesc.classList.remove('active');
    createdAsc.classList.remove('active');
    createdDesc.classList.remove('active');
    editedAsc.classList.remove('active');
});

// Click cancel in delete modal
cancelBtn.addEventListener('click', () => {
    deleteModal.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
});

// Click close in details modal
closeDtlsBtn.addEventListener('click', () => {
    detailsModal.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
});

// Change theme button
themeToggler.addEventListener("click", () => {
    if (document.getElementById("themeToggler").innerHTML === "Switch to Dark Mode"){
        document.getElementById("themeToggler").innerHTML = "Switch to Light Mode";
        document.getElementById("mySheet").href = "FlashCards2Dark.css";
    }
    else {
        document.getElementById("themeToggler").innerHTML = "Switch to Dark Mode";
        document.getElementById("mySheet").href = "FlashCards2Light.css";
    }
});