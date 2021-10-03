Vue.component('thankyou', {
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
                    <div class="display-2 text-center"><br />¡Muchas gracias por participar!</div>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col>
                    <div class="headline text-center">
                        <br />Desafortunadamente, la competencia termin&oacute; :'(<br />
                    </div>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col>
                    <div class="title font-weight-regular text-center">
                        Pronto anunciaremos a los ganadores por lo que les pedimos paciencia.<br />Agradecemos a todos los participantes y esperamos que les haya gustado :)
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