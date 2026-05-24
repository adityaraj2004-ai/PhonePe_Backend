import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    billername:{
        type: String,   
        required: true,
    },
    types: {
        type: String,
        enum: ["TRANSFER", "BILL_PAYMENT", "ADD_MONEY", "WITHDRAWAL", ],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    }
});
