new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
		hashCode: '',
    }),
    methods: {
      	generateQr(message) {
			var typeNumber = 4;
			var errorCorrectionLevel = 'L';
			var qr = qrcode(typeNumber, errorCorrectionLevel);
			qr.addData(message);
			qr.make();
			document.getElementById('qr-code-winner').innerHTML = qr.createImgTag(5);
		},
        getHashedString(string) {
            switch (this.algorithm) {
                case "MD5":
                    return new Hashes.MD5().hex(string);
                case "SHA1":
                    return new Hashes.SHA1().hex(string);
                case "SHA256":
                    return new Hashes.SHA256().hex(string);
                case "SHA512":
                    return new Hashes.SHA256().hex(string);
                case "RMD160":
                    return new Hashes.RMD160().hex(string);
                case "Base64":
                    return new Hashes.Base64().hex(string);
                case "CRC32":
                default:
                    return new Hashes.CRC32().hex(string);
            }
        },
		checkHashCode(number) {
			let numberHash = this.getHashedString(number.toString());
			if (!this.hashCode || this.hashCode != numberHash) {
				return false;
			}
			return true;
		},
		getMessage(code, number) {
			return code + number + "\n" + this.getHashedString(code + number.toString());
		},
		async getWinningInfo() {
			let rta = await getWinningCode()
                .catch((error) => {
                    console.error(error);
                });
            if (rta) {
				this.algorithm = rta.algorithm;
				if (this.checkHashCode(rta.number)) {
					this.generateQr(this.getMessage(rta.code, rta.number));
					updateWinNumber(rta.number);
				} else {
					window.location.replace("./index.html");
				}
            }
		}
    },
    mounted () {
		this.hashCode = decodeURIComponent(location.search.substr(1));
		this.getWinningInfo();
    }
  })