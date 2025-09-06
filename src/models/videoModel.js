import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2";

const videSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0, // Ensure duration is non-negative
    },
    views: {
      type: Number,
      default: 0,
      min: 0, // Ensure views are non-negative
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
videSchema.index({ owner: 1 });
videSchema.index({ isPublished: 1 });
videSchema.index({ createdAt: -1 });

videSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videSchema);