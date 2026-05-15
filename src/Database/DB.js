import mongoose from "mongoose"
import { DB_Name } from "../Constants.js"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
        console.log("Successfully connected to Database ")
    } catch (error) {
        console.error("Problem connecting to Database", error.message)
    
        process.exit(1)
    }
}

export default connectDB