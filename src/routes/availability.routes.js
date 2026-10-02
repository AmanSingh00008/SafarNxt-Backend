import { Router } from "express";

import {
    createAvailability,
    getAllAvailability,
    getAvailabilityById,
    checkAvailability,
    updateAvailability,
    updateInventory,
    deleteAvailability
} from "../controllers/availability.controller.js";

const router = Router();

router.post("/", createAvailability);

router.get("/", getAllAvailability);

router.get("/check", checkAvailability);

router.get("/:id", getAvailabilityById);

router.patch("/:id", updateAvailability);

router.patch("/:id/inventory", updateInventory);

router.delete("/:id", deleteAvailability);

export default router;