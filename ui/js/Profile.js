import Page from "./Page";
import html from '../views/profile.html';
import Modal from "./Modal";
import SignInUp from "./SignInUp";
import BackButton from "./BackButton";
import DatabaseOperations from "./DatabaseOperations";

export default class Profile extends Page {
    constructor() {
        super();

        let self = this;

        let backButton = new BackButton();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                let userId = user.uid;
                firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                    let userDB = snapshot.val();
                    if (userDB) {
                        let usernameHtml = document.getElementsByClassName(
                            'user-profile-username'
                        ).item(0);
                        console.log(usernameHtml);
                        usernameHtml.innerHTML = '@' + userDB.username;

                        let nameSurnameHtml = document.getElementsByClassName(
                            'user-profile-name-surname'
                        ).item(0);
                        nameSurnameHtml.innerHTML = userDB.name + ' ' + userDB.surname;

                        self.setPaymentInformationButtonOnclick();
                        self.setLogoutButtonOnclick();
                        self.setSettingsButtonOnclick();

                        socket.emit('get stats', {userId : userId});
                        socket.on('stats graph',  (response) => {
                            new Chartist.Line('.ct-chart', {
                                labels: response.x,
                                series: [
                                    response.y
                                ]
                            }, {
                                // low: 0,
                                showArea: true,
                                width: '60vw',
                                height: '48vh'
                            });
                        });

                        socket.on('top players', (response) => {
                           let topPlayers = response.players;

                           let labels = document.getElementsByClassName('rating-top-username');
                           for (let i = 0; i < topPlayers.length; i++) {
                               let promise = DatabaseOperations.getUserPromiseById(topPlayers[i].userId);
                               promise.then(function (user) {
                                   labels.item(i).innerHTML = user.username;
                               })
                           }
                        });
                    }
                });
            } else {
                location.replace('#sign_in_up');
            }
        });


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

    changeTheme() {
        document.documentElement.style.setProperty('--main-bg-color', '#353A62')
        document.documentElement.style.setProperty('--main-dark-bg-color', '#30345C')
        document.documentElement.style.setProperty('--main-color', '#3F4573')
        document.documentElement.style.setProperty('--main-dark-color', '#2E3258')
        document.documentElement.style.setProperty('--secondary-color', '#675AF6')
        document.documentElement.style.setProperty('--white-color', '#353A61')
    //     document.documentElement.style.setProperty('--font-color', '#')
    //     document.documentElement.style.setProperty('--font-secondary-color', '#')
    //     document.documentElement.style.setProperty('--error-color', '#')
        document.documentElement.style.setProperty('--success-color', '#00c618')
    //     document.documentElement.style.setProperty('--form-font-color', '#')
    }


    setSettingsButtonOnclick() {
        let settingsButton = document.getElementsByClassName('settings-button').item(0);
        let form = document.getElementsByClassName('settings-form').item(0);

        let self = this;

        SignInUp.setPasswordsOninputEvents(
            'passwordProfileSettings',
            'passwordConfirmProfileSettings',
            'submitButtonProfileSettings'
        );

        SignInUp.setUsernameOninputEvent(
            'usernameProfileSettings',
            'submitButtonProfileSettings'
        );

        form.onsubmit = function () {
            let modalId = 'modalConfirmProfileChanges';
            Modal.showModal(modalId);

            let cancelButton = document.getElementsByClassName('cancel-profile-changes-button').item(0);
            cancelButton.onclick = function () {
                Modal.hideModal(modalId)
            }

            let confirmButton = document.getElementsByClassName('confirm-profile-changes-button').item(0);
            confirmButton.onclick = function () {
                let user = firebase.auth().currentUser;

                let password = document.getElementsByClassName(
                    'confirm-current-password'
                ).item(0).value;

                const credential = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    password
                );

                let span = document.getElementsByClassName('span-invalid-password-profile-settings').item(0);
                document.getElementsByClassName(
                    'confirm-current-password'
                ).item(0).oninput = function () {
                    span.style.visibility = 'hidden';
                }

                user.reauthenticateWithCredential(
                    credential
                ).then(function() {
                    let newUsername = document.getElementById('usernameProfileSettings').value;
                    let newPassword = document.getElementById('passwordProfileSettings').value;
                    // let darkTheme = document.getElementById('themeProfileSettings').checked;

                    let userId = firebase.auth().currentUser.uid;
                    let email = firebase.auth().currentUser.email;

                    // if (darkTheme) {
                    //     self.changeTheme();
                    // }

                    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                        let userDB = snapshot.val();
                        if (userDB) {
                            if (newUsername.length > 2 && userDB.username !== newUsername) {
                                firebase.database().ref('users/' + userId).update({
                                    username: newUsername,
                                }).then(function () {
                                    Modal.hideModal(modalId);
                                    location.reload();
                                });
                            }
                        }
                    });

                    console.log('new password', newPassword)
                    if (newPassword.length) {
                        // FIXME:
                        user.updatePassword(newPassword).then(function() {
                            console.log('password updated');
                            firebase.auth().signInWithEmailAndPassword(email, newPassword)
                                .then(function (result) {
                                    console.log('all good');
                                    Modal.hideModal(modalId);

                                }).catch(function (error) {
                                console.log('err in REsign in');
                                console.log(error);
                            });
                        }).catch(function(error) {
                            console.log(error.message, 'error in settings button when changing pass');
                        });

                    }
                    Modal.hideModal(modalId);
                    settingsButton.click();
                        // location.reload();
                }).catch(function(error) {
                    span.style.visibility = 'visible';

                    console.log('err credential', error);
                });

            }

            return false;
        }

        settingsButton.onclick = function () {
            if (form.classList.contains('active')) {
                form.classList.remove('active');
                form.classList.add('not-active');
            } else {
                form.classList.remove('not-active');
                form.classList.add('active');
            }
        }
    }

    static getHtml() {
        return html;
    }
}