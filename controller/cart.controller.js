
const{cartmodel, carthistorymodel,createordermodel}=require('../models/cart.model')
const{productmodel}=require('../models/products.model')
const stripe = require('stripe')(process.env.SSK);
const YOUR_DOMAIN = 'http://localhost:4200';


exports.getcart=async(req,res)=>{
    try {
        const{userid}=req.body
        console.log('user id',userid);
        let usercart= await cartmodel.findById(userid).select('-createdAt -updatedAt -__v')
        .populate({path:'products',populate:{path:'product',select:'productname'}})
        if(usercart==null)  usercart=await cartmodel.create({_id:userid,products:[]})
        res.send(usercart)
        
    } catch (error) {
        console.log('get cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }
}
exports.addtocart=async(req,res)=>{
    try {
        const{userid,cartproducts}=req.body

        let localcartproducts=[]


        console.log('cart:',cartproducts)
     


        for (_product of cartproducts) {
           
            // console.log('foreach loop working',_product)
            const fetchedproduct= await productmodel.findById(_product.product.id)
            //res.status(500).send({message:'product missing in db'})
            if(fetchedproduct ==null) {res.status(500).send({message:'product missing in db'}); break}
        //    if(fetchedproduct !=null){
                // console.log('fetched product',fetchedproduct);
                producttosave={
                    product:fetchedproduct.id,
                    productprice:fetchedproduct.productprice,
                    quantity:_product.product.quantity,
                    sumtotal:fetchedproduct.productprice *_product.product.quantity
                }
                localcartproducts.push(producttosave)

                // console.log('cart',localcartproducts);

                

                if(cartproducts.length==localcartproducts.length){
                    
                    const totalproductsprice= localcartproducts.map(p=>p.sumtotal).reduce(sumofArray)
                    //console.log(totalproductsprice);


                    let usercart= await cartmodel.findById(userid).select('-createdAt -updatedAt -__v')
                    if(usercart==null){
            // console.log('cart to create: ',usercart);
                        usercart=await cartmodel.create({
                            _id:userid,
                            products:localcartproducts,
                            totalprice:totalproductsprice
            
                        })

                    return res.send({message:'cart created successfully',usercart});
                     
                    }
                

                        // usercart.products=[...localcartproducts]
                        // usercart.totalprice=totalproductsprice
                        // await usercart.save()


                        return res.send({message:'cart already in DB'});
                  

                
                }

                
 
            
        }


     

      
        

        
    } catch (error) {
        console.log('add cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }    
}
exports.updatecart=async(req,res)=>{
    try {
        const{userid,cartproducts}=req.body
        let counter=0
        let usercart=await cartmodel.findById(userid).select('-createdAt -updatedAt -__v')
        .populate({path:'products',populate:{path:'product',select:'productname'}})
        if(usercart==null) {
            let localcartproducts=[]
            for (_product of cartproducts) {
           
                // console.log('foreach loop working',_product)
                const fetchedproduct= await productmodel.findById(_product.product._id)
                //res.status(500).send({message:'product missing in db'})
                if(fetchedproduct ==null) {res.status(500).send({message:'product missing in db'}); break}

                console.log('prod in db:',fetchedproduct);
            //    if(fetchedproduct !=null){
                    // console.log('fetched product',fetchedproduct);
                  let  producttosave={
                        product:fetchedproduct._id,
                        productprice:fetchedproduct.productprice,
                        quantity:_product.product.quantity,
                        sumtotal:fetchedproduct.productprice *_product.product.quantity
                    }
                    localcartproducts.push(producttosave)
    
                    // console.log('cart',localcartproducts);
    
                    
    
                    if(cartproducts.length==localcartproducts.length){
                        
                        const totalproductsprice= localcartproducts.map(p=>p.sumtotal).reduce(sumofArray)
                   
                            usercart=await cartmodel.create({
                                _id:userid,
                                products:localcartproducts,
                                totalprice:totalproductsprice
                
                            })
    
                            await usercart.populate({path:'products',populate:{path:'product',select:'productname'}})
                        return res.send({message:'cart created successfully',usercart});
                         
                        //}
                    
    
                       
                      
    
                    
                    }
    
                    
     
                
            }




             usercart=await cartmodel.create({_id:userid,products:cartproducts})
             return res.send(usercart)
            }

            for(cartproduct of cartproducts){
               

                    //  console.log('current counter',counter);
    
                    const indexofproduct= usercart.products.map(prod=>prod.product._id.toString()).indexOf(cartproduct.product._id) 
                    if(indexofproduct==-1){
    
                        const producttoadd=await productmodel.findById(cartproduct.product._id)
                 
                        if(producttoadd !=null){
    
                            let  producttosave={
                                product:producttoadd._id,
                                productprice:producttoadd.productprice,
                                quantity:cartproduct.product.quantity,
                                sumtotal:producttoadd.productprice *cartproduct.product.quantity
                            }
        
                            usercart.products.push(producttosave)
    
    
                        }
                        if(producttoadd == null){
                            break
                        }
                    }
                    if(indexofproduct!=-1){
    
                      const prod=  usercart.products[indexofproduct]
                    
                      prod.quantity=cartproduct.product.quantity
                      prod.sumtotal=cartproduct.product.quantity*prod.productprice
                 
    
                    }
                    
                    counter++
    
                    if(counter==cartproducts.length){
    
                        //  console.log('  cart', cartproducts.length);
                        //  console.log('  counter', counter);
                        const totalproductsprice= usercart.products.map(p=>p.sumtotal).reduce(sumofArray)
                        usercart.totalprice=totalproductsprice
                        await usercart.save()
                        // console.log(usercart.products);
                        
                        counter=0
                     return   res.send(usercart)
                    }
    
                    
                
            }
            // cartproducts.forEach();

           

    

        
    } catch (error) {
        console.log('update cart error',error.message)
        res.send({errormessage:error.message})
        
    }   
}
exports.resetcart=async(req,res)=>{
    try {
        const{userid}=req.body

        const cart= await cartmodel.findById(userid)
        if(cart==null) return res.status(404).send({exceptionmessage:'no cart found'})

        cart.products=[]
        cart.totalprice=0
        await cart.save()
        res.send({message:'cart has been reset',cart})
    } catch (error) {
        console.log('delete cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}

exports.stripecheckout=async (req,res)=>{
    try {
        const{userid}=req.body

        const cart= await cartmodel.findById(userid)
    } catch (error) {
        
    }
}
exports.checkoutcart=async(req,res)=>{
    try {
      

        const{userid}=req.body

        const cart= await cartmodel.findById(userid).populate({path:'products',populate:{path:'product',select:'productname productprice   '}})
        let carthistory= await carthistorymodel.findOne({cartowner:userid})
        if(cart==null) return res.status(404).send({exceptionmessage:'no cart found'})


        // const stripecart=cart.products.map((item)=>({
        //     price_data:{
        //         currency:'usd',
        //         product_data:{name:item.product.productname},
        //         unit_amount:Math.round((item.productprice/150)*100)
        //     },
        //     quantity:item.quantity
        // }))

   



        // const session = await stripe.checkout.sessions.create({
        //     line_items:[...stripecart],
        //     mode: 'payment',
        //     success_url: `${YOUR_DOMAIN}/checkout/success`,
        //     cancel_url: `${YOUR_DOMAIN}/checkout/cancel`,
        //   });
        
        //   const checkouturl=session.url
        //  return res.send( {checkouturl});








        
        if(cart.products.length==0) return res.status(409).send({exceptionmessage:'cart is empty'})
        
        if(carthistory!==null){

          
            carthistory.completedcarts=[...carthistory.completedcarts,{products:cart.products,totalprice:cart.totalprice,timestamp:Date.now()}]

            await carthistory.save()
        
        }

        if(carthistory==null){
            carthistory = await carthistorymodel.create({
                    cartowner:userid,
                    completedcarts:[{products:cart.products,totalprice:cart.totalprice,timestamp:Date.now()}]
                    
                })
            }

      
        cart.products=[]
        cart.totalprice=0
        await cart.save()
        res.send({message:'cart has been checked out',cart,carthistory})
        
    } catch (error) {
        console.log('check out cart error',error.message)
        res.send({errormessage:error.message,error})
        
    }   
}

exports.completedorders=async(req,res)=>{
    try {
        const{userid}=req.body

        const completedorders=await carthistorymodel.findOne({cartowner:userid})
        .populate({path:'completedcarts',select:'-__v',
                   populate:{path:'products',populate:{path:'product',select:'productname productprice category '}},
                 //  populate:{path:'product',select:'productname productprice category createAt'}
                })
        
        if(completedorders==null)return res.status(404).send({exceptionmessage:'no completed orders found'})

        res.send(completedorders)
        
    } catch (error) {
        
    }
}

exports.deleteproductcart=async(req,res)=>{
    try {
        const {userid,productid}=req.body
        const usercart=await cartmodel.findById(userid)
        if(usercart==null) return res.status(404).send({message:'cart not found'})

        const productindex=usercart.products.map(p=>p.product.toString()).indexOf(productid)
        if(productindex ==-1)return res.status(404).send({message:'product not in cart'})
        usercart.products.splice(productindex,1)
                    
        let newtotalprice
        if( usercart.products.length==0)   newtotalprice   = 0
        if( usercart.products.length>0)    newtotalprice   = usercart.products.map(p=>p.sumtotal).reduce(sumofArray)
         usercart.totalprice=newtotalprice
         await usercart.save()
         res.send(usercart)
        
    } catch (error) {
        console.log('error while deleting product from cart:');
        console.log('product from cart:',error.message);
        res.status(500).send({errormessage:error.message})
    }
}
exports.checkoutpaymentsucceed=async(req,res)=>{
try {

    const {userid}=req.body

    const activecart=await cartmodel.findById(userid).populate({path:'products',
    populate:{path:'product',select:'-_id',select:'productname store'}})
    if(activecart==null) return res.send({exceptionmessage:'active cart not founnd'})

    let products= activecart.products
    let storesincart= products.map(product=>product.product.store.toString())
    let uniquestores= [... new Set(storesincart)]
    let storeproducts
    let ordercreationcounter=0
    uniquestores.forEach(async(storeid) => {
         storeproducts= activecart.products.filter(item=>item.product.store.toString()==storeid)

         await createordermodel.create({
            orderowner:activecart._id,
            storeid,
            products:storeproducts
         })
        ordercreationcounter++

        console.log(ordercreationcounter,uniquestores.length);

        if(ordercreationcounter==uniquestores.length) return res.send({message:'order notficatrions created successfully'})
        
    });


 //   res.send(storeproducts )
    
} catch (error) {
 
        console.log('error checkout cart succeed:',error.message);
        res.status(500).send({errormessage:error.message})
}
}
function sumofArray(sum, num) {
    return sum + num;
}

// async function  addproducttocart(product){

//     const fetchedproduct= await productmodel.findById(product.product.id)

//     if(fetchedproduct==null) break;


// }