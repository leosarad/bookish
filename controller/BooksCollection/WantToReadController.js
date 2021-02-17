const Collection = require('../../model/BooksCollection/WantToRead')

const create = (req,res)=>{
     console.log("Creating COllection")
     const collectionItem = new Collection(req.body)
     collectionItem.userID = req.user._id
     collectionItem.save().then(response=>{
          res.json({
               message: "Book successfully added to 'Want To Read' Collection"
          })
     })
}
module.exports = {
     create,
}
