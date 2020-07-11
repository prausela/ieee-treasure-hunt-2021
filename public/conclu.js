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
                        ¡Has ganado!</br>Tu código ganador es
                    </div>
                </v-col>
            </v-row>
            <div class="d-flex flex-row justify-center">
                <div class="pt-3 mx-5" v-show="showIfNotMobile">
                    <v-img class="hide-gif-mobile" :max-height="getIconHeight" :max-width="getIconWidth" src="./img/winner.gif" alt="image" contain position="center"></v-img>    
                </div>
                <div id="qr-code-winner">
                    <v-img :max-height="getIconHeight" :max-width="getIconWidth" src="./img/loading.png" alt="image" contain position="center"></v-img>    
                </div>
                <div class="pt-3 mx-5" v-show="showIfNotMobile">
                    <v-img :max-height="getIconHeight" :max-width="getIconWidth" src="./img/winner.gif" alt="image" contain position="center"></v-img>    
                </div>
            </div>
            <v-row class="align-center">
                <v-col>
                    <div class="title font-weight-regular font-italic text-center">
                        Querés ganar una pista para el Qué Ves? </br>
                        Compartinos esta pantalla con el texto del codigo por DM o subila a tu historia y arrobanos.
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