import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    travelDate: {
      type: Date,
      required: true,
      index: true,
    },
    travellers: {
      type: [travellerSchema],
      required: true,
      validate: {
        validator: (travellers) => travellers.length > 0,
        message: "At least one traveller is required",
      },
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      children: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    pricing: {
      currency: {
        type: String,
        required: true,
        default: "INR",
        uppercase: true,
        trim: true,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      taxes: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "partially_paid", "refunded", "failed"],
        default: "pending",
        index: true,
      },
      method: {
        type: String,
        enum: ["card", "upi", "net_banking", "wallet", "cash"],
      },
      transactionId: {
        type: String,
        trim: true,
      },
      paidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      paidAt: Date,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    cancelledAt: Date,
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ customer: 1, status: 1, travelDate: 1 });
bookingSchema.index({ trip: 1, travelDate: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
