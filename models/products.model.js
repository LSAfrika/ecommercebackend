const mongoose= require('mongoose')


// const userschema = new 

exports.productmodel = mongoose.model('product',mongoose.Schema({

    productname:{type:String,required:true},
    productprice:{type:Number,required:true},
 
    productimages:[{type:String,required:true }],
    category:{type:String,required:true,
        enum:['Phones','Men\'s clothes','men\'s shoes','Tvs','Audio','Women\'s clothes','Women\'s shoes','Baby wear',]}

},{timestamps:true}

))
