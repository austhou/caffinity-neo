
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const Users = require("./users");

//------------------
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
passport.use(new Strategy(
  function(username, password, cb) {
    Users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
  });
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
//------------------



const API_PORT = 8081;
const app = express();

var whitelist = ['http://localhost:3001', 'https://caffinity.co/beta/index.html']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

/*const corsOptions = {
  origin: 'https://localhost:3001',
  credentials: true,
}*/
app.use(cors(corsOptions));
//app.use(cors());

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


app.use(passport.initialize());
app.use(passport.session());

router.post(
  '/login', 
  passport.authenticate('local',{}),
  function (req, res, next) {
      res.send(req.user)
});

router.get('/logout', function (req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  if (!req.session) {
      res.send('ok')
      return
  }
  req.session.destroy(function () {
      res.send('ok');
  });
});

//----

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
    //console.log(data)
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


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err)
  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    status: err.status,
    stack: err.stack
  });
});


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));


