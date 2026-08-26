import {asyncHandler} from "../utils/asyncHandler.js";

const generateAccessRefreshToken = asyncHandler(async(req, res) => {
    const AccessToken = req.cookies || req.body
    if(!user){
        throw new ApiError
    }
})

const RegisterUser = asyncHandler(async(req, res) => {
    
})

const LoginUser = asyncHandler(async(req, res) => {
    //
})

const AccessRefreshToken = asyncHandler(async (req, res) => {
    //
})

const LogOutUser = asyncHandler(async (req, res) => {
    //
})