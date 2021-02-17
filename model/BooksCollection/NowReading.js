const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
     GBID: {
          type: String,
     },
     title: {
          type: String
     },
     author: {
          type: String
     },
     thumbnail: {
          type: String
     },
     userID: {
          type: String,
     }
})

collectionSchema.post('save', function(){
     console.log("Book added to collection 'Now Reading'")
})


const NowReadingCollection = mongoose.model('NowReadingCollection', collectionSchema);

module.exports = NowReadingCollection