Vue.component('intro', {
    data() {
        return {
            prevAnswer: '',
        }
    },
    template:
        `<v-container>
            <logo></logo>            
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
        }
    },
    mounted () {
        this.prevAnswer = '';
    }
  })