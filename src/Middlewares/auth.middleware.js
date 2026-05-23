import jwt from "jsonwebtoken";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ErrorResponse } from "../Utils/errorResponse.js";
import User from "../Models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer", "")

    if (!token) {
        throw new ErrorResponse(401, "Unauthorized")
    }


    let decoded;
    try {
        decoded = jwt.verify(token, process.env.Access_Token_Secret)
    } catch (error) {
        throw new ErrorResponse(401, "Invalid Access Token")
    }

    const user = await User.findById(decoded?._id)
        .select("-password -refreshToken")

    if (!user) {
        throw new ErrorResponse(404, "User not found")
    }
    req.user = user;
    next()


})