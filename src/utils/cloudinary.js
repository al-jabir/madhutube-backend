import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

dotenv.config();

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const requiredVars = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error(`❌ Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  console.log("✅ Cloudinary configuration validated");
  return true;
};

// Validate configuration on module load
if (!validateCloudinaryConfig()) {
  console.warn("⚠️ Cloudinary may not function properly due to missing configuration");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided to uploadOnCloudinary");
      return null;
    }

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.error(`❌ File not found for upload: ${localFilePath}`);
      return null;
    }

    // Check file size
    const stats = fs.statSync(localFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`📁 File size: ${fileSizeInMB.toFixed(2)} MB`);

    // Validate that file is not empty
    if (stats.size === 0) {
      console.error(`❌ File is empty: ${localFilePath}`);
      // Clean up empty file
      try {
        fs.unlinkSync(localFilePath);
        console.log(`🗑️ Empty file deleted: ${localFilePath}`);
      } catch (deleteError) {
        console.warn(`⚠️ Could not delete empty file: ${localFilePath}`, deleteError.message);
      }
      return null;
    }

    // Validate Cloudinary configuration before upload
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ Cloudinary configuration is incomplete");
      return null;
    }

    console.log(`📤 Uploading to Cloudinary: ${localFilePath}`);
    console.log(`   File size: ${fileSizeInMB.toFixed(2)} MB`);
    console.log(`   File extension: ${path.extname(localFilePath)}`);

    // Determine resource type based on file extension
    let resourceType = "auto";
    const extension = path.extname(localFilePath).toLowerCase();
    if ([".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm", ".mkv"].includes(extension)) {
      resourceType = "video";
    } else if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"].includes(extension)) {
      resourceType = "image";
    }

    console.log(`   Detected resource type: ${resourceType}`);

    // Upload with timeout and resource type detection
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      timeout: 120000, // 2 minutes timeout
      chunk_size: 20000000, // 20MB chunks for large files
    });

    console.log(`✅ Upload successful: ${response.url}`);
    console.log(`🎥 Public ID: ${response.public_id}`);
    console.log(`📄 Resource type: ${response.resource_type}`);
    console.log(`📏 Dimensions: ${response.width}x${response.height}`);
    if (response.duration) {
      console.log(`⏱️ Duration: ${response.duration} seconds`);
    }

    // Delete file only after successful upload
    try {
      fs.unlinkSync(localFilePath);
      console.log(`🗑️ Local file deleted: ${localFilePath}`);
    } catch (deleteError) {
      console.warn(`⚠️ Could not delete local file: ${localFilePath}`, deleteError.message);
    }

    return response;
  } catch (error) {
    console.error(`❌ Cloudinary upload error for ${localFilePath}:`);
    console.error(`Error message: ${error.message}`);
    if (error.http_code) {
      console.error(`HTTP Code: ${error.http_code}`);
    }
    if (error.error && error.error.message) {
      console.error(`Cloudinary Error: ${error.error.message}`);
    }
    
    // Log additional error details
    if (error.name) {
      console.error(`Error Name: ${error.name}`);
    }
    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }

    // Try to cleanup local file even if upload failed
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`🗑️ Local file cleaned up after failed upload: ${localFilePath}`);
      }
    } catch (deleteError) {
      console.warn(`⚠️ Could not delete local file after failed upload: ${localFilePath}`, deleteError.message);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from cloudinary. Public ID: ", publicId);
  } catch (error) {
    console.log("Error on deleting file from cloudinary ", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
