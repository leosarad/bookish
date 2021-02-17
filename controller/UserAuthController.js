const User = require('../model/User')
const Bcrypt = require('bcrypt')
const Joi = require('joi')

let validateSignupUser = (user)=>{
     const schema = Joi.object({
          username: Joi.string().min(3).max(50).required(),
          email: Joi.string().min(5).max(255).required().email(),
          password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$!]{3,30}$')),
          confirmPassword: Joi.ref('password')
     })
     let {error} = schema.validate(user)
     if(error)
          error = error.details[0].message
     console.log(error)
     return error
}

let create = (req, res)=>{
     new User(req.body).save()
     res.redirect('/signin')
}

module.exports = {
     create
}