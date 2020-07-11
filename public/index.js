new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
      prevAnswer: '',
    }),
    methods: {
      sendAnswer() {
        window.location.assign(this.getHref);
      }
    },
    computed: {
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