const Collection = require('../../model/BooksCollection/MyFavourites')

const create = (req,res)=>{
     console.log("Creating COllection")
     const collectionItem = new Collection(req.body)
     collectionItem.userID = req.user._id
     collectionItem.save().then(response=>{
          res.json({
               message: "Successfully added to 'MyFavourites' Collection"
          })
     })
}
module.exports = {
     create,
}
