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
            "https://petstoreapp2-env.eba-g43aptvw.eu-west2.elasticbeanstalk.com/collections/products"
        )
        .then((response) => response.json())
        .then((lessons) => {
            this.lessons = lessons;
        });
    }
});
