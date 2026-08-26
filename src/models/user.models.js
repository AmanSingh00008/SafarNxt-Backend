import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  refreshToken: {
    type: String,
  },
});
{
  timestamps: true;
}

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
  return token;
};

userSchema.methods.genearateRefreshToken() = function (){
    const token = jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return token;
}
export const User = mongoose.model("user", userSchema);
