const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getShipments, getShipment, createShipment, updateShipment, deleteShipment,
} = require('../controllers/shipmentController');

router.get('/',     auth, getShipments);
router.get('/:id', auth, getShipment);
router.post('/',    auth, createShipment);
router.put('/:id',  auth, updateShipment);
router.delete('/:id', auth, deleteShipment);

module.exports = router;
