Vue.component('logo', {
    props: {
        factor: {
          type: Number,
          default: 6
        }
    },
    template:
        `<v-container>
            <div class="d-flex justify-center">
                <v-img :max-height="getIconSize" src="./img/logo.png" alt="logo" contain position="center"></v-img>
            </div>
        </v-container>`,
    computed: {
        getIconSize() {
            return screen.height / this.factor;
        },
    }
  })