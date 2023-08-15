const express=require('express')
const router= express.Router()
const{register,login,getuserfovoritedstores,adduserfovoritedstores,updatebio,getmybio}=require('../controller/user.controller')
const{authentication,refreshtoken}=require('../middleware/auth.middleware')

router.post('/register',register)

router.post('/login',login)
 router.get('/bio',authentication,getmybio)

router.get('/favoritestores',authentication,getuserfovoritedstores)
router.post('/favoritestores',authentication,adduserfovoritedstores)
router.post('/refresh',refreshtoken)
router.patch('/updatebio/',authentication,updatebio)


module.exports=router
