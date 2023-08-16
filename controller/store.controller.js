const{storemodel}=require('../models/store.model')
const{usermodel}=require('../models/user.model')
const fs = require("fs");




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
    const storeimagepath=  createstoreimagefolder(req.files.storepic,newstore._id) 

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
    
  } catch (error) {
    
    console.log(`get stores error ${error.message}`)
    res.send({errormessage:'get stores error',error})
  }
  
  }
  exports.getstore=async(req,res)=>{
    
    try {
      
    } catch (error) {
      
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
      return res.send({message:'store reactivated',store})
    }
    if(store.storedeactivated==false){
      store.storedeactivated=true
      await store.save()
      return res.send({message:'store deactivated',store})
    }


      
  } catch (error) {
    console.log('deactivate store error: \n',error.message);
    res.send({errormessage:'error occured while deactivating store',error})
  }
}



  const createstoreimagefolder =  (_storepic,uid) => {
    try {
      const mongooseid =  uid;
            const STOREIMAGEUPLOADPATH='public/storeimage/'
            let storepic = _storepic;
            // console.log('pic to save: ',storepic);
            fs.mkdirSync(`${STOREIMAGEUPLOADPATH}${mongooseid}`, (err) => {if (err)console.log(err.message);});
            console.log('folder created');
         

          path = `storeimage/${mongooseid}/`;
           extension = storepic.mimetype.split("/")[1];
          let filename = uid + "." + extension;
          console.log(filename);
          let uploadPath = `${STOREIMAGEUPLOADPATH}${mongooseid}/` + filename;
          let viewpath = `${path}${filename}`;
 



              storepic.mv(uploadPath, function (err) {
          if (err)   throw new Error(err.message);
          
  
          console.log("created profile path: ", viewpath);
          
         });

        return viewpath || '/default/store.png'


  
    } catch (error) {
  console.log('error in store upload logic: ',error.message);
    }
  };



  
  const updatestoreimage =  (_storepic,uid) => {
    try {
   
      const folderid =  uid;
      const STOREIMAGEUPLOADPATH='public/storeimage/'
      let storepic = _storepic;
      console.log('update function called');
      if(fs.existsSync(`${STOREIMAGEUPLOADPATH}${folderid}`)){
              console.log('folder exists');
              
          path = `storeimage/${folderid}/`;
          extension = storepic.mimetype.split("/")[1];
         let filename = folderid + "." + extension;
         console.log(filename);
         let uploadPath = `${STOREIMAGEUPLOADPATH}${folderid}/${filename}` 
         let viewpath = `${path}${filename}`;




             storepic.mv(uploadPath, function (err) {
         if (err)   throw new Error(err.message);
         
 
         console.log("updated profile path: ", viewpath);
         
        });

       return viewpath || '/default/store.png'

            }else{
              console.log('no folder exists',`${STOREIMAGEUPLOADPATH}${folderid}`);
            }



  
    } catch (error) {
  console.log('error in store upload logic: ',error.message);
    }
  };