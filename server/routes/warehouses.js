const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse,
} = require('../controllers/warehouseController');

router.get('/',     auth, getWarehouses);
router.get('/:id', auth, getWarehouse);
router.post('/',    auth, createWarehouse);
router.put('/:id',  auth, updateWarehouse);
router.delete('/:id', auth, deleteWarehouse);

module.exports = router;
