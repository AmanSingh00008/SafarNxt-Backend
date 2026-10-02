import { Router } from "express";

import {
  addTraveller,
  getTraveller,
  getBookingTravellers,
  updateTraveller,
  deleteTraveller,
} from "../controllers/traveller.controller.js";

const router = Router();


// Add traveller
router.post("/", addTraveller);

// Get all travellers of a booking
router.get("/booking/:bookingId", getBookingTravellers);

// Get traveller by ID
router.get("/:travellerId", getTraveller);

// Update traveller
router.put("/:travellerId", updateTraveller);

// Delete traveller
router.delete("/:travellerId", deleteTraveller);


export default router;