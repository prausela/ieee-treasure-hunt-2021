new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        disabled: true,
        number: 1,
        input: '',
        question: '',
        description: '',
        image: '',
        errorText: '',
        wrong: false,
        quiz: undefined,
        prevAnswer: '',
        algorithm: '',
        errorMessages: [
            'Mmm... no.',
            'Palo y afuera.',
            'Seguí participando.',
            '¡Bien! Ah nono, mal.',
            'I-n-c-o-r-r-e-c-t-o',
            'Seguí pensando, vos podés.',
            'Respuesta correcta not found.',
        ],
    }),
    methods: {
        sendAnswer() {
            if (this.checkAnswer(this.input, this.quiz[this.number].answer)) {
                this.errorText = '';
                this.number++;
                if (this.number < this.quiz.length) {
                    this.printNextQuestion();
                } else {
                    this.goToWinScreen();
                }
            } else {
                this.errorText = this.errorMessages[this.getRandomInt(0, 7)];
            }
            this.input = '';
        },
        checkAnswer(input, answer) {
            if (input.toLowerCase() == answer.toLowerCase()) {
                return true;
            } else {
                return false;
            }
        },
        printNextQuestion() {
            this.question = this.number + '. ' + this.quiz[this.number].question;
            this.description = this.quiz[this.number].description;
            this.image = this.quiz[this.number].image;
        },
        setStartingQuestion() {
            for (var aux = 1; aux < this.quiz.length - 1; aux++) {
                if (this.checkAnswer(this.prevAnswer, this.quiz[aux].answer)) {
                    this.number = aux + 1;
                    break;
                }
            }
        },
        // Retorna un número aleatorio entre min (incluido) y max (excluido)
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        getHashedParam(number) {
            switch (this.algorithm) {
                case "MD5":
                    return new Hashes.MD5().hex(number.toString());
                case "SHA1":
                    return new Hashes.SHA1().hex(number.toString());
                case "SHA256":
                    return new Hashes.SHA256().hex(number.toString());
                case "SHA512":
                    return new Hashes.SHA256().hex(number.toString());
                case "RMD160":
                    return new Hashes.RMD160().hex(number.toString());
                case "Base64":
                    return new Hashes.Base64().hex(number.toString());
                case "CRC32":
                default:
                    return new Hashes.CRC32().hex(number.toString());
            }
        },
        getWinUrl(number) {
            let param = this.getHashedParam(number);
            if (param)
                return "./winner.html?" + param;
            return "./winner.html";
        },
        async getFull() {
            let rta = await getAll()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
                this.disabled = false;
                this.quiz = rta;
                this.setStartingQuestion();
                this.printNextQuestion();
            }
        },
		async goToWinScreen() {
			let rta = await getWinningCode()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
                this.algorithm = rta.algorithm;
                window.location.replace(this.getWinUrl(rta.number));
            }
		}
    },
    computed: {
        /* Dimensions of the components */
        getSize() {
            return screen.width / 13;
        },
        getIconSize() {
            return screen.width / 6;
        },
    },
    mounted () {
        this.prevAnswer = decodeURIComponent(location.search.substr(1));
        this.question = 'Loading...';
        this.image = 'loading.png'
        this.disabled = true;
        this.getFull();
    }
})