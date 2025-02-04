import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Info } from "../models/info.models.js";
import { User } from "../models/user.models.js";
import { Message } from "../models/message.models.js";

const addInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    srqData,
    age,
    gender,
    occupation,
    pastIssues,
    presentIssues,
    treatment,
    rateMood,
    moodSwings,
    appetiteIssues,
    sleepHours,
    isPhysicallyActive,
    substanceUse,
    platformGoals,
    platformContent,
    platformFeatures,
  } = req.body;

  // Find the existing Info document for the user
  let info = await Info.findOne({ user: userId });

  if (info) {
    // If the document exists, update it with new data
    info = await Info.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          srqData: srqData || info.srqData,
          age: age || info.age,
          gender: gender || info.gender,
          occupation: occupation || info.occupation,
          pastIssues: pastIssues || info.pastIssues,
          presentIssues: presentIssues || info.presentIssues,
          treatment: treatment || info.treatment,
          rateMood: rateMood || info.rateMood,
          moodSwings: moodSwings || info.moodSwings,
          appetiteIssues: appetiteIssues || info.appetiteIssues,
          sleepHours: sleepHours || info.sleepHours,
          isPhysicallyActive: isPhysicallyActive || info.isPhysicallyActive,
          substanceUse: substanceUse || info.substanceUse,
          platformGoals: platformGoals || info.platformGoals,
          platformContent: platformContent || info.platformContent,
          platformFeatures: platformFeatures || info.platformFeatures,
        },
      },
      { new: true, runValidators: true }
      // new: true:
      // This option tells Mongoose to return the modified document rather than the original document. By default, findOneAndUpdate returns the document as it was before the update was applied. Setting new: true ensures that you get the updated document in the response.

      // unValidators: true:
      // This option ensures that any validation rules defined in your Mongoose schema are enforced when updating the document. By default, Mongoose only applies validation when creating new documents. Setting runValidators: true ensures that the update operation respects the schema’s validation rules (e.g., required fields, data types, etc.).
    );
  } else {
    // If the document doesn't exist, create a new one
    info = await Info.create({
      user: userId,
      srqData,
      age,
      gender,
      occupation,
      pastIssues,
      presentIssues,
      treatment,
      rateMood,
      moodSwings,
      appetiteIssues,
      sleepHours,
      isPhysicallyActive,
      substanceUse,
      platformGoals,
      platformContent,
      platformFeatures,
    });
  }

  res
    .status(201)
    .json(new ApiResponse(200, info, "Info added/updated successfully"));
});

const getInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const info = await Info.findOne({ user: userId });
  res.status(200).json(new ApiResponse(200, info, "Info fetched successfully"));
});

const getHelperList = asyncHandler(async (req, res) => {
  const list = await User.find({
    isHelper: true,
  }).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, list, "Helper List fetched succesfully"));
});

const getUserList = asyncHandler(async (req, res) => {
  const list = await User.find({
    isHelper: false,
  }).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, list, "User List fetched succesfully"));
});

//testing pending
const getMessages = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const messages = await Message.find({
    senderId: myId,
  });
});

const triggerWsConnection = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { helperId } = req.params; // Assume helperId is passed in params

  // Fetch the message history between the user and the helper from the database
  const messageHistory = await Message.find({
    $or: [
      { senderId: userId, reciverId: helperId },
      { senderId: helperId, reciverId: userId }
    ]
  }).sort({ createdAt: 1 }); // Sort by ascending order of timestamps
  // console.log(`message history response: ${messageHistory}`)
  // Respond with the userId, helperId, and the message history
  res.status(200).json(new ApiResponse(200, { userId, helperId, messageHistory }, "WebSocket connection ready with message history"));
});




export { addInfo, getInfo, getHelperList,getUserList, getMessages, triggerWsConnection };
