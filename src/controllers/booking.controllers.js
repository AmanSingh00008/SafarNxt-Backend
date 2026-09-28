import { bookingModel } from "../models/bookingmodels.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiRespone.js";

const createBooking = asyncHandler(async (req, res) => {
  const { userId, roomId, startDate, endDate } = req.body;

  if (!userId || !roomId || !startDate || !endDate) {
    throw new ApiError(400, "Missing required fields");
  }

  const booking = await bookingModel.create({
    userId,
    roomId,
    startDate,
    endDate,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

const getBookings = asyncHandler(async (req, res) => {
  const { userId, roomId, startDate, endDate } = req.query;

  const filter = {};

  if (userId) filter.userId = userId;
  if (roomId) filter.roomId = roomId;
  if (startDate) filter.startDate = { $gte: new Date(startDate) };
  if (endDate) filter.endDate = { $lte: new Date(endDate) };

  const bookings = await bookingModel.find(filter);

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings retrieved successfully"));
});

const updateBooking = asyncHandler(async (req, res) => {
  const { userId, roomId, startDate, endDate } = req.body;
  const { bookingId } = req.params;

  const booking = await bookingModel.findByIdAndUpdate(
    bookingId,
    {
      userId,
      roomId,
      startDate,
      endDate,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    booking,
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const deletedBooking = await bookingModel.findByIdAndDelete(bookingId);

  if (!deletedBooking) {
    throw new ApiError(404, "Booking not found");
  }

  return res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    booking: deletedBooking,
  });
});

export { createBooking, getBookings, updateBooking, deleteBooking };
