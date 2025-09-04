import { Video } from "../models/videoModel.js";
import { User } from "../models/userModel.js";

/**
 * Utility to check and clean up any database records that contain local file paths
 * instead of Cloudinary URLs. This can be run manually if needed.
 */

export const checkAndCleanupLocalPaths = async () => {
    try {
        console.log("🔍 Checking for local file paths in database...");

        // Check videos for local paths
        const videosWithLocalPaths = await Video.find({
            $or: [
                { videoFile: /^\.\/public\// },
                { thumbnail: /^\.\/public\// },
                { videoFile: /^public\// },
                { thumbnail: /^public\// }
            ]
        });

        if (videosWithLocalPaths.length > 0) {
            console.log(`⚠️  Found ${videosWithLocalPaths.length} videos with local file paths:`);
            videosWithLocalPaths.forEach(video => {
                console.log(`  - Video ID: ${video._id}`);
                console.log(`    VideoFile: ${video.videoFile}`);
                console.log(`    Thumbnail: ${video.thumbnail}`);
            });
            console.log("❗ These videos should be re-uploaded to fix the issue.");
        } else {
            console.log("✅ No videos found with local file paths.");
        }

        // Check users for local paths
        const usersWithLocalPaths = await User.find({
            $or: [
                { avatar: /^\.\/public\// },
                { coverImage: /^\.\/public\// },
                { avatar: /^public\// },
                { coverImage: /^public\// }
            ]
        });

        if (usersWithLocalPaths.length > 0) {
            console.log(`⚠️  Found ${usersWithLocalPaths.length} users with local file paths:`);
            usersWithLocalPaths.forEach(user => {
                console.log(`  - User ID: ${user._id} (${user.username})`);
                console.log(`    Avatar: ${user.avatar}`);
                console.log(`    Cover Image: ${user.coverImage}`);
            });
            console.log("❗ These users should update their profile images to fix the issue.");
        } else {
            console.log("✅ No users found with local file paths.");
        }

        return {
            videosWithLocalPaths: videosWithLocalPaths.length,
            usersWithLocalPaths: usersWithLocalPaths.length
        };

    } catch (error) {
        console.error("❌ Error checking database:", error.message);
        throw error;
    }
};

export const deleteVideosWithLocalPaths = async () => {
    try {
        console.log("🗑️  Deleting videos with local file paths...");

        const result = await Video.deleteMany({
            $or: [
                { videoFile: /^\.\/public\// },
                { thumbnail: /^\.\/public\// },
                { videoFile: /^public\// },
                { thumbnail: /^public\// }
            ]
        });

        console.log(`✅ Deleted ${result.deletedCount} videos with local file paths.`);
        return result.deletedCount;
    } catch (error) {
        console.error("❌ Error deleting videos:", error.message);
        throw error;
    }
};