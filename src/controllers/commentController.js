import { Comment } from "../models/commentModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Comment
export const createComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;
  if (!content || !videoId)
    throw new ApiError(400, "Content and videoId are required");
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

// Get comments for a video
export const getCommentsByVideo = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId }).populate(
    "owner",
    "username avatar"
  );
  res.json(new ApiResponse(200, comments));
});

// Delete comment
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  res.json(new ApiResponse(200, null, "Comment deleted successfully"));
});
