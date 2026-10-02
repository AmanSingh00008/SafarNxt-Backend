import { Router } from "express";

import {
    createSupportTicket,
    getAllSupportTickets,
    getMySupportTickets,
    getSupportTicketById,
    updateSupportTicket,
    addTicketMessage,
    closeSupportTicket,
    deleteSupportTicket
} from "../controllers/supportTicket.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createSupportTicket);

router.get("/", getAllSupportTickets);

router.get("/my", getMySupportTickets);

router.get("/:id", getSupportTicketById);

router.patch("/:id", updateSupportTicket);

router.post("/:id/message", addTicketMessage);

router.patch("/:id/close", closeSupportTicket);

router.delete("/:id", deleteSupportTicket);

export default router;