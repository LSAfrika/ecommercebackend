const mongoose= require('mongoose')


// const userschema = new 

exports.storemodel = mongoose.model('store',mongoose.Schema({

    storename:{type:String,required:true},
    storeowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},

 
    storeimage:{type:String,required:true ,default:'/default/store.png' },
    storeproducts:[{type:String }],
    membersince:{type:Number,reuired:true,default:Date.now()},
  
},{timestamps:true}

))