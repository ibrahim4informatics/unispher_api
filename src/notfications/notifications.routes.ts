

import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { getuserNotificationsController, markNotificationReadController } from "./notifications.controller";

const router = Router();


router.get("/", isAuthenticated, asyncHandler(getuserNotificationsController));
router.patch("/:notification_id", isAuthenticated, asyncHandler(markNotificationReadController))

export default router;