const express = require('express')
const expresslayouts = require("express-ejs-layouts");
const path = require('path')
const dotenv = require('dotenv')
const mongoose =  require('mongoose')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser')
dotenv.config()

const app = express()

//Passport Config
require('./config/passport')(passport);


//Connecting to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDb connected.."))
  .catch((err) => console.log(err));
  
  //BodyParser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))


//ejs
app.use(expresslayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));

//Express Session
app.use(session({
  secret: 'Niraj',
  resave: true,
  saveUninitialized: true,
  // cookie: {secure: true}

}))

//Connect flash
app.use(flash());

//Global Variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//Calling routes
app.use('/', require('./routes/index'))
app.use("/user", require("./routes/user"));
app.use("/admin", require("./routes/admin"));



//PORT
app.listen(process.env.PORT , console.log(`Connected to port ${process.env.PORT}`))