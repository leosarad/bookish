const Collection = require('../../model/BooksCollection/NowReading')

const create = (req,res)=>{
     console.log("Creating Collection")
     const collectionItem = new Collection(req.body)
     collectionItem.userID = req.user._id
     collectionItem.save().then(response=>{
          res.json({
               message: "Successfully added to 'Now Reading' Collection"
          })
     })
}
module.exports = {
     create,
}
