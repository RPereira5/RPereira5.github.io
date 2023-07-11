auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => console.log(error.message));

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Signed in as",user.email);
        setupUI(user);
        setupListener(user);
        noCards.innerHTML = "";
    } else {
        console.log("Logged out.")
        setupUI();
        flashCardsList.innerHTML = "";
        noCards.innerHTML = '<div class="noCardsText" style="text-align:center; padding:10rem"><h4><strong>No Cards</strong></h4><h5><a href="#" class="login-nocards span-link">Log in</a> or <a href="#" class="signup-nocards span-link">sign up</a> to show cards.<br></h5><img src="noun_Cactus_1578234.svg" alt="Cactus Vector Image" title="Cactus" width="100px" height="200px"></div>';
        const noCardsLoginLink = document.querySelector('.login-nocards');
        noCardsLoginLink.addEventListener('click', () => {
            loginModal.classList.add('modal-show');
            navbar.classList.remove('sticky-top');
        })
        const noCardsSignupLink = document.querySelector('.signup-nocards');
        noCardsSignupLink.addEventListener('click', () => {
            signupModal.classList.add('modal-show');
            navbar.classList.remove('sticky-top');
        })
    }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', e => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            email: signupForm['signup-email'].value
        })
    }).then(() => {
        signupModal.classList.remove('modal-show');
        signupForm.reset();

        // email verification
        emailVerificationPopup.classList.add('modal-show');
        navbar.classList.remove('sticky-top');
        auth.currentUser.sendEmailVerification().then(() => {
            console.log("Verification email sent!");
        }).catch(err => console.log(err.message));
    });
});




// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut();
    accountModal.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log in the user
    auth.signInWithEmailAndPassword(email, password).then(_cred => {
        loginModal.classList.remove('modal-show');
        loginForm.reset();
    }).catch(err => console.log(err.message))
});

// reset password
submitResetEmail.addEventListener('click', e => {
    e.preventDefault();

    const email = resetPwEmail.value;
    auth.sendPasswordResetEmail(email).then(() => {
        console.log('Password reset email sent!');
    }).catch(err => console.log(err.message))
    resetPwModal.classList.remove('modal-show');
    navbar.classList.add('sticky-top');
    resetPwConfirmPopup.classList.add('modal-show');
    navbar.classList.remove('sticky-top');
});