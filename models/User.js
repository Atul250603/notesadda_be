const mongoose=require('mongoose');
const { Schema } = mongoose;
const User=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    coins:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model('user',User);