import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["package", "hotel", "transport"],
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },

    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
    },

    date: {
      type: Date,
      required: true,
    },

    totalCapacity: {
      type: Number,
      required: true,
    },

    bookedCapacity: {
      type: Number,
      default: 0,
    },

    availableCapacity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);
