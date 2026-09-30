import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import asyncHandler from "../utils/asyncHandler.js";
import { Destination } from "../models/destination.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Create Destination
const createDestination = asyncHandler(async (req, res) => {
  const {
    country,
    city,
    name,
    description,
    images,
    attractions,
  } = req.body;

  if (!country?.trim()) {
    throw new ApiError(400, "Country is required");
  }

  if (!city?.trim()) {
    throw new ApiError(400, "City is required");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Destination name is required");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Description is required");
  }

  const existingDestination = await Destination.findOne({
    country,
    city,
    name,
  });

  if (existingDestination) {
    throw new ApiError(409, "Destination already exists");
  }

  const destination = await Destination.create({
    country,
    city,
    name,
    description,
    images,
    attractions,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        destination,
        "Destination created successfully"
      )
    );
});


// Get All Destinations

const getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({
    isActive: true,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        destinations,
        "Destinations fetched successfully"
      )
    );
});


// Get Single Destination
const getDestinationById = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;

  if (!destinationId) {
    throw new ApiError(400, "Destination ID is required");
  }

  const destination = await Destination.findById(destinationId);

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        destination,
        "Destination fetched successfully"
      )
    );
});


// Update Destination
const updateDestination = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;

  if (!destinationId) {
    throw new ApiError(400, "Destination ID is required");
  }

  const {
    country,
    city,
    name,
    description,
    images,
    attractions,
    isActive,
  } = req.body;

  const destination = await Destination.findByIdAndUpdate(
    destinationId,
    {
      $set: {
        country,
        city,
        name,
        description,
        images,
        attractions,
        isActive,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        destination,
        "Destination updated successfully"
      )
    );
});


// Delete Destination
const deleteDestination = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;

  if (!destinationId) {
    throw new ApiError(400, "Destination ID is required");
  }

  const destination = await Destination.findByIdAndDelete(
    destinationId
  );

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Destination deleted successfully"
      )
    );
});


export {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};