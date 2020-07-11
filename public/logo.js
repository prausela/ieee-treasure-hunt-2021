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
                <v-btn icon href="./index.html" :height="getIconSize">
                    <v-avatar :size="getIconSize">
                        <v-img :max-height="getIconSize" src="./img/logo.png" alt="logo" contain position="center"></v-img>
                    </v-avatar>
                </v-btn>
            </div>
        </v-container>`,
    computed: {
        getIconSize() {
            return screen.height / this.factor;
        },
    }
  })