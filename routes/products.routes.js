const express=require('express')
const router= express.Router()
const{createproduct,getallproducts,getsingleproduct,updateproduct,deleteproduct,getallproductscategory,getallproductssinglestore,deleteproductimage}=require('../controller/products.controller')
const{authentication}=require('../middleware/auth.middleware')

router.post('/createproduct',authentication,createproduct)
router.patch('/updateproduct/:productid',authentication,updateproduct)
router.delete('/deleteproduct/:productid',authentication,deleteproduct)
router.delete('/deleteproductimage/:productid',authentication,deleteproductimage)

router.get('/getallproducts',getallproducts)
router.get('/getallproductscategory',getallproductscategory)
router.get('/getallproductsstore/:storeid',getallproductssinglestore)
router.get('/getsingleproduct/:productid',getsingleproduct)


module.exports=router
