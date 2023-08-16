const{productmodel}=require('../models/products.model')

exports.createproduct=async(req,res)=>{

    try {
        const {userid}=req.body

        res.send(userid)
        
    } catch (error) {
        console.log('create product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.getallproducts=async(req,res)=>{
    
    try {
        
    } catch (error) {
        console.log('get all products error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.getsingleproduct=async(req,res)=>{
    
    try {
        
    } catch (error) {
        console.log('get single product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.updateproduct=async(req,res)=>{
    
    try {
        
    } catch (error) {
        console.log('update product error',error.message)
        res.send({errormessage:error.message,error})
    }
}

exports.deleteproduct=async(req,res)=>{
    
    try {
        
    } catch (error) {
        console.log('delete product error',error.message)
        res.send({errormessage:error.message,error})
    }
}