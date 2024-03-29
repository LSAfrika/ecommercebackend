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
        timestamp:{type:Number,require:true,default:Date.now()}
        
        
    }]
},{timestamps:true}))


exports.createordermodel=mongoose.model('createordernotification',mongoose.Schema({

    orderowner:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    storeid:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'store'},
    products:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'product'},
            quantity:{ type:Number,required:true,default:1 },
            productprice:{type:Number},
            sumtotal:{type:Number,required:true,default:0}
        }
            ],
    orderstatus:{type:String,required:true,default:'active',enum:['active','canceled','completed']},
    created:{type:Number,required:true,default:Date.now()},
    ordertotal: {type:Number,required:true,default:this.products?.reduce((total,acc)=>total+acc)||0}


},{timestamps:true}))