const mongoose = require('mongoose')
const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const UserSchema = new mongoose.Schema({
     googleId: {
          type: String,
     },
     facebookId: {
          type: String,
     },
     username: {
          type: String,
          minlength: 1,
          maxlength: 50

     },
     email: {
          type: String,
          minlength: 5,
          maxlength: 255,
     },
     password: {
          type: String,
     },
})

UserSchema.pre('save', function(next){
     // Hash password before save
     if(!this.isModified("password")) {
          return next();
     }
     this.password = Bcrypt.hashSync(this.password, 10);
     return next()
});

UserSchema.post('save', function(){
     console.log("New User Created")
})

UserSchema.methods.validPassword = async function(password){
     const isMatch = await Bcrypt.compare(password, this.password)
     return isMatch
}
UserSchema.methods.createAccessToken = function(){
     const token = jwt.sign({id: this._id}, keys.jwtSecret)
     return token
}

const User = mongoose.model('User', UserSchema);

module.exports = User