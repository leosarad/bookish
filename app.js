const express = require('express')
const router = require('./routes/route')
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const passport = require('passport')
const Handlebars = require('hbs')
const passportSetup = require('./config/passport-setup')
const db = require('./config/db')()
const keys = require('./config/keys')
const app = express()

Handlebars.registerHelper('json',function(obj) {
     return new Handlebars.SafeString(JSON.stringify(obj))
})

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs')
app.use(cookieSession({ maxAge: 24*60*60*1000, keys:[keys.cookie.secret] }));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(router)

app.listen(8000,()=>{
     console.log("Running on port 8000")
})