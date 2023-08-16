const mongoose= require('mongoose')


// const userschema = new 

exports.usermodel = mongoose.model('user',mongoose.Schema({

    email:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String },
    firebaseuniqueid:{type:String},
    profileimg:{type:String,required:true,default:'/default/profile.png' },
    mystores:{type:mongoose.Schema.Types.ObjectId,ref:'store'},
    fovoritestores:[{type:String}]

},{timestamps:true}

))
