const mongoose=require('mongoose');
const mongoURI=process.env.MONGOURI;
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to DB successfully");
    })
}
module.exports=connectToMongo;