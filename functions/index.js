const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateWinNumber = functions.https.onCall((data, context) => {
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    const number = data.number;
    return admin.database().ref('/winning/number').set(number + 1).then(() => {
            console.log('Updated win number');
        })
        .catch((error) => {
            // Re-throwing the error as an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('unknown', error.message, error);
        });    
});

exports.validateAnswer = functions.https.onRequest((data, context) => {
    return cors(data, context, function () {
        const current = data.current;
        const total = data.total;
        const input = data.input;
        admin.database().ref('/questions/' + current + '/answer').once('value')
            .then((response) => {
                if (checkAnswer(input, response)) {
                    if (current < total) {
                        console.log('next');
                    }
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.error(error);
            });
    });
});

function checkAnswer(input, answer) {
    // No distingue tildes
    input = input.replace('á', 'a');
    input = input.replace('é', 'e');
    input = input.replace('í', 'i');
    input = input.replace('ó', 'o');
    input = input.replace('ú', 'u');
    // Case insensitive
    if (input.toLowerCase() == answer.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}