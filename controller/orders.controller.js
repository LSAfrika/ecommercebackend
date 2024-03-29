const {createordermodel}=require('../models/cart.model')
const {storemodel}=require('../models/store.model')

exports.storeorders=async(req,res)=>{
    try {

        const {userid}=req.body

        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorders= await createordermodel.find({storeid:store._id})
        .populate({path:"products",
        populate:{path:'product',select:'productname'}}).sort({createdAt:1})

           
        res.send(storeorders)
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}




exports.storeorder =async(req,res)=>{
    try {

        const {userid}=req.body
        const{orderid}=req.params
        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorder= await createordermodel.findOne({storeid:store._id,_id:orderid})

        if (storeorder==null) return res.status(404).send({exceptionmessage:'order not found'})
            
   
        res.send(storeorder)
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}

exports.completeorder =async(req,res)=>{
    try {

        const {userid,status}=req.body
        const{orderid}=req.params
        console.log('status: ',status);
        const store= await storemodel.findOne({storeowner:userid})

        if(store==null) return res.status(404).send({exceptionmessage:'store not found'})

        const storeorder= await createordermodel.findOne({storeid:store._id,_id:orderid})

        if (storeorder==null) return res.status(404).send({exceptionmessage:'order not found'})
        if (storeorder.orderstatus!=='active') return res.send({message:'order already proccessed'})    
        storeorder.orderstatus=status
        await storeorder.save()
        // add send email functionality for completed or cancel and update data in DB 
        res.send({message:status})
        
    } catch (error) {
        console.log('error store order controller: ',error.message);
        res.send({errormessage:error.message})
    }
}