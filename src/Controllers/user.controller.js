import { asyncHandler } from "../Utils/asyncHandler.js";
import { ErrorResponse } from "../Utils/errorResponse.js";
import User from "../Models/user.model.js"
import { ApiResponse } from "../Utils/apiResponse.js";

export const registerUser = asyncHandler(async (req,res) => {
    let { name, email, password, mpin } = req.body;

    name = name.toLowerCase();
    email = email.toLowerCase();


    if ([name, email, password, phoneNumber, mpin].some((field) => !field || field.trim() === "")) {
        throw new ErrorResponse(400, "All fields are reqauired")
    }

    const existingUser = await User.findOne({
        $or: [{ name }, { email }]
    })

    if (existingUser) {
        throw new ErrorResponse(409, "User already exists")
    }

    const user = await User.create({
        email,
        name,
        mpin,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -mpin")

    if (!createdUser) {
        throw new ErrorResponse(500, "Something went wrong while registerign the user")
    }
    return res.status(201).json(
        ApiResponse(201, "User Registered Successfully", createdUser)
    )




})