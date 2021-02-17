const Collection = require('../../model/BooksCollection/HaveRead')

const create = (req,res)=>{
     console.log("Creating COllection")
     const collectionItem = new Collection(req.body)
     collectionItem.userID = req.user._id
     collectionItem.save().then(response=>{
          res.json({
               message: "Successfully added to 'Have Read' Collection"
          })
     })
}
module.exports = {
     create,
}
