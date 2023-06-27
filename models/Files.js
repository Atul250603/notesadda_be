const mongoose=require('mongoose');
const {Schema}=mongoose;
const Files=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    fileContent:{
        type:String,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('files',Files);