import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { hotel } from "../models/hotel.model.js";
import { destination } from "../models/destination.model.js";


// Create Hotel
const createHotel = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    destination: destinationId,
    address,
    pricePerNight,
    rooms,
    amenities,
    images,
    rating,
  } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Hotel name is required");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Hotel description is required");
  }

  if (!destinationId?.trim()) {
    throw new ApiError(400, "Destination is required");
  }

  if (!address?.trim()) {
    throw new ApiError(400, "Hotel address is required");
  }

  if (pricePerNight === undefined || pricePerNight < 0) {
    throw new ApiError(400, "Valid price per night is required");
  }

  if (rooms === undefined || rooms < 1) {
    throw new ApiError(400, "Valid number of rooms is required");
  }

  if (rating !== undefined && (rating < 0 || rating > 5)) {
    throw new ApiError(400, "Rating must be between 0 and 5");
  }

  // Check destination
  const existingDestination =
    await destination.findById(destinationId);

  if (!existingDestination) {
    throw new ApiError(404, "Destination not found");
  }

  // Check duplicate hotel
  const existingHotel = await hotel.findOne({
    name,
    destination: destinationId,
  });

  if (existingHotel) {
    throw new ApiError(
      409,
      "Hotel already exists in this destination"
    );
  }

  const newHotel = await hotel.create({
    name,
    description,
    destination: destinationId,
    address,
    pricePerNight,
    rooms,
    amenities,
    images,
    rating,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newHotel,
      "Hotel created successfully"
    )
  );
});


// Get All Hotels
const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await hotel
    .find()
    .populate("destination")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      hotels,
      "Hotels fetched successfully"
    )
  );
});


// Get Hotel By ID
const getHotelById = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new ApiError(400, "Hotel ID is required");
  }

  const hotelData = await hotel
    .findById(hotelId)
    .populate("destination");

  if (!hotelData) {
    throw new ApiError(404, "Hotel not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      hotelData,
      "Hotel fetched successfully"
    )
  );
});


// Update Hotel
const updateHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new ApiError(400, "Hotel ID is required");
  }

  const updatedHotel = await hotel
    .findByIdAndUpdate(
      hotelId,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("destination");

  if (!updatedHotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedHotel,
      "Hotel updated successfully"
    )
  );
});


// Delete Hotel
const deleteHotel = asyncHandler(async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    throw new ApiError(400, "Hotel ID is required");
  }

  const deletedHotel = await hotel.findByIdAndDelete(hotelId);

  if (!deletedHotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedHotel,
      "Hotel deleted successfully"
    )
  );
});


export {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};