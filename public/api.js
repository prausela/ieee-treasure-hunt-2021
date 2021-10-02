  // Set the configuration for your app
  // TODO: Replace with your project's config object
  
  const config = {
    apiKey: "AIzaSyDo-R7sCXtE2YUpF7DdZ-lfCrZ8H8N6ys4",
    authDomain: "ieee-day-e4a88.firebaseapp.com",
    databaseURL: "https://ieee-day-e4a88-default-rtdb.firebaseio.com",
    projectId: "ieee-day-e4a88",
    storageBucket: "ieee-day-e4a88.appspot.com",
    messagingSenderId: "389179952213",
    appId: "1:389179952213:web:32ccc991583c8c442a58dc",
    measurementId: "G-25QK9QHC2W"
  }

  firebase.initializeApp(config);
  

  // Initialize Cloud Functions through Firebase
  // var functions = firebase.functions();
  // Get a reference to the database service
  var database            = firebase.database();
  var auth                = firebase.auth();
  var googleAuthProvider  = new firebase.auth.GoogleAuthProvider();

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

  function getNext(prevAnswer, image_url, user) {
    prevAnswer = prevAnswer.replace('.', ',');
    let ans = api.fetch('/reverse/\"' + prevAnswer + '\"');
    if(image_url)
      uploadImage(image_url, user)
    autoSave(prevAnswer, user);
    return ans;
  }

  function autoSave(key, user){
    const users = database.ref('/users/' + user.uid);
    users.update({
      "0" : key 
    });
  }

  function uploadImage(image_url, user){
    const users = database.ref('/users/' + user.uid);
    console.log(image_url)
    users.update(image_url)
  }

  async function checkIfImageIsInDB(user, question_hash){
    const question = await api.fetch('/questions/' + question_hash);
    console.log(user)
    const user_info = await api.fetch('/users/' + user.uid);
    console.log("pan")
    console.log(question)
    console.log(question.image_upload_ref)
    console.log(user_info)
    if(user_info[question.image_upload_ref]){
      return true;
    }
    return false;
  }

  function getQuestion(question_hash) {
    return api.fetch('/questions/' + question_hash);
  }

  async function getCurrentQuestion(user){
    const curr_user = await api.fetch('/users/' + user.uid);
    console.log(curr_user);
    return curr_user[0];
  }