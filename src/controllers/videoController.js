import { Video } from "../models/videoModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { getVideoDuration } from "../utils/videoDuration.js";
import { formatDuration } from "../utils/formatDuration.js";

// Create Video
export const createVideo = asyncHandler(async (req, res) => {
  console.log("🎬 Video upload started");
  console.log("📋 Request body:", req.body);
  console.log("📁 Files received:", req.files);
  console.log("👤 User:", req.user?._id);

  const { title, description } = req.body;
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // Enhanced validation with detailed error messages
  if (!title || !description) {
    console.error("❌ Missing required fields:", { title: !!title, description: !!description });
    throw new ApiError(400, "Title and description are required");
  }

  if (!videoFileLocalPath) {
    console.error("❌ Video file not found in request");
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    console.error("❌ Thumbnail file not found in request");
    throw new ApiError(400, "Thumbnail file is required");
  }

  // Check if user is authenticated
  if (!req.user || !req.user._id) {
    console.error("❌ User authentication failed");
    throw new ApiError(401, "User authentication required");
  }

  console.log(`📹 Video file path: ${videoFileLocalPath}`);
  console.log(`🖼️ Thumbnail file path: ${thumbnailLocalPath}`);

  // Extract video duration automatically
  console.log("⏱️ Extracting video duration...");
  let duration;
  try {
    duration = await getVideoDuration(videoFileLocalPath);
    console.log(`⏱️ Video duration extracted: ${duration} seconds`);

    // Validate that we got a reasonable duration
    if (typeof duration !== 'number' || isNaN(duration) || duration <= 0) {
      throw new Error("Invalid video duration extracted");
    }
  } catch (error) {
    console.error("❌ Failed to extract video duration:", error);
    throw new ApiError(500, `Failed to extract video duration: ${error.message}`);
  }

  // Upload video file to cloudinary
  console.log("⬆️ Starting video file upload to Cloudinary...");
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  if (!videoFile) {
    console.error("❌ Video file upload to Cloudinary failed");
    throw new ApiError(500, "Failed to upload video file to Cloudinary. Please check server logs for detailed error information.");
  }
  console.log("✅ Video file uploaded successfully:", videoFile.url);

  // Upload thumbnail to cloudinary
  console.log("⬆️ Starting thumbnail upload to Cloudinary...");
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    console.error("❌ Thumbnail upload to Cloudinary failed");
    // Cleanup video file if thumbnail upload fails
    await deleteFromCloudinary(videoFile.public_id);
    throw new ApiError(500, "Failed to upload thumbnail to Cloudinary. Please check server logs for detailed error information.");
  }
  console.log("✅ Thumbnail uploaded successfully:", thumbnail.url);

  try {
    console.log("💾 Creating video record in database...");
    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration: parseFloat(duration), // Ensure it's stored as a number
      owner: req.user._id,
    });

    console.log("✅ Video created successfully:", video._id);
    res
      .status(201)
      .json(new ApiResponse(201, video, "Video created successfully"));
  } catch (error) {
    console.error("❌ Database error while creating video:", error);
    // Cleanup uploaded files if video creation fails
    if (videoFile) {
      await deleteFromCloudinary(videoFile.public_id);
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(
      500,
      `Database error while creating video: ${error.message}`
    );
  }
});

// Get all videos
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate("owner", "username avatar");

  // Add formatted duration to each video
  const videosWithFormattedDuration = videos.map(video => {
    const videoObj = video.toObject();
    videoObj.formattedDuration = formatDuration(videoObj.duration);
    return videoObj;
  });

  res.json(new ApiResponse(200, videosWithFormattedDuration));
});

// Get single video
export const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username avatar");

  if (!video) throw new ApiError(404, "Video not found");

  const videoObj = video.toObject();
  videoObj.formattedDuration = formatDuration(videoObj.duration);

  res.json(new ApiResponse(200, videoObj));
});

// Update video
export const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (duration !== undefined) {
    const durationNum = parseFloat(duration);
    if (isNaN(durationNum) || durationNum < 0) {
      throw new ApiError(400, "Duration must be a valid non-negative number");
    }
    updateData.duration = durationNum;
  }

  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
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
