  // Set the configuration for your app
  // TODO: Replace with your project's config object
  
  const config = {
    apiKey: "AIzaSyDPvzhnZRLA7wwYDKqautQRD2o2LhOJjdI",
    authDomain: "ieee-day.firebaseapp.com",
    databaseURL: "https://ieee-day-default-rtdb.firebaseio.com",
    projectId: "ieee-day",
    storageBucket: "ieee-day.appspot.com",
    messagingSenderId: "71378570482",
    appId: "1:71378570482:web:14a3461e7ad37b75e6146b"
  }

  firebase.initializeApp(config);

  // Initialize Cloud Functions through Firebase
  // var functions = firebase.functions();
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

  function getWinningCode() {
    return api.fetch('/winning');
  }

  function updateWinNumber(number) {
    return api.set('/winning/number', number + 1);
  }

  function getNext(prevAnswer) {
    prevAnswer = prevAnswer.replace('.', ',');
    return api.fetch('/reverse/\"' + prevAnswer + '\"')
  }