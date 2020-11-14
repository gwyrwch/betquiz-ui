import Page from "./Page";
import html from '../views/signInUp.html';

export default class SignInUp extends Page {
    constructor() {
        super();

    }

    static getHtml() {
        return html;
    }
}