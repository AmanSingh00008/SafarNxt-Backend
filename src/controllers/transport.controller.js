import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { transport } from "../models/transport.model.js";
import { vendor } from "../models/vendor.model.js";


// Create Transport
const createTransport = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    vehicleNumber,
    capacity,
    price,
    source,
    destination,
    vendor: vendorId,
    isAvailable,
  } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Transport name is required");
  }

  if (!type?.trim()) {
    throw new ApiError(400, "Transport type is required");
  }

  if (!vehicleNumber?.trim()) {
    throw new ApiError(400, "Vehicle number is required");
  }

  if (capacity === undefined || capacity < 1) {
    throw new ApiError(400, "Valid capacity is required");
  }

  if (price === undefined || price < 0) {
    throw new ApiError(400, "Valid transport price is required");
  }

  if (!source?.trim()) {
    throw new ApiError(400, "Source is required");
  }

  if (!destination?.trim()) {
    throw new ApiError(400, "Destination is required");
  }

  if (!vendorId?.trim()) {
    throw new ApiError(400, "Vendor is required");
  }

  // Check vendor exists
  const existingVendor = await vendor.findById(vendorId);

  if (!existingVendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Check duplicate vehicle
  const existingTransport = await transport.findOne({
    vehicleNumber,
  });

  if (existingTransport) {
    throw new ApiError(
      409,
      "Transport with this vehicle number already exists"
    );
  }

  const newTransport = await transport.create({
    name,
    type,
    vehicleNumber,
    capacity,
    price,
    source,
    destination,
    vendor: vendorId,
    isAvailable: isAvailable ?? true,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newTransport,
      "Transport created successfully"
    )
  );
});


// Get All Transport
const getAllTransport = asyncHandler(async (req, res) => {
  const transports = await transport
    .find()
    .populate("vendor")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      transports,
      "Transport fetched successfully"
    )
  );
});


// Get Transport By ID
const getTransportById = asyncHandler(async (req, res) => {
  const { transportId } = req.params;

  if (!transportId) {
    throw new ApiError(400, "Transport ID is required");
  }

  const transportData = await transport
    .findById(transportId)
    .populate("vendor");

  if (!transportData) {
    throw new ApiError(404, "Transport not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      transportData,
      "Transport fetched successfully"
    )
  );
});


// Update Transport
const updateTransport = asyncHandler(async (req, res) => {
  const { transportId } = req.params;

  if (!transportId) {
    throw new ApiError(400, "Transport ID is required");
  }

  const updatedTransport = await transport
    .findByIdAndUpdate(
      transportId,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("vendor");

  if (!updatedTransport) {
    throw new ApiError(404, "Transport not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedTransport,
      "Transport updated successfully"
    )
  );
});


// Delete Transport
const deleteTransport = asyncHandler(async (req, res) => {
  const { transportId } = req.params;

  if (!transportId) {
    throw new ApiError(400, "Transport ID is required");
  }

  const deletedTransport =
    await transport.findByIdAndDelete(transportId);

  if (!deletedTransport) {
    throw new ApiError(404, "Transport not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedTransport,
      "Transport deleted successfully"
    )
  );
});


export {
  createTransport,
  getAllTransport,
  getTransportById,
  updateTransport,
  deleteTransport,
};