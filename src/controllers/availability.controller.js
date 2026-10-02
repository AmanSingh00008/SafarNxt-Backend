import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { Availability } from "../models/availability.model.js";


// Create Availability
const createAvailability = asyncHandler(async (req, res) => {
    const {
        resourceType,
        resourceId,
        date,
        totalSeats,
        availableSeats
    } = req.body;

    if (!resourceType || !resourceId || !date || !totalSeats) {
        throw new ApiError(
            400,
            "Resource type, resource ID, date and total seats are required"
        );
    }

    if (!["Package", "Hotel", "Transport"].includes(resourceType)) {
        throw new ApiError(
            400,
            "Invalid resource type"
        );
    }

    if (totalSeats <= 0) {
        throw new ApiError(
            400,
            "Total seats must be greater than 0"
        );
    }

    const existingAvailability = await Availability.findOne({
        resourceType,
        resourceId,
        date
    });

    if (existingAvailability) {
        throw new ApiError(
            409,
            "Availability already exists for this date"
        );
    }

    const availability = await Availability.create({
        resourceType,
        resourceId,
        date,
        totalSeats,
        availableSeats:
            availableSeats ?? totalSeats
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                availability,
                "Availability created successfully"
            )
        );
});


// Get All Availability
const getAllAvailability = asyncHandler(async (req, res) => {
    const {
        resourceType,
        resourceId,
        date
    } = req.query;

    const filter = {};

    if (resourceType) {
        filter.resourceType = resourceType;
    }

    if (resourceId) {
        filter.resourceId = resourceId;
    }

    if (date) {
        filter.date = date;
    }

    const availability = await Availability.find(filter)
        .sort({ date: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                availability,
                "Availability fetched successfully"
            )
        );
});


// Get Availability By ID
const getAvailabilityById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const availability = await Availability.findById(id);

    if (!availability) {
        throw new ApiError(
            404,
            "Availability not found"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                availability,
                "Availability fetched successfully"
            )
        );
});


// Check Availability
const checkAvailability = asyncHandler(async (req, res) => {
    const {
        resourceType,
        resourceId,
        date,
        seats
    } = req.query;

    if (!resourceType || !resourceId || !date || !seats) {
        throw new ApiError(
            400,
            "Resource type, resource ID, date and seats are required"
        );
    }

    const availability = await Availability.findOne({
        resourceType,
        resourceId,
        date
    });

    if (!availability) {
        throw new ApiError(
            404,
            "No availability found for this date"
        );
    }

    const requestedSeats = Number(seats);

    if (requestedSeats <= 0) {
        throw new ApiError(
            400,
            "Seats must be greater than 0"
        );
    }

    const isAvailable =
        availability.availableSeats >= requestedSeats;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    available: isAvailable,
                    availableSeats: availability.availableSeats,
                    requestedSeats
                },
                isAvailable
                    ? "Seats are available"
                    : "Not enough seats available"
            )
        );
});


// Update Availability
const updateAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        date,
        totalSeats,
        availableSeats
    } = req.body;

    const availability = await Availability.findById(id);

    if (!availability) {
        throw new ApiError(
            404,
            "Availability not found"
        );
    }

    if (totalSeats !== undefined && totalSeats <= 0) {
        throw new ApiError(
            400,
            "Total seats must be greater than 0"
        );
    }

    if (availableSeats !== undefined && availableSeats < 0) {
        throw new ApiError(
            400,
            "Available seats cannot be negative"
        );
    }

    if (
        totalSeats !== undefined &&
        availableSeats !== undefined &&
        availableSeats > totalSeats
    ) {
        throw new ApiError(
            400,
            "Available seats cannot exceed total seats"
        );
    }

    availability.date =
        date ?? availability.date;

    availability.totalSeats =
        totalSeats ?? availability.totalSeats;

    availability.availableSeats =
        availableSeats ?? availability.availableSeats;

    await availability.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                availability,
                "Availability updated successfully"
            )
        );
});


// Update Inventory
const updateInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { change } = req.body;

    if (change === undefined) {
        throw new ApiError(
            400,
            "Inventory change is required"
        );
    }

    const availability = await Availability.findById(id);

    if (!availability) {
        throw new ApiError(
            404,
            "Availability not found"
        );
    }

    const newAvailableSeats =
        availability.availableSeats + Number(change);

    if (newAvailableSeats < 0) {
        throw new ApiError(
            400,
            "Not enough seats available"
        );
    }

    if (newAvailableSeats > availability.totalSeats) {
        throw new ApiError(
            400,
            "Available seats cannot exceed total seats"
        );
    }

    availability.availableSeats =
        newAvailableSeats;

    await availability.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                availability,
                "Inventory updated successfully"
            )
        );
});


// Delete Availability
const deleteAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const availability =
        await Availability.findById(id);

    if (!availability) {
        throw new ApiError(
            404,
            "Availability not found"
        );
    }

    await Availability.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Availability deleted successfully"
            )
        );
});


export {
    createAvailability,
    getAllAvailability,
    getAvailabilityById,
    checkAvailability,
    updateAvailability,
    updateInventory,
    deleteAvailability
};