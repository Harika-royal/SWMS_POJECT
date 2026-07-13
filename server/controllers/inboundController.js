console.log("Inbound Controller Loaded");
const Inbound = require("../models/Inbound");

// Get all inbound records
exports.getInbound = async (req, res) => {
  try {
    const inbound = await Inbound.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      inbound,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get one inbound record
exports.getInboundById = async (req, res) => {
  try {
    const inbound = await Inbound.findById(req.params.id);

    if (!inbound) {
      return res.status(404).json({
        success: false,
        message: "Inbound record not found",
      });
    }

    res.json({
      success: true,
      inbound,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Create inbound record
exports.createInbound = async (req, res) => {
  try {
    const inbound = new Inbound(req.body);

    await inbound.save();

    res.status(201).json({
      success: true,
      inbound,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update inbound record
exports.updateInbound = async (req, res) => {
  try {
    const inbound = await Inbound.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!inbound) {
      return res.status(404).json({
        success: false,
        message: "Inbound record not found",
      });
    }

    res.json({
      success: true,
      inbound,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete inbound record
exports.deleteInbound = async (req, res) => {
  try {
    const inbound = await Inbound.findByIdAndDelete(req.params.id);

    if (!inbound) {
      return res.status(404).json({
        success: false,
        message: "Inbound record not found",
      });
    }

    res.json({
      success: true,
      message: "Inbound deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};