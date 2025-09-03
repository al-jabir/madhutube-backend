import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  createTweet,
  getAllTweets,
  deleteTweet,
} from "../controllers/tweetController.js";

const router = Router();

router.route("/").get(getAllTweets).post(verifyJWT, createTweet);
router.route("/:id").delete(verifyJWT, deleteTweet);

export default router;
