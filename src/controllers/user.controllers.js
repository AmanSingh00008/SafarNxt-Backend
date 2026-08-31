import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {usermodel} from "../models/user.models.js"

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

const RegisterUser = asyncHandler(async (req, res) => {
  
  const { fullname, email, username, password } = req.body;

  //validate user input
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarPath = req.files?.avatar?.[0]?.path;

  const coverImagePath = req.files?.coverImage?.[0]?.path;

  if (!avatarPath || !coverImagePath) {
    throw new ApiError(400, "Avatar and cover image are required");
  }

  const avatarUploadResponse = await uploadCloudinary(avatarPath);
  const coverImageUploadResponse = await uploadCloudinary(coverImagePath);

  if (!avatarUploadResponse || !coverImageUploadResponse) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avatar: avatarUploadResponse.url,
    coverImage: coverImageUploadResponse.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));

  res.status(201).json({
    success: true,
    user: user,
  });
});


const LoginUser = asyncHandler(async (req, res) => {
  const {email, password, username, fullname} = req.body;

  if(!email || !password) {
    throw new ApiError(400, "Email and password is required")
  }

  if(!user){
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = password.isPasswordCorrect();
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid credentials")
  }

  const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id)

  const loggedUser = await user.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );

});

const AccessRefreshToken = asyncHandler(async (req, res) => {
  //
});

const LogOutUser = asyncHandler(async (req, res) => {
  const user = await findByIdAndUpdate(
    req.user._id,
    
  
 {
  $set: {
    refreshToken: "" || undefined,
  }

 },
{ new: true}
  )
   res
    .status()
    .json(200, {}, "user logout successfully")
    .clearcookies()
}
 
);

export {
  generateAccessRefreshToken,
  RegisterUser,
  LoginUser,
  AccessRefreshToken,
  LogOutUser,
};
