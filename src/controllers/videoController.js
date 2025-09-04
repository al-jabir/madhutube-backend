import { Video } from "../models/videoModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

// Create Video
export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath || !title || !description || !duration) {
    throw new ApiError(400, "All fields are required");
  }

  // Upload video file to cloudinary
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  if (!videoFile) {
    throw new ApiError(500, "Failed to upload video file to cloudinary");
  }

  // Upload thumbnail to cloudinary
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    // Cleanup video file if thumbnail upload fails
    await deleteFromCloudinary(videoFile.public_id);
    throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
  }

  try {
    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration,
      owner: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, video, "Video created successfully"));
  } catch (error) {
    // Cleanup uploaded files if video creation fails
    if (videoFile) {
      await deleteFromCloudinary(videoFile.public_id);
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while creating video and files were deleted"
    );
  }
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
