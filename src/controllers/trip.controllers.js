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

export { Trips };
