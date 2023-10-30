const express=require('express')
const router= express.Router()
const{addtocart,getcart,updatecart,resetcart,checkoutcart,completedorders}=require('../controller/cart.controller')
const{authentication,refreshtoken}=require('../middleware/auth.middleware')
const { deleteproductcart } = require('../controller/cart.controller')

router.post('/addtocart',authentication,addtocart)

router.get('/getcart',authentication,getcart)
router.get('/completedorders',authentication,completedorders)
router.get('/checkoutcart',authentication,checkoutcart)

router.patch('/updatecart',authentication,updatecart)
router.patch('/resetcart',authentication,resetcart)

router.delete('/deleteproduct/',authentication,deleteproductcart)

module.exports=router
