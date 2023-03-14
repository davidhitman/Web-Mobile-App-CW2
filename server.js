const {MongoClient, ObjectId} = require("mongodb");


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

// setting up express server
const express = require("express");
const app = express();
app.use(express.json());
//var cors = require("cors");
//app.use(cors()); 

// port where the app is listenning
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("App start on port:"+port);
});