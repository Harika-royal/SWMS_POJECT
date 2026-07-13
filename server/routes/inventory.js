const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getInventory, createInventoryItem, updateInventoryItem, adjustStock, deleteInventoryItem,
} = require('../controllers/inventoryController');

router.get('/',               auth, getInventory);
router.post('/',              auth, createInventoryItem);
router.put('/:id',            auth, updateInventoryItem);
router.put('/:id/adjust',     auth, adjustStock);
router.delete('/:id',         auth, deleteInventoryItem);

module.exports = router;
