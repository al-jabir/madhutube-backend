import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlistController.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getUserPlaylists)
  .post(verifyJWT, createPlaylist);
router.route("/add-video").post(verifyJWT, addVideoToPlaylist);
router.route("/remove-video").post(verifyJWT, removeVideoFromPlaylist);

export default router;
