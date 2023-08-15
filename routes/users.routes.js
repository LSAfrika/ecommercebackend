const express=require('express')
const router= express.Router()
const{register,login,getuserfovoritedstores,adduserfovoritedstores,updateuser}=require('../controller/user.controller')
const{authentication,refreshtoken}=require('../middleware/auth.middleware')

router.post('/register',register)

router.post('/login',login)
// router.post('/socialogin',sociallogin)

router.get('/favoritestores',authentication,getuserfovoritedstores)
router.post('/favoritestores',authentication,adduserfovoritedstores)
router.post('/refresh',refreshtoken)
router.patch('/updateuser/',authentication,updateuser)


module.exports=router
