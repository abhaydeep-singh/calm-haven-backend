import { Router } from "express";
import { addArticle,deleteArticle,getAllArticles, getArticle } from "../controllers/blog.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const blogRouter = Router();

// secured
blogRouter.route("/add").post(verifyJWT,addArticle);
blogRouter.route("/delete").delete(verifyJWT,deleteArticle);
blogRouter.route("/get-all").get(verifyJWT,getAllArticles);
blogRouter.route("/get/:id").get(verifyJWT,getArticle);

export default blogRouter;