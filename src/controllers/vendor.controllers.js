import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { vendor } from "../models/vendor.model.js";


// Register Vendor
const registerVendor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    companyName,
    address,
    services,
  } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Vendor name is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  if (!phone?.trim()) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!companyName?.trim()) {
    throw new ApiError(400, "Company name is required");
  }

  if (!address?.trim()) {
    throw new ApiError(400, "Address is required");
  }

  // Check existing vendor
  const existingVendor = await vendor.findOne({
    email: email.toLowerCase(),
  });

  if (existingVendor) {
    throw new ApiError(
      409,
      "Vendor with this email already exists"
    );
  }

  const newVendor = await vendor.create({
    name,
    email: email.toLowerCase(),
    phone,
    companyName,
    address,
    services,
    isApproved: false,
    isActive: true,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newVendor,
      "Vendor registered successfully"
    )
  );
});


// Get All Vendors
const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await vendor
    .find()
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      vendors,
      "Vendors fetched successfully"
    )
  );
});


// Get Vendor By ID
const getVendorById = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const vendorData = await vendor.findById(vendorId);

  if (!vendorData) {
    throw new ApiError(404, "Vendor not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      vendorData,
      "Vendor fetched successfully"
    )
  );
});


// Update Vendor
const updateVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const updatedVendor = await vendor.findByIdAndUpdate(
    vendorId,
    {
      $set: req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedVendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedVendor,
      "Vendor updated successfully"
    )
  );
});


// Approve Vendor
const approveVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const updatedVendor = await vendor.findByIdAndUpdate(
    vendorId,
    {
      $set: {
        isApproved: true,
        isActive: true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedVendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedVendor,
      "Vendor approved successfully"
    )
  );
});


// Reject Vendor
const rejectVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const updatedVendor = await vendor.findByIdAndUpdate(
    vendorId,
    {
      $set: {
        isApproved: false,
        isActive: false,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedVendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedVendor,
      "Vendor rejected successfully"
    )
  );
});


// Delete Vendor
const deleteVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  if (!vendorId) {
    throw new ApiError(400, "Vendor ID is required");
  }

  const deletedVendor = await vendor.findByIdAndDelete(vendorId);

  if (!deletedVendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedVendor,
      "Vendor deleted successfully"
    )
  );
});


export {
  registerVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  rejectVendor,
  deleteVendor,
};