import { Router } from "express";

import {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} from "../controllers/booking.controllers.js";

const router = Router();

// Create booking
router.post("/", createBooking);

// Get bookings
router.get("/", getBookings);

// Update booking
router.patch("/:bookingId", updateBooking);

// Delete booking
router.delete("/:bookingId", deleteBooking);

export default router;