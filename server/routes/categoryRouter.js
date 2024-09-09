const router=require('express').Router()
const categoryCtrl=require('../controllers/categoryCtrl')
const auth=require("../middleware/auth")
const authAdmin=require('../middleware/authAdmin')

router.route('/category')
.get(categoryCtrl.getCategories)
.post(auth,authAdmin,categoryCtrl.createCategory)//CATEGORY CREATE KRNE KE LIE ADMIN KE PASS AUTHNECATION HONBA CHAHEYE

router.route('/category/:id')
.delete(auth,authAdmin,categoryCtrl.deleteCategory)
.put(auth,authAdmin,categoryCtrl.updateCategory)

module.exports=router