import mongoose from "mongoose";

const travellerSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    passportNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Traveller = mongoose.model(
  "Traveller",
  travellerSchema
);