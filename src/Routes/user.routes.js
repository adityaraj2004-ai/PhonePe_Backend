import { Router } from "express";
import { changePassword, loginUser, logoutUser, registerUser } from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";



const authRouter = Router();

authRouter.post("/signup", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout",verifyJWT,logoutUser )
authRouter.post("/changepw", verifyJWT, changePassword)


export default authRouter








