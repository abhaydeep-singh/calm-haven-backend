import { Router } from "express";
import { registerUser,loginUser, logoutUser, getCurrentUser } from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const userRouter = Router();


userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)

// secured routes
// auth middleware is important it will authenticate and give access to user._id in req
userRouter.route("/logout").post(verifyJWT,logoutUser) 
userRouter.route("/getuser").get(verifyJWT,getCurrentUser)
export default userRouter