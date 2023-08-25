const{productmodel}=require('../models/products.model')
const{storemodel}=require('../models/store.model');
const { usermodel } = require('../models/user.model');
const{createproductfolder,updateproductfolder}=require('../uitility/folder.utilities')
const fs = require("fs");

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

        if(producttoupdate.productimages.length>=6) return res.send({message:'product updated',exceptionmessage:'a product can\'t have more than 6 images'})
        const productimages= Array.isArray(req.files.product)? req.files.product:[req.files.product]

        updateproductfolder(productimages,producttoupdate._id,res)



        
    } catch (error) {
        console.log('update product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.deleteproduct=async(req,res)=>{
    
    try {
        const {productid}=req.params
        const {userid}=req.body

        const store=await storemodel.findOne({storeowner:userid})
       
        if(store==null)return res.send({exceptionmessage:'store not found'})

      
        const producttodelete= await productmodel.findById(productid)
        if(producttodelete==null) return res.send({exceptionmessage:'product to delete not found'})

        if(producttodelete.store.toString() !==store._id.toString())return res.send({exceprionmessage:'store product missmatch',productstoreid:producttodelete.store,storeid:store._id})

        fs.rm(`./public/products/${producttodelete._id}`, { recursive: true }, err => {
            if (err) {
              throw err
            }
          
            console.log(`${producttodelete._id} is deleted!`)
          });

        await productmodel.deleteOne({_id:producttodelete._id})

        res.send({message:'product deleted'})
        
    } catch (error) {
        console.log('delete product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.deleteproductimage=async(req,res)=>{
 try {
        const {productid}=req.params
        const {index}=req.query
        const {userid}=req.body
             console.log(index);
        if(index==-1||index==undefined)return res.send({exceptionmessage:'index to delete not provided'})
        const store=await storemodel.findOne({storeowner:userid})
       
        if(store==null)return res.send({exceptionmessage:'store not found'})

      
        const producttodeleteimage= await productmodel.findById(productid)
        if(producttodeleteimage==null) return res.send({exceptionmessage:'product to delete not found'})

        if(producttodeleteimage.store.toString() !==store._id.toString())return res.send({exceprionmessage:'store product missmatch',productstoreid:producttodeleteimage.store,storeid:store._id})

// console.log(producttodeleteimage);
if(producttodeleteimage.productimages.length==1)return res.send({exceptionmessage:'product has to have an image can\'t delete last image'})
if(producttodeleteimage.productimages.length-1<index)return res.send({exceptionmessage:'index greater than length of productimages'})

        const imagepath=producttodeleteimage.productimages[index]
        const imagetodelete=producttodeleteimage.productimages[index].split('/')
        const imagename=imagetodelete[imagetodelete.length-1]




        
        
        console.log('filename for deleteion',imagename);
        
        if(fs.existsSync(`./public/${imagepath}`)==true) console.log('file exists');
        if(fs.existsSync(`./public/${imagepath}`)==false) return res.send({exceptionmessage:'file dosen\'t exist'})
        



       // return res.send({imagename})


        fs.unlinkSync(`./public/${imagepath}`, err => {
            if (err) {
              throw err
            }
          
            console.log(`${imagename} is deleted!`)
          });

          producttodeleteimage.productimages.splice(index,1)

          await producttodeleteimage.save()

        res.send({message:`product image at index ${index} has been deleted`,product:producttodeleteimage})
        
    } catch (error) {
        console.log('delete product image error',error.message)
        res.send({errormessage:error.message,error})
    }
}


exports.getallproducts=async(req,res)=>{
    
    try {
        const{pagination}=req.query
        returnsize=2
        skip=returnsize*pagination
        const products=await productmodel.find({productdeactivated:false}).sort({createdAt:-1})
        //.skip(skip)
        .populate({path:'store',select:'storename storeimage',model:'store'})
        //.limit(returnsize)
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
        if(product.productdeactivated==true) return  res.status(404).send({message:'product not found'})
        if(product.productdeactivated==false) {

            product.viewcount=product.viewcount+1

            await product.save()
            res.send(product)
        }  
        
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
        const storeproducts= await productmodel.find({$and:[{store:storeid},{productdeactivated:false}]}).sort({createdAt:-1})
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
        const categoryproducts= await productmodel.find({$and:[{category:categoryid},{productdeactivated:false}]}).sort({createdAt:-1}).skip(skip).limit(returnsize)
        .populate({path:'store',select:'storename storeimage',model:'store'})

        res.send({categoryproducts})

    } catch (error) {
        console.log('get all products category error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.addremovefavoriteproduct=async(req,res)=>{
    try {

        const{userid}=req.body
        const{productid}=req.params

        const user=await usermodel.findById(userid).select('favoriteproducts')
        const product=await productmodel.findById(productid)
        if(user==null) return res.send({exceptionmessage:'user not found'})
        if(product==null) return res.send({exceptionmessage:'product not found'})

console.log('fetched user',user);

        // if(user.favoriteproducts.length==0){
        //     user.favoriteproducts.push(productid)
        //     await user.save()
        //     return res.send({message:'initial favorite product add ',user})

        // }
        indexofproduct=user.favoriteproducts.map(id=>id.product.toString()).indexOf(productid)

        if(indexofproduct !=-1){
            user.favoriteproducts.splice(indexofproduct,1)
            await user.save()
            return res.send({message:'favorite product removed ',user})
        }
        if(indexofproduct ==-1){

            const producttosave={
                product:productid,
                store:product.store
            }
            user.favoriteproducts.push(producttosave)
            await user.save()
            return res.send({message:'favorite product added ',user})
        }
     


        
    } catch (error) {

        res.send({errormessage:'error in post method for adding/removing product',error:error.message})
        
    }
}

exports.getfavoriteproducts=async(req,res)=>{
    try {

        const{userid}=req.body
       

        const userfavoriteproducts=await usermodel.findById(userid)
        .select('favoriteproducts')
        // .populate({path:'favoriteproducts',select:'productname productprice category store' })
        .populate({path:'favoriteproducts',populate:{path:'product',select:'productname productprice productdeactivated category productimages'}})
        .populate({path:'favoriteproducts',  populate:{path:'store',select:'storename storeimage'}})
  
  

        // .populate({path:'favoriteproducts',select})
      
        if(userfavoriteproducts==null) return res.send({exceptionmessage:'user not found'})

        // const singleproductimage=userfavoriteproducts.productimages[0]
        // const favoriteproductsresponse={
        //     ...userfavoriteproducts,
        //     productimages:singleproductimage
        // }


        userfavoriteproducts.favoriteproducts.forEach(favproduct => {
            singleproductimage=favproduct.product.productimages[0]
            favproduct.product.productimages=[singleproductimage]
          
            
        });
        res.send({userfavoriteproducts})


        
    } catch (error) {
        
        res.send({errormessage:'error in get method favorite products',error:error.message})

    }
}

 

