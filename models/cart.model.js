const mongoose= require('mongoose')


// const userschema = new 


const cartshema= mongoose.Schema({

    // cartowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    products:[
        {product:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
        quantity:{ type:Number,required:true,default:1 },
        productprice:{ type:Number,required:true,default:1 },

        sumtotal:{type:Number,required:true,default:0}
        }
            ],
    totalprice:{type:Number,required:true,default:0},
   

},{timestamps:true}

)
exports.cartmodel = mongoose.model('cart',cartshema)

// cartshema.pre('save', function(next){
//     const totalproductsprice= usercart.products.map(p=>p.sumtotal).reduce(sumofArray)
//     this.totalprice=totalproductsprice

//     next()

// })
exports.carthistorymodel=mongoose.model('completedcarts',mongoose.Schema({
    cartowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    completedcarts:[{
        products:[
            {product:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
            quantity:{ type:Number,required:true,default:1 },
            sumtotal:{type:Number,required:true,default:0}
            }
                ],
        totalprice:{type:Number,required:true,default:0},
        
        
    }]
}))


function sumofArray(sum, num) {
    return sum + num;
}