import { Subscription } from "../models/subscriptionModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Subscribe to a channel
export const subscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) throw new ApiError(400, "channelId is required");
  const subscription = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });
  res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed successfully"));
});

// Unsubscribe from a channel
export const unsubscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) throw new ApiError(400, "channelId is required");
  await Subscription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });
  res.json(new ApiResponse(200, null, "Unsubscribed successfully"));
});

// Get subscriptions for user
export const getUserSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    subscriber: req.user._id,
  }).populate("channel", "username avatar");
  res.json(new ApiResponse(200, subscriptions));
});
