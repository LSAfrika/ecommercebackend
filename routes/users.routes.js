const express=require('express')
const router= express.Router()
const{register,login,getuserfovoritedstores,adduserfovoritedstores,updatebio,getmybio,updatepassword}=require('../controller/user.controller')
const{authentication,refreshtoken,logout}=require('../middleware/auth.middleware')

router.post('/register',register)

router.post('/login',login)
 router.get('/bio',authentication,getmybio)

router.get('/favoritestores',authentication,getuserfovoritedstores)
router.post('/favoritestores',authentication,adduserfovoritedstores)
router.post('/refresh',refreshtoken)
router.post('/logout',logout)
router.patch('/updatebio/',authentication,updatebio)
router.patch('/updateuserpassword/',authentication,updatepassword)


module.exports=router
