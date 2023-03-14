let app = new Vue({ // The Vue instance
    el: '#app',
    data: {
         lessons:[],
         showLesson: true,
         show: false,
         cart:[],
         search:'',
         order: {
            name: '',
            phone: ''
        },
    },
});
