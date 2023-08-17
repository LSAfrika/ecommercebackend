const{productmodel}=require('../models/products.model')
const{storemodel}=require('../models/store.model')
const{createproductfolder,updateproductfolder}=require('../uitility/folder.utilities')

exports.createproduct=async(req,res)=>{

    try {
        const {userid,productname,productprice,category}=req.body
        const store=await storemodel.findOne({storeowner:userid})
       
        if(store==null)return res.send({exceptionmessage:'store not found'})
        if (req.files==null) return res.send({exceptionmessage:'please attach image products'})
        // console.log('files to upload',req.files)
   

      //  return
        const new_product= await productmodel.create({
        productname,
        productprice,
        category,
        store:store._id,
        productimages:['/default/store.png'] })

        const productimages= Array.isArray(req.files.product)? req.files.product:[req.files.product]
        console.log('product images:',productimages.length);

        createproductfolder(productimages,new_product._id,res)

        
    } catch (error) {
        console.log('create product error',error.message)
        res.send({errormessage:error.message,error})
    }
}


exports.updateproduct=async(req,res)=>{
    
    try {
        const {productid}=req.params
        const {productprice,productname}=req.body

        console.log('price:',productprice,'\n productname:',productname);
        const producttoupdate= await productmodel.findById(productid)
        if(producttoupdate==null) return res.send({exceptionmessage:'product to update not found'})

        if(productprice)producttoupdate.productprice=productprice
        if(productname)producttoupdate.productname=productname

        await producttoupdate.save()
        
        if(req.files==null) return res.send({message:'product updated',prodcut:producttoupdate})

        const productimages= Array.isArray(req.files.product)? req.files.product:[req.files.product]

        updateproductfolder(productimages,producttoupdate._id,res)



        
    } catch (error) {
        console.log('update product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.deleteproduct=async(req,res)=>{
    
    try {
        
    } catch (error) {
        console.log('delete product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.getallproducts=async(req,res)=>{
    
    try {
        const{pagination}=req.query
        returnsize=2
        skip=returnsize*pagination
        const products=await productmodel.find().skip(skip)
        .populate({path:'store',select:'storename storeimage',model:'store'})
        .limit(returnsize)
        res.send(products)
        
    } catch (error) {
        console.log('get all products error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.getsingleproduct=async(req,res)=>{
    
    try {
        const{productid}=req.params
        const product= await productmodel.findById(productid)
        .populate({path:'store',select:'storename storeimage',model:'store'})

        if(product==null)return res.send({exceptionmessage:'product not found'})
        res.send(product)
        
    } catch (error) {
        console.log('get single product error',error.message)
        res.send({errormessage:error.message,error})
    }
}


exports.getallproductssinglestore=async(req,res)=>{
    
    try {

        const {pagination}=req.query
        returnsize=3
        skip=pagination*returnsize
        const {storeid}=req.params
        const storeproducts= await productmodel.find({store:storeid})
        .populate({path:'store',select:'storename storeimage',model:'store'})
        .skip(skip).limit(returnsize)
        res.send({storeproducts})
        
    } catch (error) {
        console.log('get all products error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.getallproductscategory=async(req,res)=>{
    
    try {
        
        const {categoryid,pagination}=req.query
        returnsize=1
        skip=pagination*returnsize
        const categoryproducts= await productmodel.find({category:categoryid}).skip(skip).limit(returnsize)
        .populate({path:'store',select:'storename storeimage',model:'store'})

        res.send({categoryproducts})

    } catch (error) {
        console.log('get all products category error',error.message)
        res.send({errormessage:error.message,error})
    }
}

