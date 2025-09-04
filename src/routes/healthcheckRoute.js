import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckController.js";
import { checkAndCleanupLocalPaths, deleteVideosWithLocalPaths } from "../utils/dbCleanup.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/").get(healthCheck);

// Debug routes for checking and cleaning up local file paths
router.route("/check-local-paths").get(asyncHandler(async (req, res) => {
    const result = await checkAndCleanupLocalPaths();
    res.json(new ApiResponse(200, result, "Database check completed"));
}));

router.route("/cleanup-videos").delete(asyncHandler(async (req, res) => {
    const deletedCount = await deleteVideosWithLocalPaths();
    res.json(new ApiResponse(200, { deletedCount }, "Cleanup completed"));
}));

export default router;
