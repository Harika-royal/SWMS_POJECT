const mongoose = require("mongoose");

const inboundSchema = new mongoose.Schema(
  {
    asnNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    expectedItems: {
      type: Number,
      required: true,
      default: 0,
    },

    receivedItems: {
      type: Number,
      default: 0,
    },

    warehouse: {
      type: String,
      default: "Main Warehouse",
    },

    receivedBy: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },

    eta: {
      type: Date,
    },

    receivedDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inbound", inboundSchema);