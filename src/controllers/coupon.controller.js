import asyncHandler from "../utils/asyncHandler.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minBookingAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
  } = req.body;

  if (!code?.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }

  if (!discountType) {
    throw new ApiError(400, "Discount type is required");
  }

  if (discountValue === undefined || discountValue <= 0) {
    throw new ApiError(400, "Valid discount value is required");
  }

  if (!expiryDate) {
    throw new ApiError(400, "Expiry date is required");
  }

  // Check if coupon already exists
  const existingCoupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new ApiError(409, "Coupon already exists");
  }

  // Percentage discount cannot exceed 100
  if (discountType === "percentage" && discountValue > 100) {
    throw new ApiError(
      400,
      "Percentage discount cannot exceed 100"
    );
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minBookingAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
    isActive: true,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      coupon,
      "Coupon created successfully"
    )
  );
});


// Get All Coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      coupons,
      "Coupons fetched successfully"
    )
  );
});


// Get Coupon By ID
const getCouponById = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  if (!couponId) {
    throw new ApiError(400, "Coupon ID is required");
  }

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      coupon,
      "Coupon fetched successfully"
    )
  );
});


// Validate Coupon
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, bookingAmount } = req.body;

  if (!code?.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }

  if (bookingAmount === undefined || bookingAmount <= 0) {
    throw new ApiError(400, "Valid booking amount is required");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new ApiError(400, "Coupon is inactive");
  }

  if (new Date() > coupon.expiryDate) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (
    coupon.usageLimit !== undefined &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  if (
    coupon.minBookingAmount &&
    bookingAmount < coupon.minBookingAmount
  ) {
    throw new ApiError(
      400,
      `Minimum booking amount is ${coupon.minBookingAmount}`
    );
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount =
      (bookingAmount * coupon.discountValue) / 100;

    if (
      coupon.maxDiscount &&
      discount > coupon.maxDiscount
    ) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === "fixed") {
    discount = coupon.discountValue;
  }

  // Discount cannot be greater than booking amount
  if (discount > bookingAmount) {
    discount = bookingAmount;
  }

  const finalAmount = bookingAmount - discount;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        couponCode: coupon.code,
        discount,
        finalAmount,
      },
      "Coupon is valid"
    )
  );
});


// Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, bookingAmount } = req.body;

  if (!code?.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }

  if (bookingAmount === undefined || bookingAmount <= 0) {
    throw new ApiError(400, "Valid booking amount is required");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new ApiError(400, "Coupon is inactive");
  }

  if (new Date() > coupon.expiryDate) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (
    coupon.usageLimit !== undefined &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  if (
    coupon.minBookingAmount &&
    bookingAmount < coupon.minBookingAmount
  ) {
    throw new ApiError(
      400,
      `Minimum booking amount is ${coupon.minBookingAmount}`
    );
  }

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount =
      (bookingAmount * coupon.discountValue) / 100;

    if (
      coupon.maxDiscount &&
      discount > coupon.maxDiscount
    ) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === "fixed") {
    discount = coupon.discountValue;
  }

  if (discount > bookingAmount) {
    discount = bookingAmount;
  }

  const finalAmount = bookingAmount - discount;

  // Increase coupon usage
  coupon.usedCount += 1;

  await coupon.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        couponCode: coupon.code,
        originalAmount: bookingAmount,
        discount,
        finalAmount,
      },
      "Coupon applied successfully"
    )
  );
});


// Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  if (!couponId) {
    throw new ApiError(400, "Coupon ID is required");
  }

  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Coupon deleted successfully"
    )
  );
});


export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  applyCoupon,
  deleteCoupon,
};