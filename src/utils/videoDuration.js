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

        // Get file stats for additional validation
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            reject(new Error("Video file is empty"));
            return;
        }

        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error("FFprobe error:", err);
                reject(new Error(`Failed to probe video file: ${err.message}`));
                return;
            }

            if (metadata && metadata.format && metadata.format.duration) {
                // Round to 2 decimal places for precision
                const duration = Math.round(metadata.format.duration * 100) / 100;
                console.log(`Extracted video duration: ${duration} seconds`);
                resolve(duration);
            } else {
                // Try alternative method to get duration
                console.warn("Primary duration extraction failed, trying alternative method");

                // Check if streams contain duration information
                if (metadata && metadata.streams && metadata.streams.length > 0) {
                    for (const stream of metadata.streams) {
                        if (stream.duration) {
                            const duration = Math.round(stream.duration * 100) / 100;
                            console.log(`Extracted video duration from stream: ${duration} seconds`);
                            resolve(duration);
                            return;
                        }
                    }
                }

                reject(new Error("Could not extract duration from video metadata"));
            }
        });
    });
};