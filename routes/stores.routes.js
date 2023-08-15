const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{createstore,getstore,getstores,updatetore}=require('../controller/store.controller')


router.get('/allstores',getstores)
router.get('/store/:storeid',getstore)

router.post('/createstore',authentication,createstore)
router.patch('/updatestore/',authentication,updatetore)


module.exports=router
