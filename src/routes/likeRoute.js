import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  likeVideo,
  unlikeVideo,
  getLikesByVideo,
} from "../controllers/likeController.js";

const router = Router();

router.route("/video/:videoId").get(getLikesByVideo);
router.route("/like").post(verifyJWT, likeVideo);
router.route("/unlike").post(verifyJWT, unlikeVideo);

export default router;
