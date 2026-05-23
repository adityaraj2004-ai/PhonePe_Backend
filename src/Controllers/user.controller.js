import { asyncHandler } from "../Utils/asyncHandler.js";
import { ErrorResponse } from "../Utils/errorResponse.js";
import User from "../Models/user.model.js"
import { ApiResponse } from "../Utils/apiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error.message)
        throw new ErrorResponse(500, "Error generating tokens")
    }
}


export const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, phoneNumber, mpin } = req.body;

    name = name.toLowerCase();
    email = email.toLowerCase();


    if ([name, email, password, phoneNumber, mpin].some((field) => !field || field.trim() === "")) {
        throw new ErrorResponse(400, "All fields are reqauired")
    }

    const existingUser = await User.findOne({
        $or: [{ phoneNumber }, { email }]
    })

    if (existingUser) {
        throw new ErrorResponse(409, "User already exists")
    }


    const upiID = `${email.split('@')[0]}${Date.now()}@phonepe`

    const user = await User.create({
        email,
        name,
        mpin,
        password,
        phoneNumber,
        upiID: upiID
    })
    const createdUser = await User.findById(user._id).select("-password -mpin")

    if (!createdUser) {
        throw new ErrorResponse(500, "Something went wrong while registerign the user")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(createdUser._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, "User Registered Successfully",
                {
                    user: createdUser,
                    accessToken,
                    refreshToken
                })
        )




})
export const loginUser = asyncHandler(async (req, res) => {

    let { email, password } = req.body;


    email = email.toLowerCase();
    if (
        [email, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ErrorResponse(
            400,
            "All fields are required"
        );
    }

    const user = await User.findOne({ email })
        .select("+password +refreshToken");

    if (!user) {
        throw new ErrorResponse(404, "User not found");
    }

    const isPasswordCorrect =
        await user.comparePasswords(password);

    if (!isPasswordCorrect) {
        throw new ErrorResponse(
            400,
            "Password incorrect"
        );
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -mpin -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                "User logged in successfully",
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
            )
        );
});


export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "User Succcessfully Logout")
        )
})

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ErrorResponse(401, "Invalid User")
    }
    const checkPassword = await user.comparePasswords(oldPassword);

    if (!checkPassword) {
        throw new ErrorResponse(401, "Invalid Password")
    }

    user.refreshToken = undefined;
    user.password = newPassword;
    await user.save();


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "Password Changed Successfully")
        )

})