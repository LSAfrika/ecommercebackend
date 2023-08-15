const{storemodel}=require('../models/store.model')


exports.createstore=async(req,res)=>{

}

exports.updatetore=async(req,res)=>{
    
}


exports.getstores=async(req,res)=>{

    try {
      const pagination=req.query.pagination
      const datasize=5
      // console.log('current pagination: ',pagination);
      const{userid}=req.body
      const search=req.query.search ? {$or:[
        {username:{$regex:req.query.search,$options:'i'}}
        
  
      ]}:{}
      //todo removed serach by email {email:{$regex:req.query.search,$options:'i'}}
  //todo filter logedin user .find({_id:{$ne:userid}})
      
      const users = await usermodel.find(search).find({_id:{$ne:userid}})
      .select('username profileimg online lastseen ')
      .sort({username:1})
      .limit(pagination*datasize)
        return res.send({users})
  
      // if(search!=undefined&&search.length==0){
      //   console.log('search term length',search.length);
  
      //   const users = await usermodel.find().select('username profileimg status lastseen')
      //  return res.send({users})
      // }
  
    } catch (error) {
  
    }
  
  }
  exports.getstore=async(req,res)=>{
  
    const {_id}=req.params
    console.log(_id);
    const user = await usermodel.findById(_id).select('username profileimg status lastseen online')
    res.send({message:'register route working',user})
  }

