Vue.component('intro', {
    data() {
        return {
            prevAnswer: '',
        }
    },
    template:
        `<v-container>
            <logo></logo>
            <div style="height: 2em;"/>
            <signup v-if="!auth.currentUser" style="display:flex; justify-content: center;"></signup>  
            {{checkIfLoggedIn}}    
        </v-container>`,
    computed: {
        /* Dimensions of the components */
        getSize() {
            return screen.width / 13;
        },
        getIconSize() {
            return screen.width / 6;
        },
        getHref() {
            if (this.prevAnswer)
                return "./questions.html?" + this.prevAnswer;
            return "./questions.html";
        },
        checkIfLoggedIn() {
            auth.onAuthStateChanged((user) => {
                if(user){
                    window.location.href = '/questions.html';
                }
            })
        }
    },
    mounted() {
        this.prevAnswer = '';
    }

  })