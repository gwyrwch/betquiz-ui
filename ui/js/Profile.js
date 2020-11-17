import Page from "./Page";
import html from '../views/profile.html';
import Modal from "./Modal";

export default class Profile extends Page {
    constructor() {
        super();

        let self = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log(user.uid);

                let userId = user.uid;
                firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                    let userDB = snapshot.val();
                    if (userDB) {
                        let usernameHtml = document.getElementsByClassName(
                            'user-profile-username'
                        ).item(0);
                        usernameHtml.innerHTML = '@' + userDB.username;

                        let nameSurnameHtml = document.getElementsByClassName(
                            'user-profile-name-surname'
                        ).item(0);
                        nameSurnameHtml.innerHTML = userDB.name + ' ' + userDB.surname;
                    }
                });
            } else {
                // No user is signed in.
            }
        });


        self.setPaymentInformationButtonOnclick();
        self.setLogoutButtonOnclick();
        self.setSettingsButtonOnclick();
    }

    setLogoutButtonOnclick() {
        let logoutButton = document.getElementsByClassName('sign-out-button').item(0);
        logoutButton.onclick = function () {
            firebase.auth().signOut().then(function() {
                location.replace('#sign_in_up');
            }).catch(function(error) {
                console.log('Error when sign out user', error);
            });
        }
    }

    setPaymentInformationButtonOnclick() {
        let self = this;

        let cardButton = document.getElementsByClassName('payment-info-button').item(0);
        cardButton.onclick = function () {
            let modalId = 'addCreditCardModal';
            Modal.showModal(modalId);

            let confirmModalButton = document.getElementById('updateCardConfirmButton');
            let cancelModalButton = document.getElementById('updateCardCancelButton');

            confirmModalButton.onclick = function () {
                self.savePaymentInformation();
            }

            cancelModalButton.onclick = function () {
                Modal.hideModal(modalId)
            }
        }
    }

    savePaymentInformation() {
        //    TODO:
    }

    setSettingsButtonOnclick() {
        let settingsButton = document.getElementsByClassName('settings-button').item(0);
        let form = document.getElementsByClassName('settings-form').item(0);

        form.onsubmit = function () {
            let modalId = 'modalConfirmProfileChanges';
            Modal.showModal(modalId);

            let cancelButton = document.getElementsByClassName('cancel-profile-changes-button').item(0);
            cancelButton.onclick = function () {
                Modal.hideModal(modalId)
            }

            let confirmButton = document.getElementsByClassName('confirm-profile-changes-button').item(0);
            confirmButton.onclick = function () {
                var user = firebase.auth().currentUser;

                let password = document.getElementsByClassName(
                    'confirm-current-password'
                ).item(0).value;

                const credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    password
                );

                user.reauthenticateWithCredential(
                    credential
                ).then(function() {
                    let newUsername = document.getElementById('usernameProfileSettings').value;
                    let password = document.getElementById('passwordProfileSettings').value;

                    let userId = firebase.auth().currentUser.uid;
                    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                        let userDB = snapshot.val();
                        if (userDB) {
                            if (userDB.username !== newUsername) {
                                firebase.database().ref('users/' + userId).update({
                                    username: newUsername,
                                })
                            }

                            if (password.length > 6) {
                                user.updatePassword(password).then(function() {
                                    console.log('password updated');
                                }).catch(function(error) {
                                    console.log(error, 'in settings button');
                                });
                            }

                            Modal.hideModal(modalId);
                            location.reload();
                        }

                    });
                }).catch(function(error) {
                    console.log('err credential', error);
                });

            }

            return false;
        }

        settingsButton.onclick = function () {

            if (form.style.display === 'block') {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
            }
        }
    }

    static getHtml() {
        return html;
    }
}