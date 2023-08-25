const mongoose= require('mongoose')


// const userschema = new 

exports.productmodel = mongoose.model('product',mongoose.Schema({

    productname:{type:String,required:true},
    productprice:{type:Number,required:true},
    store:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'store'},
 productdeactivated:{type:Boolean,required:true,default:false},
    productimages:[{type:String,required:true }],
    viewcount:{type:Number,required:true,default:0},
    category:{type:String,required:true,
        enum:['Phones','Men\'s clothes','Men\'s shoes','Tvs','Audio','Women\'s clothes','Women\'s shoes','Baby wear',]}

},{timestamps:true}

))
