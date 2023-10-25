const { usermodel } = require("../models/user.model");
const { storemodel } = require("../models/store.model");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { email, username, password, reenterpassword,storename } = req.body;

    if (ValidateEmail(email) == false)
      return res.send({ errormessage: "invalid email format" });

    const finduser = await usermodel.findOne({ email: email.toLowerCase() });

    if (finduser) {
      return res.status(409).send({ errormessage: "email already exists" });
    }
    if (password !== reenterpassword) {
      return res.status(500).send({errormessage: "password missmatch"});
    }

    const hash = await bcrypt.hash(password, 10);

    console.log("hash password: ", hash);
let newuser
    if(storename){
       newuser = new usermodel({
        email: email.toLowerCase(),
        username,
        password: hash,
        fovoritestores: [],
        vendor:true
      });

    }else{

       newuser = new usermodel({
        email: email.toLowerCase(),
        username,
        password: hash,
        fovoritestores: [],
      });
    }



    const newuserresult = await newuser.save();

    if(storename){
      const userstore = await storemodel.create({
        storename,
        storeowner:newuserresult._id

      })

      console.log('new user store',userstore);
    }

    const userresponse = {
      _id: newuserresult._id,
      vendor:newuserresult.vendor,
      email: newuserresult.email,
      profileimg: newuserresult.profileimg,
      username: newuserresult.username,
    };

    const token = await JWT.sign(userresponse, process.env.HASHKEY, {
      expiresIn: "1w",
      issuer: "http://localhost:3000",
    });

    const refreshtoken = JWT.sign(
      { _id: userresponse._id },
      process.env.REFRESHTOKEN,
      {
        expiresIn: "1m",
      }
    );

    return res.send({
      message: `welcome ${userresponse.username}`,
      user:userresponse,
      token,
      refreshtoken,
    });

    //res.status(200).send({message:'user created successfully',...userresponse})

    // next()
  } catch (error) {
    console.log("registering new user error:\n", error);
    return res
      .status(500)
      .send({ errormessage: error.message, servermessage: "an error occured" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (ValidateEmail(email) == false)
      return res.send({ errormessage: "invalid email format" });

    const finduser = await usermodel.findOne({ email: email.toLowerCase() });
    if (!finduser) {
      return res
        .status(404)
        .send({ errormessage: "please check email and password" });
    }
    const passwordcompare = await bcrypt.compare(password, finduser.password);

    if (passwordcompare !== true) {
      return res
        .status(500)
        .send({ errormessage: "please check email and password" });
    }

    const payload = {
      _id: finduser._id,
      email: finduser.email,
      vendor:finduser.vendor,
      username: finduser.username,
      profileimg: finduser.profileimg,
    };

    const token = await JWT.sign(payload, process.env.HASHKEY, {
      expiresIn: "15s",
      issuer: "http://localhost:3000",
    });

    const refreshtoken = JWT.sign(
      { _id: payload._id },
      process.env.REFRESHTOKEN,
      {
        expiresIn: "30days",
        issuer: "http://localhost:3000",
      }
    );

    console.log(`${payload.username} has successfully loged in`);

    return res.send({
      message: `welcome back ${payload.username}`,
      userdata:payload,
      token,
      refreshtoken,
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.getmybio = async (req, res) => {
  try {
    const { userid } = req.body;
    const user = await usermodel.findById(userid).select("-password");
    if (user == null)
      return res.status(404).send({ errormessage: "user not found" });

    res.send({user});
  } catch (error) {
    console.log("get my bio error: ", error.message);
    res.send({errormessage:error.message});
  }
};

exports.updatebio = async (req, res) => {
  try {
    let passwordnotifier=''
    let passwordcomparison
    const { userid, username, oldpassword, newpassword, reenternewpassword } = req.body;
    const updateuser = await usermodel.findById(userid);
    console.log("user to update", updateuser);

    if (updateuser == null)return res.status(404).send({ errormessage: "no user found" });

   
    if(oldpassword) {passwordcomparison= await bcrypt.compare(oldpassword,updateuser.password)
    if(passwordcomparison==false) return res.status(409).send({errormessage:'old password missmatch'})
    if(newpassword &&newpassword.length<6)return res.send({errormessage:'new password must be atleast 6 digits'})
    if(newpassword &&reenternewpassword && newpassword!=reenternewpassword)return res.send({errormessage:'new password missmatch'})
    }
    console.log("user id", userid);
    console.log("username", username);
 

    if(req.files){
      if (username != undefined && username != "")
        updateuser.username = username;

      let picfile = req.files.profilepic;
      // console.log('update image',picfile);
      extension = req.files.profilepic.mimetype.split("/")[1];
      // if(picfile.length === undefined) {
      // let trimmedfilename=picfile.name.replace(/ /g,'')
      let filename = userid + "." + extension;

      console.log(filename);
      let uploadPath = `public/user/` + filename;
      let viewpath = `user/${filename}`;
      

      picfile.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }

        console.log("updated profile path: ", viewpath);
      });

      updateuser.profileimg = viewpath;
      console.log("user to save", updateuser);

      if(oldpassword){
        const comparepasssword = await bcrypt.compare(oldpassword, updateuser.password);
        if(comparepasssword ==true && newpassword==reenternewpassword ){
         const hash=await  bcrypt.hash(newpassword,10)
         updateuser.password=hash

         passwordnotifier='password updated succesfully'

        }

        if(comparepasssword ==false) passwordnotifier='please input correct password'
  
        


      }

      await updateuser.save();
      console.log("updated profile", updateuser);
      const payload = {
        _id: updateuser._id,
        email: updateuser.email,
        profileimg: updateuser.profileimg,
        username: updateuser.username,
      };

      const token = JWT.sign(payload, process.env.HASHKEY, {
        expiresIn: "1w",
      });
      const refreshtoken = JWT.sign(
        { _id: payload._id },
        process.env.REFRESHTOKEN,
        {
          expiresIn: "3d",
        }
      );

      return res.send({
        updateuser,
        token,
        refreshtoken,
        message: "user updated successfully",
        passwordnotifier
      });
    } else {
      if (username != undefined && username != "")
        updateuser.username = username;

      console.log(updateuser.username);

      if(oldpassword){
        const comparepasssword = await bcrypt.compare(oldpassword, updateuser.password);
        if(comparepasssword ==true && newpassword==reenternewpassword ){
         const hash=await  bcrypt.hash(newpassword,10)
         updateuser.password=hash

         passwordnotifier='password updated succesfully'

        }

        if(comparepasssword ==false) passwordnotifier='please input correct password'

      }

      await updateuser.save();

      const payload = {
        _id: updateuser._id,
        email: updateuser.email,
        profileimg: updateuser.profileimg,
        username: updateuser.username,
      };

      const token = JWT.sign(payload, process.env.HASHKEY, {
        expiresIn: "1w",
      });
      // console.log('REFRESH: ',process.env.REFRESH_TOKEN);

      const refreshtoken = JWT.sign(
        { _id: payload._id },
        process.env.REFRESHTOKEN,
        {
          expiresIn: "3d",
        }
      );

      res.send({
        updateuser,
        token,
        refreshtoken,
        message: "user updated successfully",
        passwordnotifier
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ errormessage: error.message });
  }
};

// *==========================================FAVORITE STORES ========================================
exports.getuserfovoritedstores = async (req, res) => {
  try {
    const { userid } = req.body;

    let favusers = [];
    let counter = 0;
    const userprofile = await usermodel
      .findById(userid)
      .select("email username fovoritestores");
    // const allusers=await usermodel.find()

    if (userprofile == null)
      return res.status(404).send({ errormessage: "no user found" });
    if (userprofile.fovoritecontacts.length == 0) return res.send(favusers);

    userprofile.fovoritecontacts.forEach(async (user) => {
      console.log("user id fav", user);
      const founduser = await usermodel
        .findById(user)
        .select("username profileimg online lastseen status");

      if (founduser != null) {
        favusers.push(founduser);
      }

      counter++;

      if (counter >= userprofile.fovoritecontacts.length) {
        res.send(favusers);
      }
    });
    // res.send(userprofile)
  } catch (error) {
    res.send({
      message: "error while getting personal contacts",
      errormessage: error.message,
    });
  }
};

exports.adduserfovoritedstores = async (req, res) => {
  try {
    const { userid, favoriteuserid } = req.body;
    const userprofile = await usermodel
      .findById(userid)
      .select("email username fovoritestores");
    // const allusers=await usermodel.find()

    if (userprofile == null)
      return res.status(404).send({ errormessage: "no user found" });

    const indexoffavoriteuser =
      userprofile.fovoritecontacts.indexOf(favoriteuserid);

    if (indexoffavoriteuser != -1) {
      let favcontacts = [];

      userprofile.fovoritecontacts.splice(indexoffavoriteuser, 1);
      const userfavoritecontacts = await userprofile.save();
      if (userfavoritecontacts.fovoritecontacts.length == 0)
        res.send({ message: "no personal contacts to remove", favcontacts });

      userfavoritecontacts.fovoritecontacts.forEach(async (userobjectid) => {
        const favoriteuserdetails = await usermodel
          .findById(userobjectid)
          .select("lastseen online profileimg status username");
        // console.log('populated fav user',favoriteuserdetails);

        if (favoriteuserdetails != null) {
          favoriteuserdetails;
          favcontacts.push(favoriteuserdetails);

          if (
            favcontacts.length >= userfavoritecontacts.fovoritecontacts.length
          )
            res.send({
              message: "removed user from personal contact list",
              favcontacts,
            });
        }
      });

      // return res.send({message:'removed user to personal contact list',userprofile})
    }

    if (indexoffavoriteuser == -1) {
      let favcontacts = [];

      userprofile.fovoritecontacts.push(favoriteuserid);
      const userfavoritecontacts = await userprofile.save();

      userfavoritecontacts.fovoritecontacts.forEach(async (userobjectid) => {
        const favoriteuserdetails = await usermodel
          .findById(userobjectid)
          .select("lastseen online profileimg status username");
        // console.log('populated fav user',favoriteuserdetails);

        if (favoriteuserdetails != null) {
          favoriteuserdetails;
          favcontacts.push(favoriteuserdetails);

          if (
            favcontacts.length >= userfavoritecontacts.fovoritecontacts.length
          )
            res.send({
              message: "added user to personal contact list",
              favcontacts,
            });
        }
      });
    }
    // res.send({userprofile,favid:favoriteuserid})
  } catch (error) {
    res.send({
      message: "error while getting personal contacts",
      errormessage: error.message,
    });
  }
};
exports.removeuserfovoritedstores = async (req, res) => {
  try {
    const { userid, favoriteuserid } = req.body;
    const userprofile = await usermodel
      .findById(userid)
      .select("email username fovoritestores");
    // const allusers=await usermodel.find()

    if (userprofile == null)
      return res.status(404).send({ errormessage: "no user found" });

    const indexoffavoriteuser =
      userprofile.fovoritecontacts.indexOf(favoriteuserid);

    if (indexoffavoriteuser != -1) {
      let favcontacts = [];

      userprofile.fovoritecontacts.splice(indexoffavoriteuser, 1);
      const userfavoritecontacts = await userprofile.save();
      if (userfavoritecontacts.fovoritecontacts.length == 0)
        res.send({ message: "no personal contacts to remove", favcontacts });

      userfavoritecontacts.fovoritecontacts.forEach(async (userobjectid) => {
        const favoriteuserdetails = await usermodel
          .findById(userobjectid)
          .select("lastseen online profileimg status username");
        // console.log('populated fav user',favoriteuserdetails);

        if (favoriteuserdetails != null) {
          favoriteuserdetails;
          favcontacts.push(favoriteuserdetails);

          if (
            favcontacts.length >= userfavoritecontacts.fovoritecontacts.length
          )
            res.send({
              message: "removed user to personal contact list",
              favcontacts,
            });
        }
      });

      // return res.send({message:'removed user to personal contact list',userprofile})
    }

    if (indexoffavoriteuser == -1) {
      let favcontacts = [];

      userprofile.fovoritecontacts.push(favoriteuserid);
      const userfavoritecontacts = await userprofile.save();

      userfavoritecontacts.fovoritecontacts.forEach(async (userobjectid) => {
        const favoriteuserdetails = await usermodel
          .findById(userobjectid)
          .select("lastseen online profileimg status username");
        // console.log('populated fav user',favoriteuserdetails);

        if (favoriteuserdetails != null) {
          favoriteuserdetails;
          favcontacts.push(favoriteuserdetails);

          if (
            favcontacts.length >= userfavoritecontacts.fovoritecontacts.length
          )
            res.send({
              message: "added user to personal contact list",
              favcontacts,
            });
        }
      });
    }
    // res.send({userprofile,favid:favoriteuserid})
  } catch (error) {
    res.send({
      message: "error while getting personal contacts",
      errormessage: error.message,
    });
  }
};

// *==========================================FAVORITE PRODUCTS ========================================

exports.getfovoriteproduct=async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}

exports.addfovoriteproduct=async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}


exports.removefovoriteproduct=async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}




const ValidateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }

  return false;
};
