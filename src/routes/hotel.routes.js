import { Router } from "express";

import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controllers/hotel.controller.js";

const router = Router();

router.post("/", createHotel);

router.get("/", getAllHotels);

router.get("/:hotelId", getHotelById);

router.put("/:hotelId", updateHotel);

router.delete("/:hotelId", deleteHotel);

export default router;