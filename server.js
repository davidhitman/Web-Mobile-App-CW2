const {MongoClient, ObjectId} = require("mongodb");
var cors = require("cors");

const uri = 'mongodb+srv://David:David.123@webapp.kozhplr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// connecting to the mongodb database
async function connect(){
    try {
        await client.connect()
        console.log("connected to mongodb")
    }catch (error){
        console.error(error)
    }
}
connect();

// definning all fuction that will be in contact with mongodb and
//make all the transactions

// adding to the order table
async function createOrder(order) {
	return await client.db("WebStore").collection("order").insertOne(order);
}

// get the lessons from mongodb
async function getLessons() {
	    return client
    .db("WebStore")
    .collection("products")
    .find().toArray();
}

// update lesson space in mongodb
async function updateLesson(id, space) {
	    return await client
    .db("WebStore")
    .collection("products")
    .updateOne({ _id: ObjectId(id) }, { $inc: { "spaces": -space } });
}

// search for items in mongodb
async function searchLesson(searchTerm) {
        return client
    .db("WebStore")
    .collection("Products")
    .find({
        topic: { $regex: searchTerm, $options: "is" },
    })
    .toArray();
}

// setting up express server
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors()); 

// port where the app is listenning
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("App start on port:"+port);
});