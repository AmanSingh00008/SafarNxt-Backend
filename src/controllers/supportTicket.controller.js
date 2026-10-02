import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { SupportTicket } from "../models/supportTicket.model.js";


// Create Support Ticket
const createSupportTicket = asyncHandler(async (req, res) => {
    const {
        subject,
        description,
        category,
        priority
    } = req.body;

    if (!subject?.trim() || !description?.trim()) {
        throw new ApiError(
            400,
            "Subject and description are required"
        );
    }

    const ticket = await SupportTicket.create({
        user: req.user._id,
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority: priority || "medium",
        status: "open"
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                ticket,
                "Support ticket created successfully"
            )
        );
});


// Get All Support Tickets
const getAllSupportTickets = asyncHandler(async (req, res) => {
    const {
        status,
        priority,
        category
    } = req.query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (category) {
        filter.category = category;
    }

    const tickets = await SupportTicket.find(filter)
        .populate("user", "username email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tickets,
                "Support tickets fetched successfully"
            )
        );
});


// Get Logged-in User's Tickets
const getMySupportTickets = asyncHandler(async (req, res) => {
    const tickets = await SupportTicket.find({
        user: req.user._id
    }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tickets,
                "Your support tickets fetched successfully"
            )
        );
});


// Get Support Ticket By ID
const getSupportTicketById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await SupportTicket.findById(id)
        .populate("user", "username email");

    if (!ticket) {
        throw new ApiError(
            404,
            "Support ticket not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ticket,
                "Support ticket fetched successfully"
            )
        );
});


// Update Support Ticket
const updateSupportTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        subject,
        description,
        category,
        priority,
        status
    } = req.body;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
        throw new ApiError(
            404,
            "Support ticket not found"
        );
    }

    if (subject !== undefined) {
        ticket.subject = subject.trim();
    }

    if (description !== undefined) {
        ticket.description = description.trim();
    }

    if (category !== undefined) {
        ticket.category = category;
    }

    if (priority !== undefined) {
        ticket.priority = priority;
    }

    if (status !== undefined) {
        ticket.status = status;
    }

    await ticket.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ticket,
                "Support ticket updated successfully"
            )
        );
});


// Add Message / Reply to Ticket
const addTicketMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
        throw new ApiError(
            400,
            "Message is required"
        );
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
        throw new ApiError(
            404,
            "Support ticket not found"
        );
    }

    if (!ticket.messages) {
        ticket.messages = [];
    }

    ticket.messages.push({
        sender: req.user._id,
        message: message.trim(),
        createdAt: new Date()
    });

    await ticket.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ticket,
                "Message added successfully"
            )
        );
});


// Close Support Ticket
const closeSupportTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
        throw new ApiError(
            404,
            "Support ticket not found"
        );
    }

    ticket.status = "closed";

    await ticket.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                ticket,
                "Support ticket closed successfully"
            )
        );
});


// Delete Support Ticket
const deleteSupportTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
        throw new ApiError(
            404,
            "Support ticket not found"
        );
    }

    await SupportTicket.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Support ticket deleted successfully"
            )
        );
});


export {
    createSupportTicket,
    getAllSupportTickets,
    getMySupportTickets,
    getSupportTicketById,
    updateSupportTicket,
    addTicketMessage,
    closeSupportTicket,
    deleteSupportTicket
};