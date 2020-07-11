  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyBGSCLGL6Gq3JQU6q9i4kFAwQZ-pbp2Djg",
    authDomain: "cs-scavenger-hunt.firebaseapp.com",
    databaseURL: "https://cs-scavenger-hunt.firebaseio.com",
    storageBucket: "cs-scavenger-hunt.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  var api = class {
      static get timeout() {
          return 60 * 1000;
      }

      static fetch(node) {
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
              reject(new Error('Time out'));
            }, api.timeout);
      
            database.ref(node).once('value')
              .then((response) => {
                clearTimeout(timeout);
                return response;
              })
              .then((data) => {
                if (data.val()) {
                  resolve(data.val());
                } else {
                  reject('Error');
                }
              })
              .catch((error) => {
                reject(error);
              });
          });
      }

      static set(node, data) {
        return new Promise((resolve, reject) => {
            var timeout = setTimeout(() => {
              reject(new Error('Time out'));
            }, api.timeout);
      
            database.ref(node).set(data)
              .then((response) => {
                clearTimeout(timeout);
                return response;
              })
              .then((data) => {
                resolve(data);
              })
              .catch((error) => {
                reject(error);
              });
          });
      }
  }

  function getAll() {
      return api.fetch('/questions');
  }

  function getWinningCode() {
    return api.fetch('/winning');
  }

  function updateWinNumber(number) {
    return api.set('/winning/number', number + 1);
  }