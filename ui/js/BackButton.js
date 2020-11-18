export default class BackButton {
    constructor(checkFunction=null, helpMessage='') {
        this.button = document.getElementsByClassName('back-button').item(0);
        this.button.onclick = function () {
            if (checkFunction === null || checkFunction()) {
                location.replace('#menu');
            } else if (helpMessage !== '') {
                alert(helpMessage);
            }
        };
    }
}