import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.error(`File not found: ${localFilePath}`);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete file only after successful upload
    try {
      fs.unlinkSync(localFilePath);
    } catch (deleteError) {
      console.warn(`Could not delete local file: ${localFilePath}`, deleteError.message);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Try to cleanup local file even if upload failed
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (deleteError) {
      console.warn(`Could not delete local file after failed upload: ${localFilePath}`, deleteError.message);
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
