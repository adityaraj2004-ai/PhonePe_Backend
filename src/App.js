import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
origin: process.env.CLIENT_URI,
credentials: true
}))

app.use(cookieParser());

app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.static("public"));
app.use(express.json({limit: "16kb"}));

app.get("/", (req,res)=> {
    res.send("Server is running")
})


export default app