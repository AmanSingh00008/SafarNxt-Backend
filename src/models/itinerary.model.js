import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    activities: [
      {
        type: String,
      },
    ],

    location: {
      type: String,
    },

    startTime: {
      type: String,
    },

    endTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Itinerary = mongoose.model(
  "Itinerary",
  itinerarySchema
);