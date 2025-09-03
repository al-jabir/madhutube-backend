import { Playlist } from "../models/playlistModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Playlist
export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos } = req.body;
  if (!name || !description)
    throw new ApiError(400, "Name and description are required");
  const playlist = await Playlist.create({
    name,
    description,
    videos: videos || [],
    owner: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// Get all playlists for user
export const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id });
  res.json(new ApiResponse(200, playlists));
});

// Add video to playlist
export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } },
    { new: true }
  );
  if (!playlist) throw new ApiError(404, "Playlist not found");
  res.json(new ApiResponse(200, playlist, "Video added to playlist"));
});

// Remove video from playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );
  if (!playlist) throw new ApiError(404, "Playlist not found");
  res.json(new ApiResponse(200, playlist, "Video removed from playlist"));
});
