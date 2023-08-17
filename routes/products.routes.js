const express=require('express')
const router= express.Router()
const{createproduct,getallproducts,getsingleproduct,updateproduct,deleteproduct,getallproductscategory,getallproductssinglestore}=require('../controller/products.controller')
const{authentication}=require('../middleware/auth.middleware')

router.post('/createproduct',authentication,createproduct)
router.patch('/updateproduct/:productid',authentication,updateproduct)
router.delete('/deleteproduct',authentication,deleteproduct)

router.get('/getallproducts',getallproducts)
router.get('/getallproductscategory',getallproductscategory)
router.get('/getallproductsstore/:storeid',getallproductssinglestore)
router.get('/getsingleproduct/:productid',getsingleproduct)


module.exports=router
