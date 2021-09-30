Vue.component('signup', {
    template:
        `<div>  
            <v-btn color="black" @click="googleSignIn" dark rounded class="custom-button" large>Ingresa con Google</v-btn>     
        </div>`,
    methods:{
        googleSignIn() {
            let provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            })
            firebase
                .auth()
                .signInWithPopup(provider)
                .then((result) => {
                    let token = result.credential.accessToken;
                    let user = result.user;
                        console.log(token) // Token
                        console.log(user) // User that was authenticated
                    window.location = '/questions.html';
                })
                .catch((err) => {
                    console.log(err); // This will give you all the information needed to further debug any errors
                });
        }
    }

  })