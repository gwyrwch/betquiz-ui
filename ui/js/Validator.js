export default class Validator {
    static isAlpha(name) {
        return /^[a-zA-Z]+$/.test(name);
    }

    static calculateAge(birthday) { // birthday is a date
        let ageDifMs = Date.now() - birthday.getTime();
        let ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    static isCorrectPassportId(passportId) {
        return /[a-zA-Z][a-zA-Z]\d\d\d\d\d\d\d/.test(passportId);
    }
}