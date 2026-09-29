import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    vendorType: {
      type: String,
      enum: ["hotel", "transport", "guide", "other"],
      required: true,
    },

    address: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
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

export const Vendor = mongoose.model(
  "Vendor",
  vendorSchema
);