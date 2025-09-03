import { Tweet } from "../models/tweetModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Tweet
export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(400, "Content is required");
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// Get all tweets
export const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find().populate("owner", "username avatar");
  res.json(new ApiResponse(200, tweets));
});

// Delete tweet
export const deleteTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findByIdAndDelete(req.params.id);
  if (!tweet) throw new ApiError(404, "Tweet not found");
  res.json(new ApiResponse(200, null, "Tweet deleted successfully"));
});
