import { Like } from "../models/likeModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Like a video
export const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) throw new ApiError(400, "videoId is required");
  const like = await Like.create({ video: videoId, likedBy: req.user._id });
  res.status(201).json(new ApiResponse(201, like, "Video liked"));
});

// Unlike a video
export const unlikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) throw new ApiError(400, "videoId is required");
  await Like.findOneAndDelete({ video: videoId, likedBy: req.user._id });
  res.json(new ApiResponse(200, null, "Video unliked"));
});

// Get likes for a video
export const getLikesByVideo = asyncHandler(async (req, res) => {
  const likes = await Like.find({ video: req.params.videoId });
  res.json(new ApiResponse(200, likes));
});
