const express=require('express')
const router= express.Router()
const{createproduct,getallproducts,getsingleproduct,updateproduct,deleteproduct}=require('../controller/products.controller')
const{authentication}=require('../middleware/auth.middleware')

router.post('/createproduct',authentication,createproduct)
router.patch('/updateproduct',authentication,updateproduct)
router.patch('/deleteproduct',authentication,deleteproduct)

router.get('/getallproducts',getallproducts)
router.get('/getsingleproduct/:productid',getsingleproduct)


module.exports=router
