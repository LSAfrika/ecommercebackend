const mongoose= require('mongoose')


// const userschema = new 

exports.productmodel = mongoose.model('product',mongoose.Schema({

    productname:{type:String,required:true},
    productprice:{type:Number,required:true},
    store:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'store'},
    productdeactivated:{type:Boolean,required:true,default:false},
    productimages:[{type:String,required:true }],
    productdescription:{type:String,required:true ,default:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, debitis.'},
    productspecification:[{type:String,required:true }],
    productquantity:{type:Number,required:true,default:1},
    viewcount:{type:Number,required:true,default:0},
    totalsold:{type:Number,required:true,default:0},
    category:{type:String,required:true,
      enum:['Phones','Laptops','Desktops','Tvs','Home theatres','monitors','Head sets','game console']},
    brand:{type:String,required:true,
      enum:['Samsung','Hp','Dell','Lenovo','Acer','Sony','Apple','Xiaomi','Tecno','Infinix','Hotpoint','Oppo','Huawei','Awei','Oraimo','Lg','Hisense','Synix','Nokia','other']}

},{timestamps:true}

))
