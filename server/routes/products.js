const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories,
} = require('../controllers/productController');

router.get('/categories', auth, getCategories);
router.get('/',     auth, getProducts);
router.get('/:id', auth, getProduct);
router.post('/',    auth, createProduct);
router.put('/:id',  auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
