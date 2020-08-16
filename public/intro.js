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
            <p class="text-justify"> A lo largo de estas <b>12 preguntas</b>, estaremos probando tu ingenio y creatividad 
            para encontrar la respuesta correcta. Solo así podrás avanzar a la pregunta siguiente y 
            llegar hasta el final de este juego. Tranqui que no tenés que saber nada informático de antemano.</br>
            <b>¡CUIDADO!</b> Acordate la respuesta de la última pregunta que resolviste, la próxima vez que
            entres la va a necesitar para continuar donde dejaste.</br>
            <b>¿PISTAS?</b> Si te quedás trabado en alguna pregunta, mandá un DM a @computer.society.itba, estamos para servirte.</br>
            <v-expansion-panels flat hover>
            <v-expansion-panel>
                <v-expansion-panel-header>¿Qué está en juego (además de tu honor)?</v-expansion-panel-header>
                <v-expansion-panel-content>
                    Las <b>primeras 10</b> personas que suban una historia con la captura de la pantalla ganadora 
                    y nos envíen el texto secreto por privado ganarán <b>1 pista</b> para el Qué ves? Pero eso no es todo. 
                    Si lográs llegar hasta el final antes del <b>Domingo 30/08 a las 23:59</b> y nos compartís 
                    esa pantalla, ganás <b>1 chance</b> para un sorteo que haremos en breve por una Giftcard.</br>
                </v-expansion-panel-content>
            </v-expansion-panel>
            </v-expansion-panels>
            ¡Suerte!
            </p>
            </br>
            <h4>Si conocés alguna respuesta, ingresala acá antes de comenzar para continuar desde donde dejaste.</h4>
            
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