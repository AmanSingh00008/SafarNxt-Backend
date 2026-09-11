import { users } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const Trips = asyncHandler(async (req, res) => {
  const { title, price, duration } = req.body;

  if (!title || !price || !duration) {
    throw new ApiError(400, "All fields are Required");
  }

  const Trips = await create.Trips({
    title: title,
    price: price,
    duration: duration,
  });

  res.status(201).json({
    status: "success",
    message: "Trips created successfully",
    data: Trips,
  });
});

const getTrips = asyncHandler(async (req, res) => {
  const Trips = await Trips.find();
  res.status(200).json({
    status: "success",
    message: "Trips fetched successfully",
    data: Trips,
  });
});

const updateTrips = asyncHandler(async (req, res) => {
  const { title, price, duration } = req.body;

  if (!title || !price || !duration) {
    throw new ApiError(400, "All fields are Required");
  }

  const updatedTrip = await Trips.findByIdAndUpdate(
    req.params.id,
    {
      title,
      price,
      duration,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Trip updated successfully",
    data: updatedTrip,
  });
});

export { Trips, getTrips, updateTrips };
