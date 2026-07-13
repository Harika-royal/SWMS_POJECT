const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSalesReport, getInventoryReport, getShipmentReport, getWarehouseReport } = require('../controllers/reportsController');

router.get('/sales',     auth, getSalesReport);
router.get('/inventory', auth, getInventoryReport);
router.get('/shipments', auth, getShipmentReport);
router.get('/warehouse', auth, getWarehouseReport);

module.exports = router;
