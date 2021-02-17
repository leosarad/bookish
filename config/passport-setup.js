const passport = require('passport')
const Google = require('passport-google-oauth20').Strategy
const Facebook = require('passport-facebook')
const Local = require('passport-local')


const User  = require('../model/User')
const googleKeys = require('./keys').google
const facebookKeys = require('./keys').facebook

passport.serializeUser((user, done) => {
     done(null, user.id);
});

passport.deserializeUser(( id, done) => {
     User.findById(id).then(user => {
          done(null, user);
     });
});

// Google Strategy
passport.use(
     new Google({
          // options for the google strategy
          clientID: googleKeys.clientID,
          clientSecret: googleKeys.clientSecret,
          callbackURL: "/auth/google/return"
     }, (accessToken, refreshToken, profile, done)=>{
          console.log("Google User");
          User.findOne({googleId: profile.id}).then((user)=>{
               if(user){
                 //if we already have a record with the given profile ID
                    done(null, user)
               } else{
                    //if not, create a new user 
                   new User({
                     googleId: profile.id,
                     username: profile.displayName,
                     email: profile.emails[0].value
                   }).save().then((user) =>{
                         done(null, user);
                   });
               } 
          })
     })
)

// Facebook Strategy
passport.use(
     new Facebook({
          // options for the facebook strategy
          clientID: facebookKeys.clientID,
          clientSecret: facebookKeys.clientSecret,
          callbackURL: "/auth/facebook/return"
     }, (accessToken, refreshToken, profile, done)=>{
          User.findOne({facebookId: profile.id}).then((currentUser)=>{
               if(currentUser){
                 //if we already have a record with the given profile ID
                    done(null, currentUser)
               } else{
                    //if not, create a new user 
                    console.log(profile)
                   new User({
                         facebookId: profile.id,
                         username: profile.displayName,
                     }).save().then((newUser) =>{
                     done(null, newUser);
                   });
                } 
             })
     })
)

passport.use(new Local({
     usernameField: 'email',
     passwordField: 'password',
     session: false
   },
     function(username, password, done) {
          User.findOne({ email: username }, async function(err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false);
            }
            const validPassword = await user.validPassword(password)
            if(validPassword){
               return done(null, user);
          }
            else
               return done(null, false);
          });
     }
));