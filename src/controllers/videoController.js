import { Video } from "../models/videoModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Video
export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoFile = req.files?.videoFile?.[0]?.path;
  const thumbnail = req.files?.thumbnail?.[0]?.path;

  if (!videoFile || !thumbnail || !title || !description || !duration) {
    throw new ApiError(400, "All fields are required");
  }

  // TODO: Upload videoFile and thumbnail to cloudinary if needed

  const video = await Video.create({
    videoFile, // Should be cloudinary url
    thumbnail, // Should be cloudinary url
    title,
    description,
    duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, video, "Video created successfully"));
});

// Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate("owner", "username avatar");
  res.json(new ApiResponse(200, videos));
});

// Get single video
export const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id).populate(
    "owner",
    "username avatar"
  );
  if (!video) throw new ApiError(404, "Video not found");
  res.json(new ApiResponse(200, video));
});

// Update video
export const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $set: { title, description, duration } },
    { new: true }
  );
  if (!video) throw new ApiError(404, "Video not found");
  res.json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete video
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");
  res.json(new ApiResponse(200, null, "Video deleted successfully"));
});
