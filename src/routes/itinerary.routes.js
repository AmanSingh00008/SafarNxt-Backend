import { Router } from "express";

import {
    createItinerary,
    getAllItineraries,
    getItineraryById,
    getItinerariesByPackage,
    updateItinerary,
    deleteItinerary
} from "../controllers/itinerary.controller.js";

const router = Router();

router.post("/", createItinerary);

router.get("/", getAllItineraries);

router.get("/:id", getItineraryById);

router.get(
    "/package/:packageId",
    getItinerariesByPackage
);

router.patch("/:id", updateItinerary);

router.delete("/:id", deleteItinerary);

export default router;