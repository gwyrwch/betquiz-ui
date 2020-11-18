export default class BackButton {
    constructor(decorator=null) {
        this.button = document.getElementsByClassName('back-button').item(0);
        this.button.onclick = function () {
            if (decorator) {
                decorator();
            }
            location.replace('#menu');
        };
    }
}