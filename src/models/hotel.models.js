import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    description: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    amenities: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
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

export const Hotel = mongoose.model("Hotel", hotelSchema);