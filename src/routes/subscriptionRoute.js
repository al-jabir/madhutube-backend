import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  subscribe,
  unsubscribe,
  getUserSubscriptions,
  checkSubscription,
} from "../controllers/subscriptionController.js";

const router = Router();

router.route("/").get(verifyJWT, getUserSubscriptions);
router.route("/subscribe").post(verifyJWT, subscribe);
router.route("/unsubscribe").post(verifyJWT, unsubscribe);
router.route("/check/:channelId").get(verifyJWT, checkSubscription);

export default router;
