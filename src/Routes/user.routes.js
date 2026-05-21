import { Router } from "express";
import { loginuser, registerUser } from "../Controllers/user.controller.js";



const authRouter = Router();

authRouter.post("/signup", registerUser)
authRouter.post("/login", loginuser)
// authRouter.post("/logout", )


export default authRouter








