Vue.component('player', {
    template:
        `{{checkIfLoggedIn}}
        <div class="title font-weight-regular text-left" v-if="auth.currentUser" style="margin-top: 2em">
            Se encuentra jugando: <strong style="display:inline-block;">{{auth.currentUser.displayName}} ({{auth.currentUser.email}})</strong><br /><a href="/logout" style="color:white;">¡No soy yo! ¡Salir!</a>
        </div>`,
      computed: {
          checkIfLoggedIn() {
            auth.onAuthStateChanged((user) => {
              if(!user){
                  window.location.href = '/';
              }
            })
          }
      }
  })