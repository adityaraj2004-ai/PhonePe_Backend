import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from "./Routes/user.routes.js";
import swaggerUi from "swagger-ui-express" // first swagger import
import swaggerDocument from "../swagger.json" with { type: "json" } //second swagger import


const app = express();

app.use(cors({
origin: process.env.CLIENT_URI,
credentials: true
}))

app.use(cookieParser());

app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.json({limit: "16kb"}));
app.use(express.static("public"));

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Version 1 of authenticaton routes 
app.use("/api/v1/auth", authRouter)

app.get("/", (req,res)=> {
    res.send("Server is running")
})


export default app