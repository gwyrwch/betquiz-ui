import Page from "./Page";
import html from '../views/profile.html';
import Modal from "./Modal";

export default class Profile extends Page {
    constructor() {
        super();

        let self = this;
        self.setPaymentInFormationButtonOnclick();
    }

    setPaymentInFormationButtonOnclick() {
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