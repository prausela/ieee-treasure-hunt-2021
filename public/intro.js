Vue.component('intro', {
    data() {
        return {
            prevAnswer: '',
        }
    },
    template:
        `<v-container>
            <logo></logo>
            <h3>¡Bienvenido a CS Scavenger Hunt!</h3>
            <p class="text-justify"> A lo largo de estas <b>25 preguntas</b>, estaremos probando tu ingenio y creatividad 
            para encontrar la respuesta correcta. Solo así podrás avanzar a la pregunta siguiente y 
            llegar hasta el final de este juego. Tranqui que no tenés que saber nada informático de antemano.</br>
            <b>¡CUIDADO!</b> Acordate la respuesta de la última pregunta que resolviste, la próxima vez que
            entres la va a necesitar para continuar donde dejaste.</br>
            <b>¿PISTAS?</b> Si te quedás trabado en alguna pregunta, mandá un DM a @computer.society.itba, estamos para servirte.</br>
            ¡Suerte!
            </p>
            </br>
            <h4>Si conocés alguna respuesta, ingresala acá antes de comenzar para continuar desde donde dejaste.</h4>
            
        </v-container>`,
    computed: {
        /* Dimensions of the components */
        // <v-text-field v-on:input="prevAnswer = $event" label="Tu respuesta" clearable background-color="white" solo></v-text-field>
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