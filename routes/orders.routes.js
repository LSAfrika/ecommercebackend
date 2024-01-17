const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{storeorders,storeorder,completeorder}=require('../controller/orders.controller')


router.get('/getorders',authentication,storeorders)
router.get('/getorder/:orderid',authentication,storeorder)
router.post('/processorder/:orderid',authentication,completeorder)





module.exports=router
