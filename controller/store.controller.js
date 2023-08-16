const{storemodel}=require('../models/store.model')
const{usermodel}=require('../models/user.model')
const fs = require("fs");
const mongoose= require('mongoose')



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
    const storeimagepath=  createstoreimagefolder(req.files.storepic,newstore._id) || '/default/store.png'
    console.log('store image view path:',storeimagepath);
    const updatestore= await storemodel.findById(newstore._id)

    if(updatestore)updatestore.storeimage=storeimagepath,    await updatestore.save()

    res.send(updatestore)

    }else{

      res.send(newstore)
    }

    

  
  } catch (error) {
    
    console.log(`create store error ${error.message}`)
    res.send({errormessage:'create store error',error})
  }
}

exports.updatetore=async(req,res)=>{
    
  try {
    
  } catch (error) {
    
    console.log(`update store error ${error.message}`)
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
          
  
          console.log("updated profile path: ", viewpath);
          
         });

        return viewpath


 //fs.mkdirSync(`${STOREIMAGEUPLOADPATH}${mongooseid}`, (err) => {if (err)console.log(err.message);});

      // if(fs.existsSync(`${STOREIMAGEUPLOADPATH}${mongooseid}`)){
      //   console.log('folder exists');
      //   path = `storeimage/${mongooseid}/`;

       
     
      //   extension = storepic.mimetype.split("/")[1];
       
      //   let filename = userid + "." + extension;
  
      //   console.log(filename);
      //   let uploadPath = `${STOREIMAGEUPLOADPATH}${mongooseid}/` + filename;
      //   let viewpath = `${path}${filename}`;
        
  
      //   storepic.mv(uploadPath, function (err) {
      //     if (err) {
      //       return res.status(500).send(err);
      //     }
  
      //     console.log("updated profile path: ", viewpath);
          
      //   });
        
      //   return viewpath || '/default/store.png'

      
      // }
      // else{

      //}
  
    } catch (error) {
  console.log('error in store upload logic: ',error.message);
    }
  };