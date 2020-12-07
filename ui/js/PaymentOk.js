import Page from "./Page";
import html from '../views/payment_ok.html';


export default class PaymentOk extends Page {
    constructor() {
        super();

        let self = this;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user.uid);

                let userId = user.uid;
                firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                    let userDB = snapshot.val();
                    if (userDB) {
                        let oldBalance = userDB.balance;
                        let newBalance = oldBalance + 1000;

                        let updates = {};
                        updates['/users/' + userId + '/balance'] = newBalance;
                        firebase.database().ref().update(updates);
                        location.replace('#menu');
                    }
                });
            } else {
                // No user is signed in.
            }
        });
    }

    static getHtml() {
        return html;
    }
}