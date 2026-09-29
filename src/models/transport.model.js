import mongoose from "mongoose";

const transportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["flight", "train", "bus", "cab", "transfer"],
      required: true,
    },

    provider: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    arrivalTime: {
      type: Date,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transport = mongoose.model(
  "Transport",
  transportSchema
);