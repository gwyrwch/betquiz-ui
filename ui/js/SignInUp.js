import Page from "./Page";
import html from '../views/signInUp.html';
import Validator from "./Validator";

export default class SignInUp extends Page {
    constructor() {
        super();

        let self = this;

        self.database = firebase.database();
        self.userId = -1;

        self.database.ref('users/').once('value').then(function(snapshot) {
            let users = snapshot.val();

            for (let id in users) {
                let user = users[id];
                if (user) {
                    self.userId = Math.max(user.id, self.userId);
                }
            }

            if (self.userId === -1) {
                self.userId = 0;
            } else {
                self.userId++;
            }

        });

        self.setSignInUpButtonsOnclick();
        self.setOninputEvents();

        self.setSignInFormOnSubmit();
        self.setSignUpFormOnSubmit();
    }

    setSignInFormOnSubmit() {
        let signInForm = document.getElementsByClassName('sign-in-form').item(0);

        signInForm.onsubmit = function () {
            let email = document.getElementById('emailSignIn').value;
            let password = document.getElementById('passwordSignIn').value;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(result) {
                    location.replace('#menu');
                }).catch(function(error) {
                    // TODO: show error
                    console.log('err in sign in');
                    console.log(error);
            });
            return false;
        }
    }

    static setUsernameOninputEvent(usernameInputId, submitButtonId) {
        let usernameInput = document.getElementById(usernameInputId);

        let clsError = 'input-invalid-data';
        let submitButton = document.getElementById(submitButtonId);

        usernameInput.oninput = function () {
            if (!Validator.isCorrectUsername(this.value)) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }
    }

    static setPasswordsOninputEvents(passwordInputId, passwordInputRepeatId, submitButtonId) {
        let passwordInput = document.getElementById(passwordInputId);
        let passwordRepeatInput = document.getElementById(passwordInputRepeatId);

        let clsError = 'input-invalid-data';
        let submitButton = document.getElementById(submitButtonId);

        passwordInput.oninput = function () {
            if (this.value.length < 6) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                if (passwordRepeatInput.value !== this.value) {
                    passwordRepeatInput.classList.add(clsError);
                }

                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }

        passwordRepeatInput.oninput = function () {
            if (this.value !== passwordInput.value) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }
    }

    setOninputEvents() {
        let nameInput = document.getElementById('nameSignUp');
        let surnameInput = document.getElementById('surnameSignUp');
        let passportIdInput = document.getElementById('passportIDSignUp');

        let clsError = 'input-invalid-data';
        let submitButton = document.getElementById('submitButtonSignUp');

        SignInUp.setUsernameOninputEvent(
            'usernameSignUp',
            'submitButtonSignUp'
        )

        nameInput.oninput = function () {
            if (!Validator.isAlpha(this.value)) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }

        SignInUp.setPasswordsOninputEvents(
            'passwordSignUp',
            'passwordConfirmSignUp',
            'submitButtonSignUp'
        )

        surnameInput.oninput = function () {
            if (!Validator.isAlpha(this.value)) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }

        passportIdInput.oninput = function () {
            if (!Validator.isCorrectPassportId(this.value)) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }

        let bInput = document.getElementById('birthdaySignUp');
        bInput.oninput = function () {
            console.log(bInput.value)
            let age = Validator.calculateAge(new Date(bInput.value));
            if (age < 18 || age > 100) {
                this.classList.add(clsError);
                submitButton.disabled = true;
            } else {
                this.classList.remove(clsError);
                submitButton.disabled = false;
            }
        }
    }

    setSignUpFormOnSubmit() {
        let self = this;
        let signUpForm = document.getElementsByClassName('sign-up-form').item(0);

        signUpForm.onsubmit = function () {
            // TODO: not to create users with the same usernames

            let username = document.getElementById('usernameSignUp').value;
            let email = document.getElementById('emailSignUp').value;
            let name = document.getElementById('nameSignUp').value;
            let surname = document.getElementById('surnameSignUp').value;
            let password = document.getElementById('passwordSignUp').value;

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                // TODO: show error
                console.log(`Cannot create user - errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
                return false;
            }).then(function () {
                let user = firebase.auth().currentUser;

                if (user) {
                    console.log('User is signed in', user.uid);
                } else {
                    console.log('No user is signed in', user);
                }

                self.database.ref('users/' + user.uid).set({
                    username: username,
                    email: email,
                    name: name,
                    surname: surname,
                    profile_picture : null
                });

                location.replace('#menu');
            });

            // DatabaseOperations.createUserAndSaveToDatabase(self.userId, username, email, password, name, surname);
            return false;
        }
    }

    setSignInUpButtonsOnclick() {
        let signInForm = document.getElementsByClassName('sign-in-form').item(0);
        let signUpForm = document.getElementsByClassName('sign-up-form').item(0);

        let signInButton = document.getElementsByClassName('sign-in-button').item(0);
        let signUpButton = document.getElementsByClassName('sign-up-button').item(0);

        signInButton.onclick = function() {
            this.classList.add('selected-sign-in-up-button', 'selected-sign-in-button');
            signInForm.style.display = 'block';

            signUpButton.classList.remove('selected-sign-in-up-button', 'selected-sign-up-button');
            signUpForm.style.display = 'none';
        }

        signUpButton.onclick = function() {
            this.classList.add('selected-sign-in-up-button', 'selected-sign-up-button');
            signUpForm.style.display = 'block';

            signInButton.classList.remove('selected-sign-in-up-button', 'selected-sign-in-button');
            signInForm.style.display = 'none';
        }
    }

    static getHtml() {
        return html;
    }
}