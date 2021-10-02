Vue.component('signup', {
    template:
        `<div>  
            <v-btn color="#146DA2" @click="googleSignIn" dark rounded class="custom-button" large>Ingresa con Google</v-btn>     
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
                    getCurrentQuestion(user).then((curr) =>{
                        window.location = '/questions.html?'+ curr;
                    }).catch((err)=>{
                        window.location = "/questions.html";
                    })
                   
                })
                .catch((err) => {
                    console.log(err); // This will give you all the information needed to further debug any errors
                });
        }
    }

  })