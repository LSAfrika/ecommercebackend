const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{createstore,getstore,getstores,updatetore,deactivatestore,addremovefavoritestore,getuserfavoritedstores}=require('../controller/store.controller')


router.get('/allstores',getstores)
router.get('/store/:storeid',getstore)
router.get('/getuserfavoritedstores',authentication,getuserfavoritedstores)

router.post('/createstore',authentication,createstore)
router.post('/addremovefavoritestore/:storeid',authentication,addremovefavoritestore)
router.post('/storeststus',authentication,deactivatestore)
router.patch('/updatestore/',authentication,updatetore)


module.exports=router
