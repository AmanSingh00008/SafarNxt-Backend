import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { review } from "../models/review.model.js";
import { booking } from "../models/bookingmodels.js";
import { user } from "../models/user.models.js";

// Create Review
const createReview = asyncHandler(async (req, res) => {
  const {
    user: userId,
    booking: bookingId,
    comment,
    rating,
    hotel,
  } = req.body;

  if (!userId?.trim()) {
    throw new ApiError(400, "User is required");
  }

  if (!bookingId?.trim()) {
    throw new ApiError(400, "Booking is required");
  }

  if (!hotel?.trim()) {
    throw new ApiError(400, "Hotel is required");
  }

  if (rating === undefined || rating === null) {
    throw new ApiError(400, "Rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (!comment?.trim()) {
    throw new ApiError(400, "Comment is required");
  }

  // Check user exists
  const existingUser = await user.findById(userId);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // Check booking exists
  const existingBooking = await booking.findById(bookingId);

  if (!existingBooking) {
    throw new ApiError(404, "Booking not found");
  }

  // Create review
  const newReview = await review.create({
    user: userId,
    booking: bookingId,
    hotel,
    rating,
    comment,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newReview,
      "Review created successfully"
    )
  );
});


// Get Review
const getReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  const reviewData = await review.findById(reviewId);

  if (!reviewData) {
    throw new ApiError(404, "Review not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      reviewData,
      "Review fetched successfully"
    )
  );
});


// Update Review
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  if (!comment?.trim()) {
    throw new ApiError(400, "Comment is required");
  }

  if (rating === undefined || rating === null) {
    throw new ApiError(400, "Rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const updatedReview = await review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        comment,
        rating,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedReview) {
    throw new ApiError(404, "Review not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedReview,
      "Review updated successfully"
    )
  );
});


// Delete Review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  const deletedReview = await review.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    throw new ApiError(404, "Review not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedReview,
      "Review deleted successfully"
    )
  );
});


export {
  createReview,
  getReview,
  updateReview,
  deleteReview,
};