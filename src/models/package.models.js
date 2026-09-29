import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    durationNights: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    maxTravellers: {
      type: Number,
      required: true,
    },

    inclusions: [
      {
        type: String,
      },
    ],

    exclusions: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Package = mongoose.model("Package", packageSchema);