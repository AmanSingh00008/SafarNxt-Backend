import asyncHandler from "../utils/asyncHandler.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Payment
const createPayment = asyncHandler(async (req, res) => {
  const {
    booking,
    amount,
    paymentMethod,
  } = req.body;

  if (!booking) {
    throw new ApiError(400, "Booking ID is required");
  }

  if (amount === undefined || amount <= 0) {
    throw new ApiError(400, "Valid payment amount is required");
  }

  if (!paymentMethod?.trim()) {
    throw new ApiError(400, "Payment method is required");
  }

  // Check booking exists
  const bookingData = await Booking.findById(booking);

  if (!bookingData) {
    throw new ApiError(404, "Booking not found");
  }

  // Create payment
  const payment = await Payment.create({
    booking,
    amount,
    paymentMethod,
    status: "pending",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      payment,
      "Payment created successfully"
    )
  );
});


// Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  payment.status = "paid";
  payment.paidAt = new Date();

  await payment.save();

  // Update booking payment status
  await Booking.findByIdAndUpdate(
    payment.booking,
    {
      paymentStatus: "paid",
    },
    {
      new: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      payment,
      "Payment verified successfully"
    )
  );
});


// Get Payment By ID
const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }

  const payment = await Payment.findById(paymentId)
    .populate("booking");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      payment,
      "Payment fetched successfully"
    )
  );
});


// Get Payments For Booking
const getBookingPayments = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const payments = await Payment.find({
    booking: bookingId,
  }).sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      payments,
      "Booking payments fetched successfully"
    )
  );
});


// Refund Payment
const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status !== "paid") {
    throw new ApiError(
      400,
      "Only paid payments can be refunded"
    );
  }

  payment.status = "refunded";
  payment.refundedAt = new Date();

  await payment.save();

  // Update booking payment status
  await Booking.findByIdAndUpdate(
    payment.booking,
    {
      paymentStatus: "refunded",
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      payment,
      "Payment refunded successfully"
    )
  );
});


export {
  createPayment,
  verifyPayment,
  getPaymentById,
  getBookingPayments,
  refundPayment,
};