const Notification = require('../models/Notification');

const createNotification = async ({ title, message, type = 'info', userId = null }) => {
  try {
    await Notification.create({ title, message, type, userId });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

const notifyLowStock = (productName, qty) =>
  createNotification({
    title: 'Low Stock Alert',
    message: `${productName} has only ${qty} units remaining.`,
    type: 'warning',
  });

const notifyNewOrder = (orderNumber, customer) =>
  createNotification({
    title: 'New Order Received',
    message: `Order ${orderNumber} from ${customer} is pending.`,
    type: 'info',
  });

const notifyShipmentDelivered = (trackingNumber) =>
  createNotification({
    title: 'Shipment Delivered',
    message: `Shipment ${trackingNumber} has been delivered.`,
    type: 'success',
  });

const notifyShipmentDelayed = (trackingNumber) =>
  createNotification({
    title: 'Shipment Delayed',
    message: `Shipment ${trackingNumber} has been delayed.`,
    type: 'error',
  });

module.exports = {
  createNotification,
  notifyLowStock,
  notifyNewOrder,
  notifyShipmentDelivered,
  notifyShipmentDelayed,
};
