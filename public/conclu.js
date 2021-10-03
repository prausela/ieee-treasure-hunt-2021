Vue.component('conclu', {
    data() {
        return {
            windowWidth: window.innerWidth,
        }
    },
    template:
        `<v-container>
            <logo :factor="5"></logo>
            <v-row class="align-center">
                <v-col>
                    <div class="display-2 text-center">¡Felicitaciones!</div>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col>
                    <div class="headline text-center">
                        ¡Has ganado!</br>
                    </div>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col>
                    <div class="title font-weight-regular font-italic text-center">
                        No obstante, antes verificaremos que las imagenes subidas correspondan con las respuestas indicadas.<br /><br />¡Felicitaciones!
                    </div>
                </v-col>
            </v-row>
        </v-container>`,
    methods: {
        handleResize() {
            this.windowWidth = window.innerWidth;
        }
    },
    computed: {
        getIconHeight() {
            // return screen.height / 6;
            return 205;
        },
        getIconWidth() {
            // return screen.width / 6;
            return 205;
        },
        showIfNotMobile() {
            return this.windowWidth >= 750;
            // return window.innerWidth >= 750;
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleResize);
    },
  })