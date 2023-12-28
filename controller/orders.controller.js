const {createordermodel}=require('../models/cart.model')
const {storemodel}=require('../models/store.model')

exports.storeorders=async(req,res)=>{
    try {

        const {userid}=req.body

        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorder= await createordermodel.findOne({storeid:store._id})

        res.send(storeorder)
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}

exports.storeorder=async(req,res)=>{
    try {

        const {userid}=req.body

        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorder= await createordermodel.findOne({storeid:store._id})

        res.send(storeorder)
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}


exports.completeorder=async(req,res)=>{
    try {

        const {userid}=req.body

        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorder= await createordermodel.findOne({storeid:store._id})

        res.send(storeorder)
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}