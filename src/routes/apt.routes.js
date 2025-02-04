import { Router } from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
import { addBooking,deleteBooking,setAptStatus,getAptList } from "../controllers/apt.controllers.js";

const aptRouter = Router();

aptRouter.route("/get-list").get(verifyJWT,getAptList);
aptRouter.route("/add").post(verifyJWT,addBooking);
aptRouter.route("/delete/:bookingID").delete(verifyJWT,deleteBooking);
aptRouter.route("/update").patch(verifyJWT,setAptStatus);

export default aptRouter;
