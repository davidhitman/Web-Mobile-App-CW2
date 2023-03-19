
var express = require("express");
var path = require("path");
var morgan = require("morgan");
var cors = require("cors");
var fs = require("fs");
var app = express();

let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

app.set("json spaces", 3);
app.use(morgan("short"));
app.use(cors());
app.use(express.json());  //we need this to parse json received in the requests
                          //(e.g., to read json passed in req.body)

/* app.use(function (req, res, next) {
    console.log("Request URL:" + req.url);
    console.log("Request Date:" + new Date());
    next();
}); */


app.param("collectionName", function (req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
  });

app.get("/collections/:collectionName", function (req, res, next) {

  req.collection.find({}).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
      res.send(results);
    });
  });
  
  app.post("/collections/:collectionName", function (req, res, next) {
    xyz = req.body;
    // req.body.id = new ObjectId();
    req.collection.insertOne(xyz, function (err, results) {
      if (err) {
        return next(err);
      }
      res.send(results);
    });
  });




// Logger middleware
app.use(function (req, res, next) {
  console.log("Request URL:" + req.url);
  console.log("Request Date:" + new Date());
  next();
});
// Static file middleware
var staticPath = path.join(__dirname, "pics");
app.use("/pics", express.static(staticPath));

app.use(function (req, res) {
  res.status(404);
  res.send("File not found!");
});

// listening to the port 3000 
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("App started on port: " + port);
});