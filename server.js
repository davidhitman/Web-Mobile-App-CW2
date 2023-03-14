
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// mongodb connection
const propertiesReader = require("properties-reader");
const propertiesPath = path.resolve(__dirname, "conf/db.properties");
const properties = propertiesReader(propertiesPath);
const dbPprefix = properties.get("db.prefix");

let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");

const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

// setting up express server
const cors = require("cors");
const app = express();

app.set("json spaces", 3);
app.use(morgan("short"));
app.use(bodyParser.json());
app.use(cors()); 
app.use(express.json());

// return json of what is stored in mongodb when the server is called
app.param('collectionName', function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    return next();
});

app.get('/collections/:collectionName', function(req, res, next) {
    req.collection.find({}).toArray(function(err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});

app.put("/collections/:collectionName/:id", function (req, res, next) {
    var id = req.params.id;
    var space = req.body.space;
    req.collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { spaces: -space } },
      function (err, results) {
        if (err) {
          return next(err);
        }
        res.send(results);
      }
    );
});

app.post("/collections/:collectionName", function (req, res, next) {
    xyz = req.body;
    req.collection.insertOne(xyz, function (err, results) {
      if (err) {
        return next(err);
      }
      res.send(results);
    });
});

// logger middleware
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


// port where the app is listenning
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("App start on port:"+port);
});