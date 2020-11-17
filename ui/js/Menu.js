import Page from "./Page";
import html from '../views/menu.html';
import Modal from "./Modal";
const io = require('socket.io-client');

export default class Menu extends Page {
    constructor() {
        super();

        let socket = io('130.193.57.125:3000', {
            forceNew: false
        });
        socket.emit('ping');
        socket.on('pong', () => {
           alert(123);
        });

        let self = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log(user.uid);

                let userId = user.uid;
                firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                    let userDB = snapshot.val();
                    if (userDB) {
                        let usernameLabel = document.getElementsByClassName(
                            'username-menu'
                        ).item(0);

                        usernameLabel.innerHTML = '@' + userDB.username;
                    }

                    self.setOnClicksToAllCards();
                });


            } else {
                // No user is signed in.
            }
        });


    }

    setOnClicksToAllCards() {
        let self = this;

        let modalId = 'gameMenuModal';
        let startButton = document.getElementsByClassName(
            'start-game-button'
        ).item(0);
        let cancelButton = document.getElementsByClassName(
            'cancel-start-game-button'
        ).item(0);

        cancelButton.onclick = function () {
            Modal.hideModal(modalId)
        }

        function getModalData() {
            let tableId = document.getElementsByClassName(
                'menu-game-table-id'
            ).item(0).value;

            let buyIn = document.getElementsByClassName(
                'menu-game-buy-in'
            ).item(0).value;

            console.log(tableId, buyIn);
        }

        function clearModalData() {
            document.getElementsByClassName(
                'menu-game-table-id'
            ).item(0).value = '';

            document.getElementsByClassName(
                'menu-game-buy-in'
            ).item(0).value = '';
        }

        self.setCardOnclick(
            'card-profile',
            function () {
                location.replace('#profile');
            }
        );

        self.setCardOnclick(
            'card-random-table',
            function () {
                clearModalData();
                Modal.showModal(modalId);
                startButton.onclick = function () {
                    console.log('random');
                    getModalData();
                }
            }
        );

        self.setCardOnclick(
            'card-create-table',
            function () {
                clearModalData();
                Modal.showModal(modalId);
                startButton.onclick = function () {
                    console.log('create');
                    getModalData();
                }
            }
        );

        self.setCardOnclick(
            'card-join-table',
            function () {
                clearModalData();
                Modal.showModal(modalId);
                startButton.onclick = function () {
                    console.log('join');
                    getModalData();
                }
            }
        );
    }

    setCardOnclick(cardClass, onclickEvent) {
        let card = document.getElementsByClassName(cardClass).item(0);
        card.onclick = onclickEvent;
    }

    static getHtml() {
        return html;
    }
}