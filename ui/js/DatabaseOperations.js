export default class DatabaseOperations {
    static createUserAndSaveToDatabase(userId, username, email, password, name, surname) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(`Cannot create user - errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
        });

        let database = firebase().database;
        database.ref('users/' + userId).set({
            username: username,
            email: email,
            password: password,
            name: name,
            surname: surname,
            profile_picture : null
        }).then(function () {
            return false;
        });
    }
}