let app = new Vue({ // The Vue instance
    el: '#app',
    data: {
         lessons:[],
         showLesson: true,
         show: false,
         url: "Webstore-env.eba-fu3rpgag.eu-west-2.elasticbeanstalk.com",
         cart:[],
         search:'',
         order: {
            name:'',
            phone:''
        },
    },

    created: function () {
      fetch("http://webstore-env.eba-fu3rpgag.eu-west-2.elasticbeanstalk.com/collections/products")
        .then((response) => response.json())
        .then((lessons) => {
          this.lessons = lessons;
          return;
        });
      // this.getLessons();
      return;
    },

    watch: {
      searchTerm: {
          handler() {
            if(this.searchTerm === "")
              this.getLessons();
          },
          deep: true,
      },
    },
    methods:{ // methods to be used
      getLessons() {
        const url = `${this.url}/collections/products`;
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((lessons) => {
            this.lessons = lessons;
          })
          .catch((Error) => {
            console.log("Error", Error);
          });
      },
      getCartItem(lesson) { // getting the item stored in cart
        for (i = 0; i < this.cart.length; i++) {
          if(this.cart[i].lesson.id === lesson.id) {
              return this.cart[i]
          }
        }
        return null
        },
        addToCart (lesson) { // adding an item to cart
            let cartItem = this.getCartItem(lesson);
            //If item is already in cart, then increase quantity. If not, push lesson to cart
            if (cartItem != null) {
                cartItem.quantity++;
            } else {
                this.cart.push({
                lesson: lesson,
                quantity: 1
                });
            }
            lesson.spaces--;
        },

        addOrders (newOrder){
          fetch("http://webstore-env.eba-fu3rpgag.eu-west-2.elasticbeanstalk.com/collections/order", {
            method: "POST", //set the HTTP method as "POST"
            headers: {
              "Content-Type": "application/json", //set the data type as JSON
            },
            body: JSON.stringify(newOrder) //need to stringigy the JSON
          }).then(
            function(response) {
              response.json().then(
                function(json) {
                console.log("Success: " + json.acknowledged);
                
              }
            )}
          );
        },
          
        checkout() {
          this.cart.forEach(async (lesson) => {
            this.addOrders({
              clientName: this.order.name,
              phone: this.order.phone,
              id: lesson.lesson.id,
              orderName: lesson.lesson.title
            });
          });
          
          alert("Your Order has Been Placed");
          this.cart = [];
        },

        removeItem(item) { // function removing the item from cart
            item.quantity = item.quantity - 1; // remove the item from the quantities in cart
            item.lesson.spaces = item.lesson.spaces + 1; // add the item back to the lesson spaces
            if (item.quantity==0){ // if the quantity of the item is zero the remove the whole item
                let itemIndex = this.cart.indexOf(item); // return the position of the item in the cart array
                this.cart.splice(itemIndex, 1); // remove the item at position itemIndex 
            }
            
        },
        cartCount(id){ // count the items in cart
            let count = 0;
            for(let i=0; i< this.cart.length; i++){
                if (this.cart[i] === id){
                    count ++;
                }
            }
            return count;
        },
        canAddToCart(lesson){ // checking if you can add more items to the cart
            // if the current lesson spaces are not eqaul to zero meaning there's no more lessons to add
            return lesson.spaces > this.cartCount(lesson.id); 
        },
        showCheckout: function() { // check out fuction to show the checkout section when checkout button is clicked
            this.showLesson = this.showLesson? false: true;
        },
      },

    computed:{ // computed functions
        
        totalItems: function(){ // return the total items in cart
            return this.cart.length
        },
        Ascending(){ // arranges items in ascending order
            function compare(a, b){
                if (a.price > b.price) return 1;
                if (a.price < b.price) return -1;
                return 0;
            }
            return this.lessons.sort(compare);
        },
        Descending(){ //  arranges items in Descending order
            function compare(a, b){
                if (a.price > b.price) return -1;
                if (a.price < b.price) return 1;
                return 0;
            }
            return this.lessons.sort(compare);
        },
        enableCheckout: function(){ // function enabling the checkout button
            return this.cart.length > 0;
        },
        enableSubmit: function(){ // function enabling the submit button
            let isnum = /^\d+$/.test(this.order.phone);
            let isletter = /^[A-Za-z]+$/.test(this.order.name);
            return isnum == true && isletter == true
        },
    }
        
});





