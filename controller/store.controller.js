const { productmodel } = require('../models/products.model')
const{storemodel}=require('../models/store.model')
const{usermodel}=require('../models/user.model')
const{createstoreimagefolder,updatestoreimage}=require('../uitility/folder.utilities')



exports.createstore=async(req,res)=>{

  try {
    const {userid,storename}=req.body

    const user= await usermodel.findById(userid)
    const store= await storemodel.findOne({storeowner:userid})
    if(user==null ) return res.send({exceptionmessage:'user not found'})
    if(store!==null ) return res.send({exceptionmessage:'store already created'})
    const newstore=await storemodel.create({
      storename,
      storeowner:userid,
     // storeimage:'/default/store.png',
      storeproducts:[]

    })

    if(req.files){
    console.log('store image provided');
    const storeimagepath=  createstorefolder(req.files.storepic,newstore._id) 

    const updatestore= await storemodel.findById(newstore._id)

    if(updatestore)updatestore.storeimage=storeimagepath,    await updatestore.save()

    return  res.send(updatestore)

    }

   res.send(newstore)
    

    

  
  } catch (error) {
    
    console.log(`create store error ${error.message}`)
    res.send({errormessage:'create store error',error})
  }
}

exports.updatetore=async(req,res)=>{
    
  try {

    const {userid,storename}=req.body

    const user= await usermodel.findById(userid)
    const store= await storemodel.findOne({storeowner:userid})
    if(user==null ) return res.send({exceptionmessage:'update user not found'})
    if(store==null ) return res.send({exceptionmessage:'update store not found'})

    if(storename)store.storename=storename
    if(req.files){
      const storeimageviewpath= updatestoreimage(req.files.storepic,store._id)
      store.storeimage= storeimageviewpath || '/default/store.png'
    }

    await store.save()
    res.send({message:'store updated succesfully',store})

    
  } catch (error) {
    
    console.log(`update store error \n ${error.message}`)
    res.send({errormessage:'update store error',error})
  }
}


exports.getstores=async(req,res)=>{
  try {

    const {pagination}=req.query
    const returnsize=1
    const skip=pagination*returnsize
    const getstores =await storemodel.find({storedeactivated:false}).skip(skip)
    //.limit(returnsize)

    res.send({allstores:getstores})
    
  } catch (error) {
    
    console.log(`get stores error ${error.message}`)
    res.send({errormessage:'get stores error',error})
  }
  
  }
exports.getstore=async(req,res)=>{
    
    try {

      const {storeid}=req.params
      const getstore =await storemodel.findById(storeid).select('storename storeimage membersince')
      const getstoreproductcount =await productmodel.find({$and:[{productdeactivated:false},{store:storeid}]}).count()
                                                  //  ({$and:[{store:storeid},{productdeactivated:false}]})
  // console.log(getstoreproductcount);
      res.send({...getstore._doc,productcount:getstoreproductcount})
      
    }catch (error) {
      
      console.log(`get store error ${error.message}`)
      res.send({errormessage:'get store error',error})
    }
  }


exports.deactivatestore=async(req,res)=>{
  try {
    const {userid}=req.body
    console.log('current user',userid);
    const store= await storemodel.findOne({storeowner:userid})
   
    if(store==null ) return res.send({exceptionmessage:'no store found'})

    if(store.storedeactivated==true){
      store.storedeactivated=false
      await store.save()

      const storeproducts= await productmodel.find({store:store._id})
      storeproducts.forEach(async(product) => {

        product.productdeactivated=false
        await product.save()
        
      });


      return await res.send({message:'store reactivated',store,storeproducts})
    }
    if(store.storedeactivated==false){
      store.storedeactivated=true
      await store.save()

      
      const storeproducts= await productmodel.find({store:store._id})
      storeproducts.forEach(async(product) => {

        product.productdeactivated=true
        await product.save()
        
      });
      return await res.send({message:'store deactivated',store,storeproducts})
    }


      
  } catch (error) {
    console.log('deactivate store error: \n',error.message);
    res.send({errormessage:'error occured while deactivating store',error})
  }
}


exports.addremovefavoritestore=async(req,res)=>{
  try {

      const{userid}=req.body
      const{storeid}=req.params

      const user=await usermodel.findById(userid).select('favoritestores')
      const store=await storemodel.findById(storeid)
      if(user==null) return res.send({exceptionmessage:'user not found'})
      if(store==null) return res.send({exceptionmessage:'store not found'})

console.log('fetched user',user);

      // if(user.favoriteproducts.length==0){
      //     user.favoriteproducts.push(productid)
      //     await user.save()
      //     return res.send({message:'initial favorite product add ',user})

      // }
      indexofstore=user.favoritestores.map(id=>id.toString()).indexOf(storeid)

      if(indexofstore !=-1){
          user.favoritestores.splice(indexofstore,1)
          await user.save()
          return res.send({message:'favorite store removed ',user})
      }
      if(indexofstore ==-1){

      
          user.favoritestores.push(storeid)
          await user.save()
          return res.send({message:'favorite store added ',user})
      }
   


      
  } catch (error) {

      res.send({errormessage:'error in post method for adding/removing store',error:error.message})
      
  }
}


exports.getuserfavoritedstores=async(req,res)=>{
  try {
    const{userid}=req.body
   

    const userfavoritesdstores=await usermodel.findById(userid).select('favoritestores -_id')
    .populate({path:'favoritestores',select:'storename storeimage membersince'})


  

    if(userfavoritesdstores==null) return res.send({exceptionmessage:'user favorite stores not found'})
   

// console.log('fetched user',userfavoritesdstores);
res.send(userfavoritesdstores)
    
  } catch (error) {
    res.send({errormessage:'error in get method for getting store',error:error.message})
    
  }
}