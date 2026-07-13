const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.put('/:id/read', auth, notificationController.readNotification);
router.put('/read-all', auth, notificationController.readAllNotifications);

module.exports = router;
