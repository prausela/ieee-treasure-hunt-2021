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
        image_upload: false,
        image_ref: undefined,
        last_question: false,
        image_url: {},
        images: [],
        image_questions: [],
        answered: false,
        can_upload_later: false,
        answer: '',
        errorText: '',
        errorTextForImages: '',
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
            if(this.image_upload){
                if(!this.answered){
                    if(this.checkAnswer(this.input, this.answer)){
                        this.errorText = '';
                        this.answered = true;
                        this.prevAnswer = this.input;
                        if(this.images){
                            auth.onAuthStateChanged((user) =>{
                                this.images.forEach((image) => {
                                    this.getImageQuestion(user, image);
                                })
                            })
                        }
                    } else {
                        this.errorText = this.errorMessages[this.getRandomInt(0, 7)];
                    }
                }
            } else if (this.checkAnswer(this.input, this.answer)) {
                this.errorText = '';
                this.prevAnswer = this.input;
                this.number++;
                if (this.number <= 16) {
                    this.printLoading();
                    auth.onAuthStateChanged((user) =>{
                        this.getNextQuestion(user, undefined);
                        this.saveProgress(user, undefined)
                    })
                } else {
                    auth.onAuthStateChanged((user) =>{
                        this.saveProgress(user, undefined);
                    })
                    this.goToWinScreen();
                }
            } else {
                this.errorText = this.errorMessages[this.getRandomInt(0, 7)];
            }
            this.input = '';
        },
        sendImages() {
            
            let correctAnswer = true;
            if(this.last_question){
                this.image_questions.forEach((image_question)=>{
                    if(!this.image_url[image_question.image_upload_ref])
                        correctAnswer = false
                })
            }
            
            if(!this.last_question || (this.last_question && correctAnswer) ){
                this.image_questions = [];
                this.answered = false;
                this.errorText = '';
                this.number++;
                this.errorTextForImages = ''
                if (this.number <= 16) {
                    this.printLoading();
                    auth.onAuthStateChanged((user) =>{
                        this.getNextQuestion(user, this.image_url);
                        this.saveProgress(user, this.image_url)
                    })
                } else {
                    auth.onAuthStateChanged((user) =>{
                        this.saveProgress(user, this.image_url);
                    })
                    this.goToWinScreen();
                }
            } else {
                this.errorTextForImages = 'En la última pregunta debe ingresar las imagenes obligatoriamente para continuar'
                this.image_questions.forEach((image_question)=>{
                    this.image_url[image_question.image_upload_ref] = ''
                })
            }
        },
        sendImagesLater() {
            this.answered = false;
            this.image_questions.forEach((image_question)=>{
                this.image_url[image_question.image_upload_ref] = ''
            })
            this.image_questions = [];
            this.errorText = '';
            this.number++;
            if (this.number <= 16) {
                this.printLoading();
                auth.onAuthStateChanged((user) =>{
                    this.getNextQuestion(user, undefined);
                    this.saveProgress(user, undefined)
                })
            } else {
                auth.onAuthStateChanged((user) =>{
                    this.saveProgress(user, undefined);
                })
                this.goToWinScreen();
            }
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
            this.last_question = block.last_question;
            this.can_upload_later = block.can_upload_later
            this.description = block.description;
            this.image = block.image;
            this.image_upload = block.image_upload;
            this.image_ref = block.image_upload_ref;
            this.images = block.images;
            this.answer = block.answer;
            this.disabled = false;
        },
        printLoading() {
            this.question = this.number + '. ' + 'Loading...';
            this.description = '';
            this.can_upload_later = false;
            this.image = 'loading.png';
            this.answer = '';
            this.image_upload = false;
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

        async getImageQuestion(user, question_hash){
            const rta = await getQuestion(question_hash);
            const isInDB = await checkIfImageIsInDB(user, question_hash);

            if(!isInDB){
                this.image_questions.push(rta);
            }
            
        },
        async saveProgress(user, image_url){
            save(this.prevAnswer, image_url, user)
        },
        async getNextQuestion(user, image_url) {
            let rta = await getNext(this.prevAnswer, image_url, user)
                .catch((error) => {
                    // console.error(error);
                });
            if (rta) {
                this.printNextBlock(rta);
            } else {
                this.prevAnswer = 'init';
                auth.onAuthStateChanged((user) =>{
                    this.getNextQuestion(user, image_url);
                })
            }
        },
		async goToWinScreen() {
            this.winner = true;
			/*let rta = await getWinningCode()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
                this.algorithm = rta.algorithm;
                //this.generateQr(this.getMessage(rta.code, rta.number));
                updateWinNumber(rta.number);
            }*/
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
        auth.onAuthStateChanged((user) =>{
            getCurrentQuestion(user).then((ans)=>{
                this.prevAnswer = ans;
                this.getNextQuestion(user, undefined).then(() => {
                    if(this.number > 16){
                        this.goToWinScreen();
                    } else {
                        this.saveProgress(user, undefined)
                    }
                });                
            }).catch(err => {
                this.getNextQuestion(user, undefined);
            })
        })
    }
})