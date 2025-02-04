import { Router } from "express";
import {addInfo,getInfo,getHelperList,getUserList,triggerWsConnection } from "../controllers/info.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";

const infoRouter = Router();

//secured routes
infoRouter.route("/add").post(verifyJWT,addInfo);
infoRouter.route("/get").get(verifyJWT,getInfo);
//chat
infoRouter.route("/get-helper-list").get(verifyJWT,getHelperList);
infoRouter.route("/get-user-list").get(verifyJWT,getUserList);
infoRouter.route("/trigger-ws/:helperId").post(verifyJWT,triggerWsConnection) 

//not secured
export default infoRouter;    