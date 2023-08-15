const mongoose= require('mongoose')


// const userschema = new 

exports.cartmodel = mongoose.model('cart',mongoose.Schema({

    cartowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    products:[{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'}],
    totalprice:{type:Number,required:true,default:0},
    cartcheckedout:{type:Boolean,required:true,default:false}

},{timestamps:true}

))
