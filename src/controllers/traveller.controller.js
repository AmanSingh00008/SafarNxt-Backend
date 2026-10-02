import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { traveller } from "../models/traveller.model.js";
import { booking } from "../models/bookingmodels.js";


// Add Traveller
const addTraveller = asyncHandler(async (req, res) => {
  const {
    booking: bookingId,
    name,
    age,
    gender,
    phone,
    email,
    idProof,
  } = req.body;

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking is required");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Traveller name is required");
  }

  if (age === undefined || age === null || age < 0) {
    throw new ApiError(400, "Valid age is required");
  }

  if (!gender?.trim()) {
    throw new ApiError(400, "Gender is required");
  }

  if (!phone?.trim()) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  if (!idProof?.trim()) {
    throw new ApiError(400, "ID proof is required");
  }

  // Check booking exists
  const existingBooking = await booking.findById(bookingId);

  if (!existingBooking) {
    throw new ApiError(404, "Booking not found");
  }

  // Create traveller
  const newTraveller = await traveller.create({
    booking: bookingId,
    name,
    age,
    gender,
    phone,
    email,
    idProof,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newTraveller,
      "Traveller added successfully"
    )
  );
});


// Get Traveller By ID
const getTraveller = asyncHandler(async (req, res) => {
  const { travellerId } = req.params;

  if (!travellerId) {
    throw new ApiError(400, "Traveller ID is required");
  }

  const travellerData = await traveller
    .findById(travellerId)
    .populate("booking");

  if (!travellerData) {
    throw new ApiError(404, "Traveller not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      travellerData,
      "Traveller fetched successfully"
    )
  );
});


// Get All Travellers Of A Booking
const getBookingTravellers = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  // Check booking exists
  const existingBooking = await booking.findById(bookingId);

  if (!existingBooking) {
    throw new ApiError(404, "Booking not found");
  }

  const travellers = await traveller
    .find({
      booking: bookingId,
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      travellers,
      "Booking travellers fetched successfully"
    )
  );
});


// Update Traveller
const updateTraveller = asyncHandler(async (req, res) => {
  const { travellerId } = req.params;

  if (!travellerId) {
    throw new ApiError(400, "Traveller ID is required");
  }

  const updatedTraveller = await traveller.findByIdAndUpdate(
    travellerId,
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedTraveller) {
    throw new ApiError(404, "Traveller not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedTraveller,
      "Traveller updated successfully"
    )
  );
});


// Delete Traveller
const deleteTraveller = asyncHandler(async (req, res) => {
  const { travellerId } = req.params;

  if (!travellerId) {
    throw new ApiError(400, "Traveller ID is required");
  }

  const deletedTraveller =
    await traveller.findByIdAndDelete(travellerId);

  if (!deletedTraveller) {
    throw new ApiError(404, "Traveller not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedTraveller,
      "Traveller deleted successfully"
    )
  );
});


export {
  addTraveller,
  getTraveller,
  getBookingTravellers,
  updateTraveller,
  deleteTraveller,
};