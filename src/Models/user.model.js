import bcrypt from "bcrypt";
import mongoose from "mongoose";

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
    }

}, { timestamps: true, })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (!this.isModified("mpin")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.mpin = await bcrypt.hash(this.mpin, 10);
})

export default User = mongoose.model("User", userSchema)