const{cartmodel}=require('../models/cart.model')


exports.getcart=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('get cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }
}
exports.addcart=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('add cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }    
}
exports.updatecart=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('update cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}
exports.deletecart=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('delete cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}
exports.checkoutcart=async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('check out cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}