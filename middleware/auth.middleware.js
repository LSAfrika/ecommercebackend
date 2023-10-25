const {usermodel} = require('../models/user.model')
const jwt = require('jsonwebtoken')


exports.refreshtoken=async(req,res)=>{
  let expiredtoken
  let refreshtoken


  try {
      refreshtoken = req.headers.refreshtoken.split(' ')[1]
      expiredtoken = req.headers.authorization.split(' ')[1]
  

       refreshdetails=await jwt.decode(refreshtoken)
       tokendetails= await jwt.decode(expiredtoken)
      //  console.log(tokendetails);
       if(refreshdetails._id!==tokendetails._id)  return res.status(401).send({message:'tokenmismatch'})
        

       if(refreshdetails.exp*1000<Date.now()) return res.status(401).send({message:'refreshtokenexpired'})
       if(tokendetails.exp*1000<Date.now()){

          if(refreshdetails._id===tokendetails._id){

              const finduserinndb=await usermodel.findById(refreshdetails._id).select("email profileimg username _id  ")

              // console.log(tokendetails._id ,'\n',refreshdetails._id);
              if(finduserinndb==null)return res.send({message:'no user found'})


              const refreshpayload={
                  _id:finduserinndb._id,
                  username:finduserinndb.username,
                  profileimg:finduserinndb.profileimg,
                  email:finduserinndb.email,
              

              }
              const token=await jwt.sign(refreshpayload,process.env.HASHKEY,{
                  expiresIn:300
              })

            return  res.send({message:"new token",token})
          }

       }
       return  res.send({message:"token not expired",token:expiredtoken})



  } catch (error) {




      res.send({errormessage:error.message})}

}



exports.authentication=async(req,res,next)=>{
  let decodedtoken;
  try {

      const reqtoken = req.headers.authorization;

      // console.log(reqtoken);

      const token = reqtoken.split(" ")[1];
      //  console.log(token);
       decodedtoken =await jwt.decode(token);

      //  console.log('decoded token: ',decodedtoken);
      const verified = await jwt.verify(token, process.env.HASHKEY);

      // console.log(('VERIFIED TOKEN:',verified));
      req.body.userid=verified._id

      next()

  } catch (error) {


console.log(error.message);
return res.status(401).send({message:'unathorized',errormsg:error})

  }
}


const testemail=(email)=> {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
