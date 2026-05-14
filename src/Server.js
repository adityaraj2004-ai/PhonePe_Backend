import dotenv from "dotenv"
dotenv.config()

import connectDB from "./Database/DB.js"
import app from "./App.js"



const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server has Started at PORT = ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error in starting the Server", error.message);
        process.exit(1);
    }
}

startServer()