import Page from "./Page";
import html from '../views/table.html';

export default class Table extends Page {
    constructor() {
        super();

    }

    static getHtml() {
        return html;
    }
}