let app = new Vue({ // The Vue instance
    el: '#app',
    data: {
         lessons:lessons,
         showLesson: true,
         show: false,
         cart:[],
         search:'',
         order: {
            name: '',
            phone: ''
        },
    },
    created: function(){
        fetch(
            "Webstore-env.eba-fu3rpgag.eu-west-2.elasticbeanstalk.com"
        )
        .then((response) => response.json())
        .then((lessons) => {
            this.lessons = lessons;
        });
    }
});
