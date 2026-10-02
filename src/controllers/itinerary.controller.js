import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { Itinerary } from "../models/itinerary.model.js";
import { Package } from "../models/package.model.js";

// Create Itinerary
const createItinerary = asyncHandler(async (req, res) => {
    const {
        packageId,
        day,
        title,
        description,
        activities,
        meals,
        accommodation
    } = req.body;

    if (!packageId || !day || !title) {
        throw new ApiError(
            400,
            "Package ID, day and title are required"
        );
    }

    // Check package exists
    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
        throw new ApiError(404, "Package not found");
    }

    const itinerary = await Itinerary.create({
        package: packageId,
        day,
        title,
        description,
        activities,
        meals,
        accommodation
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                itinerary,
                "Itinerary created successfully"
            )
        );
});


// Get All Itineraries
const getAllItineraries = asyncHandler(async (req, res) => {
    const itineraries = await Itinerary.find()
        .populate("package", "title destination price")
        .sort({ day: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                itineraries,
                "Itineraries fetched successfully"
            )
        );
});


// Get Itinerary By ID
const getItineraryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const itinerary = await Itinerary.findById(id)
        .populate("package", "title destination price");

    if (!itinerary) {
        throw new ApiError(404, "Itinerary not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                itinerary,
                "Itinerary fetched successfully"
            )
        );
});


// Get Itineraries By Package
const getItinerariesByPackage = asyncHandler(async (req, res) => {
    const { packageId } = req.params;

    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
        throw new ApiError(404, "Package not found");
    }

    const itineraries = await Itinerary.find({
        package: packageId
    }).sort({ day: 1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                itineraries,
                "Package itineraries fetched successfully"
            )
        );
});


// Update Itinerary
const updateItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        day,
        title,
        description,
        activities,
        meals,
        accommodation
    } = req.body;

    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
        throw new ApiError(404, "Itinerary not found");
    }

    itinerary.day = day ?? itinerary.day;
    itinerary.title = title ?? itinerary.title;
    itinerary.description = description ?? itinerary.description;
    itinerary.activities = activities ?? itinerary.activities;
    itinerary.meals = meals ?? itinerary.meals;
    itinerary.accommodation =
        accommodation ?? itinerary.accommodation;

    await itinerary.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                itinerary,
                "Itinerary updated successfully"
            )
        );
});


// Delete Itinerary
const deleteItinerary = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
        throw new ApiError(404, "Itinerary not found");
    }

    await Itinerary.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Itinerary deleted successfully"
            )
        );
});


export {
    createItinerary,
    getAllItineraries,
    getItineraryById,
    getItinerariesByPackage,
    updateItinerary,
    deleteItinerary
};