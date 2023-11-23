const express=require('express')
const router= express.Router()
const{authentication}=require('../middleware/auth.middleware')
const{createstore,getstore,getstores,dashboard,updatetore,deactivatestore,addremovefavoritestore,getfavoritestores,getuserfavoritedstores,checkfavorited}=require('../controller/store.controller')


router.get('/allstores',getstores)
router.get('/store/:storeid',getstore)
router.get('/storefavoritecheck/:storeid',authentication,checkfavorited)
router.get('/getfavoritestores/',authentication,getfavoritestores)
router.get('/dashboard',authentication,dashboard)
router.get('/getuserfavoritedstores',authentication,getuserfavoritedstores)

router.post('/createstore',authentication,createstore)
router.post('/addremovefavoritestore/:storeid',authentication,addremovefavoritestore)
router.post('/storestatus',authentication,deactivatestore)
router.patch('/updatestore/',authentication,updatetore)



module.exports=router
