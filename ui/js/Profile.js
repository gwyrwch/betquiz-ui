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

    static getHtml() {
        return html;
    }
}