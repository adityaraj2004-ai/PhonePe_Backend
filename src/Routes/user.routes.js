import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/user.controller.js";



const authRouter = Router();

authRouter.post("/signup", registerUser)
authRouter.post("/login", loginUser)
// authRouter.post("/logout", )


export default authRouter








