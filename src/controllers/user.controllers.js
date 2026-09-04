import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"

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

    // Validate user input
    if (
        [fullname, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const userExists = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (userExists) {
        throw new ApiError(
            409,
            "User with email or username already exists"
        );
    }

    // Get image paths
    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    if (!avatarPath || !coverImagePath) {
        throw new ApiError(
            400,
            "Avatar and cover image are required"
        );
    }

    // Upload images to Cloudinary
    const avatarUploadResponse = await uploadCloudinary(avatarPath);
    const coverImageUploadResponse = await uploadCloudinary(coverImagePath);

    if (!avatarUploadResponse || !coverImageUploadResponse) {
        throw new ApiError(
            500,
            "Failed to upload images to Cloudinary"
        );
    }

    // Create user
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatarUploadResponse.url,
        coverImage: coverImageUploadResponse.url,
    });

    // Get created user without sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    // Send response
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User registered successfully"
            )
        );
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password, username, fullname } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password is required");
  }

  if (!User) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = password.isPasswordCorrect();
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id,
  );

  const loggedUser = await user
    .findById(User._id)
    .select("-password -refreshToken");

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
      "User logged in successfully",
    ),
  );
});


const LogOutUser = asyncHandler(async (req, res) => {
  const user = await findByIdAndUpdate(
    req.user._id,

    {
      $set: {
        refreshToken: "" || undefined,
      },
    },
    { new: true },
  );
  res.status().json(200, {}, "user logout successfully").clearcookies();
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findById(req.user._id).select("-refreshToken -password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await user.findById(req.user?._id);

  const isPasswordValid = user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password change successfully"));
});

const updateAccountDetails = asyncHandler(async(req,res) => {
  const {email, fullname} = req.body;

  if(!fullname || !email){
    throw new ApiError(400, "email and password are required")

    const user = await user.findByIdAndUpdate(req.user._id,
      {
        $set: {
          fullname,
          email: email,
        }
      },
      {new: true }
    ).select("-password -refreshToken")

  }

  return res
    .status(200)
    .json(new ApiResponse(200, User, "Account details update successfully"))

})



export {
  accessRefreshToken,
  RegisterUser,
  LoginUser,  
  LogOutUser,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails
};
