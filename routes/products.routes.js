const express=require('express')
const router= express.Router()
const{createproduct,
    getallproducts,
    getsingleproduct
    ,updateproduct,
    deleteproduct,
    getallproductscategory,
    getallproductssinglestore,
    deleteproductimage,getfavoriteproducts,getfavoriteproduct,
    addremovefavoriteproduct,
    getallproductsbrand,
    getallproductscategorybrand,
    getallproductssinglestoreadmin
}=require('../controller/products.controller')
const{authentication}=require('../middleware/auth.middleware')

router.post('/createproduct',authentication,createproduct)
router.patch('/updateproduct/:productid',authentication,updateproduct)
router.delete('/deleteproduct/:productid',authentication,deleteproduct)
router.delete('/deleteproductimage/:productid',authentication,deleteproductimage)

router.get('/getallproducts',getallproducts)
router.get('/getallproductscategory',getallproductscategory)
router.get('/getallproductsbrand',getallproductsbrand)
router.get('/getallproductscategorybrand',getallproductscategorybrand)
router.get('/getallproductsstore/:storeid',getallproductssinglestore)
router.get('/getallproductsstoreadmin/',authentication,getallproductssinglestoreadmin)
router.get('/getsingleproduct/:productid',getsingleproduct)
router.get('/favoriteproducts/',authentication,getfavoriteproducts)

router.post('/favoriteproduct/:productid',authentication,addremovefavoriteproduct)


module.exports=router
