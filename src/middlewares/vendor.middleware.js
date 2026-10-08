import { ApiError } from "../utils/ApiError.js";

const verifyVendor = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "vendor") {
    throw new ApiError(
      403,
      "Access denied. Vendor only."
    );
  }

  next();
};

export { verifyVendor };