let mongoose = require('mongoose')
const dbname = require('./keys').db.name


module.exports = ()=>{
     mongoose.connect(`mongodb://localhost/${dbname}`, {
          useNewUrlParser: true, 
          useUnifiedTopology: true,
          useCreateIndex: true,
     })
     .then(() => console.log(`Connected to database: ${dbname}`))
     .catch(err => console.error(`Could not connect to database: ${dbname}`));
}