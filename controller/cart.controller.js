const{cartmodel}=require('../models/cart.model')
const{productmodel}=require('../models/products.model')


exports.getcart=async(req,res)=>{
    try {
        const{userid}=req.body
        console.log('user id',userid);
        let usercart= await cartmodel.findById(userid)
        if(usercart==null)  usercart=await cartmodel.create({_id:userid,products:[]})
        res.send({cart:usercart})
        
    } catch (error) {
        console.log('get cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }
}
exports.addtocart=async(req,res)=>{
    try {
        const{userid,cartproducts}=req.body

        let localcartproducts=[]
        // let cart = await cartmodel.findById(userid)
        // if(cart==null)usercart=await cartmodel.create({_id:userid,products:[]})


        // console.log(cartproducts);


   cartproducts.forEach(async(_product) => {

            // console.log('foreach loop working',_product)
            const fetchedproduct= await productmodel.findById(_product.product.id)
            if(fetchedproduct !=null){
                // console.log('fetched product',fetchedproduct);
                producttosave={
                    product:fetchedproduct.id,
                    quantity:_product.product.quantity,
                    sumtotal:fetchedproduct.productprice *_product.product.quantity
                }
                localcartproducts.push(producttosave)


                

                if(cartproducts.length==localcartproducts.length){
                    
                    const totalproductsprice= localcartproducts.map(p=>p.sumtotal).reduce(sumofArray)
                    console.log(totalproductsprice);


                    let usercart= await cartmodel.findById(userid)
                    if(usercart==null){
            
                        usercart=await cartmodel.create({
                            _id:userid,
                            products:localcartproducts,
                            totalprice:totalproductsprice
            
                        })

                    return res.send({message:'cart created successfully',usercart});
                     
                    }
                    if(usercart.products.length==0){

                        usercart.products=[...localcartproducts]
                        usercart.totalprice=totalproductsprice
                        await usercart.save()


                        return res.send({message:'cart updated successfully',usercart});
                    }

                
                }
            }

            
        });

     

      
        

        
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

function sumofArray(sum, num) {
    return sum + num;
}