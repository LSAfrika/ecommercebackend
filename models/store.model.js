const mongoose= require('mongoose')


// const userschema = new 

exports.storemodel = mongoose.model('store',mongoose.Schema({

    storename:{type:String,required:true},
    storeowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    storedeactivated:{type:Boolean,required:true,default:false},
    storeimage:{type:String,required:true ,default:'/default/store.png' },
    membersince:{type:Number,reuired:true,default:Date.now()},
  
},{timestamps:true}

))