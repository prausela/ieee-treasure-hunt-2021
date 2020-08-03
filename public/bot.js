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
        winner: false,
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
        normalizeInput(input) {
            // No distingue tildes
            input = input.replace('á', 'a');
            input = input.replace('é', 'e');
            input = input.replace('í', 'i');
            input = input.replace('ó', 'o');
            input = input.replace('ú', 'u');
            // Case insensitive
            return input.toLowerCase();
        },
        checkAnswer(input, answer) {
            // if (this.normalizeInput(input) == answer.toLowerCase()) {
            if (this.getHashedParam(this.normalizeInput(input), "SHA512") == answer) {
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
        getHashedParam(value, algorithm) {
            switch (algorithm) {
                case "MD5":
                    return new Hashes.MD5().hex(value.toString());
                case "SHA1":
                    return new Hashes.SHA1().hex(value.toString());
                case "SHA256":
                    return new Hashes.SHA256().hex(value.toString());
                case "SHA512":
                    return new Hashes.SHA512().hex(value.toString());
                case "RMD160":
                    return new Hashes.RMD160().hex(value.toString());
                case "Base64":
                    return new Hashes.Base64().hex(value.toString());
                case "CRC32":
                default:
                    return new Hashes.CRC32().hex(value.toString());
            }
        },
        getWinUrl(number) {
            let param = this.getHashedParam(number, this.algorithm);
            if (param)
                return "./winner.html?" + param;
            return "./winner.html";
        },

        generateQr(message) {
			var typeNumber = 4;
			var errorCorrectionLevel = 'L';
			var qr = qrcode(typeNumber, errorCorrectionLevel);
			qr.addData(message);
			qr.make();
			document.getElementById('qr-code-winner').innerHTML = qr.createImgTag(5);
		},
		getMessage(code, number) {
			return code + number + "\n" + this.getHashedParam(code + number.toString(), this.algorithm);
		},
        async getFull() {
            let rta = await getAll()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
                this.disabled = false;
                this.quiz = rta;
                if (this.prevAnswer) {
                    this.setStartingQuestion();
                }
                this.printNextQuestion();
            }
        },
		async goToWinScreen() {
            this.winner = true;
			let rta = await getWinningCode()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
                this.algorithm = rta.algorithm;
                // window.location.replace(this.getWinUrl(rta.number));
                this.generateQr(this.getMessage(rta.code, rta.number));
                updateWinNumber(rta.number);
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
        this.winner = false;
        this.getFull();
    }
})