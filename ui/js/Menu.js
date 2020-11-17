import Page from "./Page";
import html from '../views/menu.html';

export default class Menu extends Page {
    constructor() {
        super();

    }

    static getHtml() {
        return html;
    }
}