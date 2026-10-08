import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";

import {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} from "../controllers/booking.controllers.js";

const router = Router();

// Create booking
router.post("/", authenticateToken, createBooking);

// Get bookings
router.get("/", authenticateToken, getBookings);

// Update booking
router.patch("/:bookingId", authenticateToken, updateBooking);

// Delete booking
router.delete("/:bookingId", authenticateToken, deleteBooking);

export default router;