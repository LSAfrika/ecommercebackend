const fs = require("fs");
const{productmodel}=require('../models/products.model')

exports.createstorefolder =  (_storepic,uid) => {
    try {
      const mongooseid =  uid;
            const STOREIMAGEUPLOADPATH='public/storeimage/'
            let storepic = _storepic;
            console.log('pic to save: ',storepic);
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

  exports.createproductfolder = async (productimagesarray,productid,res) => {
    try {

      let productsviewpath=[]
      const mongooseid =  productid;
            const PRODUCTIMAGESUPLOADPATH='public/products/'
            let productimages = productimagesarray;
            // console.log('pic to save: ',productimages);
            fs.mkdirSync(`${PRODUCTIMAGESUPLOADPATH}${mongooseid}`, 
            (err) => {if (err)console.log(err.message);  console.log('folder created');});
          
         



            productimages.forEach((image) => {

              path = `products/${mongooseid}/`;
               extension = image.mimetype.split("/")[1];
               let originalfilename=image.name.split('.')[0]

              let filename = Date.now() +mongooseid+originalfilename + "." + extension;
            //  console.log(filename);
              let uploadPath = `${PRODUCTIMAGESUPLOADPATH}${mongooseid}/` + filename;
              let viewpath = `${path}${filename}`;
     
    
    
    
                  image.mv(uploadPath,async function  (err) {
              if (err)   throw new Error(err.message);
              
      
              productsviewpath.push(viewpath)
              //  console.log("product image array: ", productsviewpath);

              
               if(productsviewpath.length>=productimages.length) {

                const updateproduct=await productmodel.findById(productid)
                updateproduct.productimages=productsviewpath

                await updateproduct.save()
                

                res.send({message:'product created ',updateproduct})
                //  console.log('final productas array:',productsviewpath);
               }
            });
            
            
            
            
          });
          


        


  
    } catch (error) {
  console.log('error in product upload logic: ',error.message);

  res.send({errormessage:'error while uploading product images',error})
    }
  };

  
  exports.updatestoreimage =  (_storepic,uid) => {
    try {
   
      const folderid =  uid;
      const STOREIMAGEUPLOADPATH='public/storeimage/'
      let storepic = _storepic;
      console.log('update function called',storepic);
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

  exports.updateproductfolder = async (productimagesarray,productid,res) => {
    try {
   maxproductphotossize=6
      let productsviewpath=[]
      const folderid =  productid;
      completedprocessingimages=false

            
      const producttoupdate=await productmodel.findById(productid)

if(producttoupdate.productimages.length>=maxproductphotossize) return {exceptionmessage:'max product photo upload reached'}

if(productimagesarray.length>=maxproductphotossize-producttoupdate.productimages.length){

  productimagesarray.splice(maxproductphotossize-producttoupdate.productimages.length)
}

            const PRODUCTIMAGESUPLOADPATH='public/products/'
            let productimages = productimagesarray;
      // console.log('update function called',storepic);
      if(fs.existsSync(`${PRODUCTIMAGESUPLOADPATH}${folderid}`)){
              // console.log('folder exists');

           
   


        
      

          productimages.forEach(
          
            (image)=>{
  
  
  
            path = `products/${folderid}/`;
            extension = image.mimetype.split("/")[1];
            originalname=image.name.split('.')[0]
           let filename = Date.now()+folderid+originalname + "." + extension;
           console.log(filename);
           let uploadPath = `${PRODUCTIMAGESUPLOADPATH}${folderid}/${filename}` 
           let viewpath = `${path}${filename}`;
    
    
    
    
               image.mv(uploadPath,function (err) {
           if (err) { 
             throw new Error(err.message);
          
            }});
        productsviewpath.push(viewpath)
  
   
     
  
      
          });

          if(productsviewpath.length>=productimages.length){
            producttoupdate.productimages=[...producttoupdate.productimages,...productsviewpath]
            const savedproduct=await producttoupdate.save()
            if(savedproduct){
              return {message:'images update successfully',savedproduct};
            }
                
        }
       
          // completedprocessingimages=false

        


        console.log('loop complete');
      }
              
           else{
              console.log('no folder exists',`${PRODUCTIMAGESUPLOADPATH}${folderid}`);
              return { exceptionmessage:'folder not found'}
            }



  
    } catch (error) {
  console.log('error in store upload logic: ',error.message);
  return {exceptionmessage:'error while updating product images',error}

    }
  };