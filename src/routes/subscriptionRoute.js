import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  subscribe,
  unsubscribe,
  getUserSubscriptions,
} from "../controllers/subscriptionController.js";

const router = Router();

router.route("/").get(verifyJWT, getUserSubscriptions);
router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/unsubscribe").post(verifyJWT, unsubscribe);

export default router;
