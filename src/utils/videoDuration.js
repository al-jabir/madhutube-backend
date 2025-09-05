import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import fs from "fs";

// Set the paths to the ffmpeg and ffprobe binaries
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

/**
 * Extracts video duration from a local video file
 * @param {string} filePath - Path to the video file
 * @returns {Promise<number>} - Duration in seconds
 */
export const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            reject(new Error("Video file not found"));
            return;
        }

        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }

            if (metadata && metadata.format && metadata.format.duration) {
                resolve(metadata.format.duration);
            } else {
                reject(new Error("Could not extract duration from video"));
            }
        });
    });
};