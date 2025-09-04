import multer from "multer";

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
    // Ensure Unicode (including Bengali) filenames are handled safely
    let safeName = file.originalname.normalize("NFC");
    safeName = safeName.replace(/[<>:"/\\|?*]/g, "_");
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
});
