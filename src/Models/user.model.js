import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,

    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,

    },
    phoneNumber: {
        type: String,
        required: true,
    },

    upiID: {
        type: String,
        unique: true,
    },

    balance: {
        type: Number,
        default: 0,
    },
    mpin: {
        type: String,
        required: true,
        select: false,
        maxlength: 4,
    },
    refreshToken: {
        type: String,
        required: true
    }


}, { timestamps: true, })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
    if (this.isModified("mpin")) this.mpin = await bcrypt.hash(this.mpin, 10);
    next()
})

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.compareMpins = async function (mpin) {
    return await bcrypt.compare(mpin, this.mpin)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
    }, process.env.Access_Token_Secret, { expiresIn: process.env.Access_token_Expiry })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.Refresh_Token_Secret, { expiresIn: process.env.Refresh_Token_Expiry })
}

export default User = mongoose.model("User", userSchema)