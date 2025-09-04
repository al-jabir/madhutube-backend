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
});
