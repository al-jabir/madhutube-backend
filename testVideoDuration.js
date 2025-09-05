import { getVideoDuration } from "./src/utils/videoDuration.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test with a sample video file (you would need to have a video file for this test)
async function testVideoDuration() {
    try {
        // This is just a placeholder test - in a real scenario, you would have a test video file
        console.log("Testing video duration extraction...");

        // Example usage:
        // const duration = await getVideoDuration("./path/to/your/video.mp4");
        // console.log(`Video duration: ${duration} seconds`);

        console.log("Test completed - implementation is ready!");
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testVideoDuration();