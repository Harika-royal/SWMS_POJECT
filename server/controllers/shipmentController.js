const Shipment = require('../models/Shipment');
const { notifyShipmentDelivered, notifyShipmentDelayed } = require('../services/notificationService');

const buildQuery = (query) => {
  const q = {};
  if (query.status) q.status = query.status;
  if (query.search) {
    q.$or = [
      { trackingNumber: { $regex: query.search, $options: 'i' } },
      { origin: { $regex: query.search, $options: 'i' } },
      { destination: { $regex: query.search, $options: 'i' } },
      { carrier: { $regex: query.search, $options: 'i' } },
    ];
  }
  return q;
};

exports.getShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const query = buildQuery(req.query);
    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const [shipments, total] = await Promise.all([
      Shipment.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Shipment.countDocuments(query),
    ]);

    res.json({ success: true, shipments, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const existing = await Shipment.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Shipment not found' });

    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // Fire notifications on status changes
    if (req.body.status && req.body.status !== existing.status) {
      if (req.body.status === 'Delivered') {
        await notifyShipmentDelivered(shipment.trackingNumber);
      } else if (req.body.status === 'Delayed') {
        await notifyShipmentDelayed(shipment.trackingNumber);
      }
    }

    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, message: 'Shipment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
