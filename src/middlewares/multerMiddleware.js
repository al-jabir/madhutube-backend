import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route images to /public/images, videos to /public/videos, others to /public/temp
    let dest = "./public/temp";
    if (file.mimetype.startsWith("image/")) {
      dest = "./public/images";
    } else if (file.mimetype.startsWith("video/")) {
      dest = "./public/videos";
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with random string to prevent conflicts
    const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for files
  },
  fileFilter: (req, file, cb) => {
    // Allow common video and image formats
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only video and image files are allowed."));
    }
  }
});