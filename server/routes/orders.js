const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.getOrders);
router.post('/', auth, orderController.createOrder);
router.put('/bulk-pick', auth, orderController.bulkPick);
router.post('/wave', auth, orderController.createWave);
router.put('/:id/pick', auth, orderController.pickOrder);
router.put('/:id', auth, orderController.updateOrder);
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
