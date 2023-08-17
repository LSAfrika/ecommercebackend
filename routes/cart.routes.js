const express=require('express')
const router= express.Router()
const{addtocart,getcart,updatecart,deletecart,checkoutcart}=require('../controller/cart.controller')
const{authentication,refreshtoken}=require('../middleware/auth.middleware')

router.post('/addtocart',authentication,addtocart)

router.get('/getcart',authentication,getcart)
router.get('/checkoutcart',authentication,checkoutcart)

router.patch('/updatecart',authentication,updatecart)
router.delete('/deletecart',authentication,deletecart)



module.exports=router
