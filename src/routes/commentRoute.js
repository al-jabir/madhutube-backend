import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  createComment,
  getCommentsByVideo,
  deleteComment,
} from "../controllers/commentController.js";

const router = Router();

router.route("/video/:videoId").get(getCommentsByVideo);
router.route("/").post(verifyJWT, createComment);
router.route("/:id").delete(verifyJWT, deleteComment);

export default router;
