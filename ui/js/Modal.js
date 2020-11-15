export default class Modal {
    static showModal(modalId) {
        let modalHtml = document.getElementById(modalId);
        modalHtml.style.display = 'block';
    }

    static hideModal(modalId) {
        let modalHtml = document.getElementById(modalId);
        modalHtml.style.display = 'none';
    }
}