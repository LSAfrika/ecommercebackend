const { populate } = require('dotenv');
const{cartmodel, carthistorymodel}=require('../models/cart.model')
const{productmodel}=require('../models/products.model')


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

                console.log('cart',localcartproducts);

                

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

        let usercart=await cartmodel.findById(userid).select('-createdAt -updatedAt -__v')
        .populate({path:'products',populate:{path:'product',select:'productname'}})
        if(usercart==null) {
            let localcartproducts=[]
            for (_product of cartproducts) {
           
                // console.log('foreach loop working',_product)
                const fetchedproduct= await productmodel.findById(_product.product.id)
                //res.status(500).send({message:'product missing in db'})
                if(fetchedproduct ==null) {res.status(500).send({message:'product missing in db'}); break}
            //    if(fetchedproduct !=null){
                    // console.log('fetched product',fetchedproduct);
                  let  producttosave={
                        product:fetchedproduct.id,
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
    
                        return res.send({message:'cart created successfully',usercart});
                         
                        //}
                    
    
                       
                      
    
                    
                    }
    
                    
     
                
            }




             usercart=await cartmodel.create({_id:userid,products:cartproducts})
            return res.send(usercart)
            }

            cartproducts.forEach(async(cartproduct) => {

                // console.log(usercart.products);

                const indexofproduct= usercart.products.map(prod=>prod.product._id.toString()).indexOf(cartproduct.product._id) 
                if(indexofproduct==-1){

                    console.log('product not in cart');
                    const producttoadd=await productmodel.findById(cartproduct.product._id)

                    if(producttoadd !=null){

                        let  producttosave={
                            product:producttoadd.id,
                            productprice:producttoadd.productprice,
                            quantity:cartproduct.product.quantity,
                            sumtotal:producttoadd.productprice *cartproduct.product.quantity
                        }
    
                        usercart.products.push(producttosave)

                    }
                }
                if(indexofproduct!=-1){

                  const prod=  usercart.products[indexofproduct]
                //  console.log('pre update',prod);
                  prod.quantity=cartproduct.product.quantity
                  prod.sumtotal=cartproduct.product.quantity*prod.productprice
                 // console.log('post update',prod);
                 // console.log(cartproduct.product._id);

                }
                
                // console.log('product',indexofproduct);
                
            });

            const totalproductsprice= localcartproducts.map(p=>p.sumtotal).reduce(sumofArray)

            await usercart.save()
            console.log(usercart.products);
            

            res.send(usercart)

        
    } catch (error) {
        console.log('update cart error',error.message)
        res.send({errormessage:error.message,error})
        
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
exports.checkoutcart=async(req,res)=>{
    try {
      

        const{userid}=req.body

        const cart= await cartmodel.findById(userid)
        let carthistory= await carthistorymodel.findOne({cartowner:userid})
        if(cart==null) return res.status(404).send({exceptionmessage:'no cart found'})
        if(cart.products.length==0) return res.status(409).send({exceptionmessage:'cart is empty'})
        
        if(carthistory!==null){

          
            carthistory.completedcarts=[...carthistory.completedcarts,{products:cart.products,totalprice:cart.totalprice}]

            await carthistory.save()
        
        }

        if(carthistory==null){
            carthistory = await carthistorymodel.create({
                    cartowner:userid,
                    completedcarts:[{products:cart.products,totalprice:cart.totalprice}]
                    
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
        .populate({path:'completedcarts',
                   populate:{path:'products',select:'productname productprice productimages category'},
                   populate:{path:'product',select:'productname productprice category createAt'}
                })
        //.populate({path:'products'})
        if(completedorders==null)return res.status(404).send({exceptionmessage:'no ompleted orders found'})

        res.send({completedorders})
        
    } catch (error) {
        
    }
}

function sumofArray(sum, num) {
    return sum + num;
}

// async function  addproducttocart(product){

//     const fetchedproduct= await productmodel.findById(product.product.id)

//     if(fetchedproduct==null) break;


// }