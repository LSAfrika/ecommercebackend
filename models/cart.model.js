const mongoose= require('mongoose')


// const userschema = new 

exports.cartmodel = mongoose.model('cart',mongoose.Schema({

    // cartowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    products:[
        {product:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
        quantity:{ type:Number,required:true,default:1 },
        sumtotal:{type:Number,required:true,default:0}
        }
            ],
    totalprice:{type:Number,required:true,default:0},
    cartcheckedout:{type:Boolean,required:true,default:false}

},{timestamps:true}

))

function totalproductprice(productprice,quantity){

    return productprice * quantity

}