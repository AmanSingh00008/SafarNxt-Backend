import { Router } from "express";

import {
  createPayment,
  verifyPayment,
  getPaymentById,
  getBookingPayments,
  refundPayment,
} from "../controllers/payment.controller.js";

const router = Router();


// Create payment
router.post("/", createPayment);

// Verify payment
router.patch("/:paymentId/verify", verifyPayment);

// Get payment by ID
router.get("/:paymentId", getPaymentById);

// Get all payments of a booking
router.get("/booking/:bookingId", getBookingPayments);

// Refund payment
router.patch("/:paymentId/refund", refundPayment);


export default router;