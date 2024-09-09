const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String, //change
        required:true,
        default: 'user'//change
    },
    cart:{
        type:Array,
        required:true,
    }

},{
    timestamps:true
})

module.exports=mongoose.model('users',userSchema)