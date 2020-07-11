Vue.component('question', {
    props: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      }
    },
    template:
      `<v-container>
        <v-row class="align-center">
          <v-col>
            <div class="headline">{{ title }}</div>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col>
            <div class="title font-weight-regular font-italic text-justify" v-html="description"/>
          </v-col>
        </v-row>
        <v-row class="align-center" v-if="image">
          <v-col>
            <v-img :max-height="getIconSize" :src="getImage" alt="image" contain position="center"></v-img>
          </v-col>
        </v-row>
      </v-container>`,
      computed: {
          getIconSize() {
              return screen.height / 4;
          },
          getImage() {
              return "./img/" + this.image;
          }
      }
  })