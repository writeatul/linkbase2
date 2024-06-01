const mongoose=require("mongoose")
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
// mongoose.connect("mongodb://0.0.0.0:27017/savedBincollection")
.catch((e)=>{
 console.log("connection error "+ e.message)
})

module.exports=mongoose.connection