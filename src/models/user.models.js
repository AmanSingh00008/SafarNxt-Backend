import mongoose from "mongoose"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true

    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true
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
        trim: true

    },
    refreshToken: {
        type: String,
    }
})
{timestamps: true}


export const User = mongoose.model("user", userSchema)