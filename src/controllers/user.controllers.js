import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const accessRefreshToken = asyncHandler(async (req, res) => {
  try {
    const user = user.findById(user._id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400, "failed to generate access token");
  }
});

const RegisterUser = asyncHandler(async (req, res) => {});

const LoginUser = asyncHandler(async (req, res) => {
  //
});

const AccessRefreshToken = asyncHandler(async (req, res) => {
  //
});

const LogOutUser = asyncHandler(async (req, res) => {
  //
});

export {
  generateAccessRefreshToken,
  RegisterUser,
  LoginUser,
  AccessRefreshToken,
  LogOutUser,
};
