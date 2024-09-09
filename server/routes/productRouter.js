const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl');
// const { upload } = require('../controllers/multerConfig'); // Import the multer config

router.route('/products')
  .get(productCtrl.getProduct)
  .post( productCtrl.createProduct); // Use multer middleware

router.route('/products/:id')
  .delete(productCtrl.deleteProduct)
  .put(productCtrl.updateProduct);

module.exports = router;
