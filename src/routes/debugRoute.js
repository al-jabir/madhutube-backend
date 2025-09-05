import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const router = Router();

// Test endpoint for debugging file uploads
router.post("/test-upload",
    verifyJWT,
    upload.single("testFile"),
    asyncHandler(async (req, res) => {
        console.log("🧪 Test upload endpoint hit");
        console.log("📋 Request body:", req.body);
        console.log("📁 File info:", req.file);
        console.log("👤 User:", req.user?._id);

        if (!req.file) {
            throw new ApiError(400, "No file uploaded");
        }

        // Test Cloudinary upload
        const result = await uploadOnCloudinary(req.file.path);

        if (!result) {
            throw new ApiError(500, "Failed to upload to Cloudinary");
        }

        res.status(200).json(new ApiResponse(200, {
            message: "Test upload successful",
            cloudinaryUrl: result.url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            fileSize: result.bytes,
            format: result.format
        }, "Test upload completed"));
    })
);

// Simple endpoint to test authentication
router.get("/test-auth",
    verifyJWT,
    asyncHandler(async (req, res) => {
        console.log("🔐 Test auth endpoint hit");
        console.log("👤 User:", req.user);

        res.status(200).json(new ApiResponse(200, {
            userId: req.user._id,
            username: req.user.username,
            message: "Authentication test successful"
        }, "Auth test completed"));
    })
);

// Environment info endpoint
router.get("/env-info",
    asyncHandler(async (req, res) => {
        const envInfo = {
            nodeEnv: process.env.NODE_ENV,
            hasCloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
            hasMongoDB: !!process.env.MONGODB_URI,
            hasJWTSecrets: !!process.env.ACCESS_TOKEN_SECRET,
            port: process.env.PORT
        };

        res.status(200).json(new ApiResponse(200, envInfo, "Environment info"));
    })
);

export default router;