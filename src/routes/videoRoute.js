import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";

const router = Router();

// Video CRUD
router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    createVideo
  );
router
  .route("/:id")
  .get(getVideo)
  .patch(verifyJWT, updateVideo)
  .delete(verifyJWT, deleteVideo);

export default router;
