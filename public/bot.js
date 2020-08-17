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
        answer: '',
        errorText: '',
        prevAnswer: '',
        algorithm: '',
        winner: false,
        block: undefined,
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
            this.input = this.normalizeInput(this.input);
            if (this.checkAnswer(this.input, this.answer)) {
                this.errorText = '';
                this.prevAnswer = this.input;
                this.number++;
                if (this.number <= 12) {
                    this.printLoading();
                    this.getNextQuestion();
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
            if (this.getHashedParam(input, "SHA512") == answer) {
                return true;
            } else {
                return false;
            }
        },
        printNextBlock(block) {
            this.number = block.number;
            this.question = this.number + '. ' + block.question;
            this.description = block.description;
            this.image = block.image;
            this.answer = block.answer;
            this.disabled = false;
        },
        printLoading() {
            this.question = this.number + '. ' + 'Loading...';
            this.description = '';
            this.image = 'loading.png';
            this.answer = '';
            this.disabled = true;
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

        async getNextQuestion() {
            let rta = await getNext(this.prevAnswer)
                .catch((error) => {
                    // console.error(error);
                });
            if (rta) {
                this.printNextBlock(rta);
            } else {
                this.prevAnswer = 'init';
                this.getNextQuestion();
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
        if (!this.prevAnswer) {
            this.prevAnswer = 'init';
        } else {
            this.prevAnswer = this.normalizeInput(this.prevAnswer);
        }
        this.number = '-';
        this.printLoading();
        this.winner = false;
        this.getNextQuestion();
    }
})