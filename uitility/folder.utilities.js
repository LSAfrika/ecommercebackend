const fs = require("fs");


exports.createstoreimagefolder =  (_storepic,uid) => {
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



  
  exports.updatestoreimage =  (_storepic,uid) => {
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