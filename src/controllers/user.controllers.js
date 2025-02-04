import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

// it is an internal function not related to any direct route handeler so it do not require asynchander, rather we use try/catch blocks
const generateAccessAndRefreshTokens = async(userId)=>{
try {
    const user = await User.findById(userId); // user is instance now and we can access instance methods with it. We actually fetched an instance here.
    
    // Instance methods have access to the data stored in the document (via this), allowing  them to operate on and use this data directly.
    // Instances in Mongoose represent individual documents in a MongoDB collection.
    // Instance Methods are methods defined on the schema that operate on individual instances of the model.
    // Instances are created when you instantiate a new document using a model or when you retrieve a document from the database.
    // Instance Method: In Mongoose (or other ORM libraries), you can define instance methods on a model. These methods are available on the document instances (in this case, user is an instance of the User model). The generateAccessToken method is probably defined as an instance method within the User schema, allowing you to generate an access token specifically for that user.
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

} catch (error) {
    console.error("Error in generateAccessAndRefereshTokens:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    ); 
}
};

const registerUser = asyncHandler(async (req, res) => {
  // gettng data in req.body
  const { fullname, email, username, password,isChecked } = req.body;

  if (
    [fullname, email, username, password].some((param) => param?.trim() === "")
  )
  {
    // ? q mark nhi lagaya to ek field miss karne par app crash kar jaegi, ? ensure only field which came in json req get checked for emptyness, otherwise anyone will crash our server
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    isHelper:isChecked
  }); 
  const createdUser = await User.findOne({ _id: user._id }).select("-password");
//   console.log(`created user: ${createdUser}`);
if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));

});

const loginUser = asyncHandler(async(req,res)=>{
    const{ email, password} = req.body;
    if (!email) {
        throw new ApiError(404,"User does not exist");
    }
    const user = await User.findOne({email});

    if (!user) {
        throw new ApiError(404,"User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
      }

    // all checks done
    // generate access and rerfresh tokens
      const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      //cookies
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
        );

});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset: {
            refreshToken: 1, // this removes the field from document
          },
        },
        {
          new: true,
        }
      );

      const options = {
        httpOnly: true,
        secure: true,
      };
    
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
  .status(200)
  .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
  ))
});
export {registerUser,loginUser,logoutUser,getCurrentUser};