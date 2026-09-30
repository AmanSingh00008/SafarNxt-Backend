import asyncHandler from "../utils/asyncHandler.js";
import { Package } from "../models/package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Package
const createPackage = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    destination,
    durationDays,
    durationNights,
    price,
    maxTravellers,
    inclusions,
    exclusions,
    images,
  } = req.body;

  // Validation
  if (!title?.trim()) {
    throw new ApiError(400, "Package title is required");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Package description is required");
  }

  if (!destination) {
    throw new ApiError(400, "Destination is required");
  }

  if (!durationDays) {
    throw new ApiError(400, "Duration days is required");
  }

  if (!durationNights && durationNights !== 0) {
    throw new ApiError(400, "Duration nights is required");
  }

  if (price === undefined || price < 0) {
    throw new ApiError(400, "Valid package price is required");
  }

  if (!maxTravellers || maxTravellers < 1) {
    throw new ApiError(400, "Valid maximum travellers is required");
  }

  // Create package
  const packageData = await Package.create({
    title,
    description,
    destination,
    durationDays,
    durationNights,
    price,
    maxTravellers,
    inclusions,
    exclusions,
    images,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      packageData,
      "Package created successfully"
    )
  );
});


// Get All Packages
const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({
    isActive: true,
  })
    .populate("destination")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      packages,
      "Packages fetched successfully"
    )
  );
});


// Get Package By ID
const getPackageById = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const packageData = await Package.findById(packageId)
    .populate("destination");

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      packageData,
      "Package fetched successfully"
    )
  );
});


// Update Package
const updatePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const packageData = await Package.findByIdAndUpdate(
    packageId,
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("destination");

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      packageData,
      "Package updated successfully"
    )
  );
});


// Delete Package
const deletePackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    throw new ApiError(400, "Package ID is required");
  }

  const packageData = await Package.findByIdAndDelete(packageId);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Package deleted successfully"
    )
  );
});


export {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};