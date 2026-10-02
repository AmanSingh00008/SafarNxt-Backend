import { Router } from "express";

import {
  createTransport,
  getAllTransport,
  getTransportById,
  updateTransport,
  deleteTransport,
} from "../controllers/transport.controller.js";

const router = Router();


// Create transport
router.post("/", createTransport);

// Get all transports
router.get("/", getAllTransport);

// Get transport by ID
router.get("/:transportId", getTransportById);

// Update transport
router.put("/:transportId", updateTransport);

// Delete transport
router.delete("/:transportId", deleteTransport);


export default router;