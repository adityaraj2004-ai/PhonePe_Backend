import dotenv from "dotenv"
dotenv.config()

import connectDB from "./Database/DB.js"
import app from "./App.js"



const startServer = async () => {
    try {
        const SwaggerUi = "http://localhost:8000/api-docs"
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server has Started at PORT = ${process.env.PORT}`)
            console.log(`Swagger UI is available on ${SwaggerUi}`)
        })
    } catch (error) {
        console.error("Error in starting the Server", error.message);
        process.exit(1);
    }
}

startServer()