
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
app.use(cors());

const router = express.Router();


const dbRoute = "mongodb://cafeadmin:cafeadmin1@ds163255.mlab.com:63255/caffinity";

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to db"));

db.on("error", console.error.bind(console, "MOngoDB error"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
});

router.get("/getRange/:minLat/:maxLat/:minLng/:maxLng", (req, res) => {
  var minLat = parseFloat(req.params.minLat);
  var maxLat = parseFloat(req.params.maxLat);
  var minLng = parseFloat(req.params.minLng);
  var maxLng = parseFloat(req.params.maxLng);

  console.log("#"+minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)
  
  Data.find({

    //"placesData.geometry.location.lat" : { $gte: parseFloat(minLat) }
    $and: [
      {
        "placesData.geometry.location.lat": {
          $gte: minLat,
          $lt: maxLat
        }
      },
      {
        "placesData.geometry.location.lng": {
          $gte: minLng,
          $lt: maxLng
        }
      }
    ]
  }, (err, data) => {
    console.log(data)
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
    const { id } = req.body;
    Data.findOneAndDelete(id, err => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
    let data = new Data();
  
    const { id, placesData, ratingWifi, ratingPower, ratingFood } = req.body;
  
    if ((!id && id !== 0) || !placesData) {
      return res.json({
        success: false,
        error: "INVALID INPUTS"
      });
    }
    data.placesData = {...placesData};
    data.id = id;
    data.ratingWifi = ratingWifi;
    data.ratingPower = ratingPower;
    data.ratingFood = ratingFood;
    data.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

