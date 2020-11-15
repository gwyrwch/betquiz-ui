import Page from "./Page";
import html from '../views/signInUp.html';

export default class SignInUp extends Page {
    constructor() {
        super();

        let self = this;

        self.setSignInUpButtonsOnclick();
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