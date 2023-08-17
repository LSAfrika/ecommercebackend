const{cartmodel}=require('../models/cart.model')


exports.getcart=async(req,res)=>{
    try {
        const{userid}=req.body
        const usercart= await cartmodel.findById(userid)
        if(usercart==null)res.send({exceptionmessage:'no cart found'})
        res.send({cart:usercart})
        
    } catch (error) {
        console.log('get cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }
}
exports.addtocart=async(req,res)=>{
    try {
        const{userid,product}=req.body

        console.log(product);
        return
        let usercart= await cartmodel.findById(userid)
        if(usercart==null){

            usercart=await cartmodel.create({
                cartowner:userid,

            })
        }

        if(usercart!==null){

        }

        
    } catch (error) {
        console.log('add cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }    
}
exports.updatecart=async(req,res)=>{
    try {
        const{userid}=req.body

        
    } catch (error) {
        console.log('update cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}
exports.deletecart=async(req,res)=>{
    try {
        const{userid}=req.body
        
    } catch (error) {
        console.log('delete cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}
exports.checkoutcart=async(req,res)=>{
    try {
        const{userid}=req.body
        
    } catch (error) {
        console.log('check out cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}