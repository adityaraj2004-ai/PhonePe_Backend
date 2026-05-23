import { Router } from "express";
import {
    changePassword,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    setMpin
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";



const authRouter = Router();

authRouter.post("/signup", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout", verifyJWT, logoutUser)
authRouter.post("/changepw", verifyJWT, changePassword)

const userRouter = Router();

userRouter.get("/getProfile",verifyJWT ,getUserProfile)
userRouter.post("/setmpin",verifyJWT ,setMpin)


export { authRouter, userRouter };








