import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.models.js";

const addArticle = asyncHandler(async (req, res) => {
  const userId = req.user._id; // getting author id from cookies which came in request

  const { title, content, desc } = req.body; //TODO: add thumbnail option too

  const data = await Blog.create({ user: userId, title, content,desc });
  if (!data) {
    throw new ApiError(500, "Something went wrong while adding article");
  }

  res.status(201).json(new ApiResponse(200, data, "Article created Successfully"));
});



const deleteArticle = asyncHandler(async (req, res) => {
    const {articleID} = req.body;
    const deletedArticle = await Blog.findByIdAndDelete(articleID);
    if (!deleteArticle) {
        throw new ApiError(500, "Something went wrong while deleting article");
    }
    res.status(201).json(new ApiResponse(200, deleteArticle, "Article deleted Successfully")); // TODO: Check for HTTP codes
});

const getAllArticles = asyncHandler(async (req, res) => {
  const articles = await Blog.find(); // probably it will find all the blogs

  res
    .status(201)
    .json(new ApiResponse(200, articles, "Articles fetched succesfully"));
});

const getArticle = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  const article = await Blog.findById(id);

  res
    .status(201)
    .json(new ApiResponse(200, article, "Article fetched succesfully"));
})

// get specific category

export { addArticle, deleteArticle, getAllArticles,getArticle };
