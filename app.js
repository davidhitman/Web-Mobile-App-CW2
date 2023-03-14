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
    methods:{ // methods to be used
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
        submitForm(){ // the alert message displayed when the form is submited
            alert(
                "Order submited"
                )
        }
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
        searchLesson () { // function searching for the lesson
            tempLessons = this.lessons;

            if (this.search != '' && this.search) {
                tempLessons = tempLessons.filter((item) => {
                    return item.title.toUpperCase().includes(this.search.toUpperCase()) 
                    //item.Location.toUpperCase().includes(this.search.toUpperCase())
                })
            
            }
            return tempLessons
        }

    }
        
})