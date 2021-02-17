const Joi = require('joi')

let authCheck = (req, res, next)=>{
     if(!req.user){
       res.cookie('error', "Please signin first", {maxAge:1000, httpOnly:true})
       console.log("Signin First")
       return res.redirect('/')
     }
     next()
}

let validateSignin = (req, res, next)=>{
     let {email, password} = req.body
     const schema = Joi.object({
          email: Joi.string().min(5).max(255).required().email(),
          password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$!]{8,30}$'))
     })
     let {error} = schema.validate({email, password})
     
     if(error){
          const path= error.details[0].path
          if(path=="email")
               res.cookie('error', "Invalid email provided", {maxAge:2000, httpOnly:true})
          if(path=="password")
               res.cookie('error', "Invalid password provided", {maxAge:2000, httpOnly:true})
          console.log("Login Error")
          return res.redirect('/signin')     
     }
     next()
}

let validateSignup = (req, res, next)=>{
     let {username, email, password, confirmPassword} = req.body
     const schema = Joi.object({
          username: Joi.string().min(1).max(50).required(),
          email: Joi.string().min(5).max(255).required().email(),
          password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$!]{8,30}$')),
          confirmPassword: Joi.ref('password')
     })

     let {error} = schema.validate({username, email, password, confirmPassword})
     if(error){
          const path= error.details[0].path
          console.log(path)
          if(path=="username")
               res.cookie('error', "username required", {maxAge:2000, httpOnly:true})
          if(path=="email")
               res.cookie('error', "Invalid email provided", {maxAge:2000, httpOnly:true})
          if(path=="password")
               res.cookie('error', "Invalid password provided", {maxAge:2000, httpOnly:true})
          if(password != confirmPassword) 
               res.cookie('error', "Password and Confirm Password should match", {maxAge:2000, httpOnly:true})
          res.redirect('/signup')     
     }
     next()
}

module.exports = {
     authCheck,
     validateSignin,
     validateSignup,
}