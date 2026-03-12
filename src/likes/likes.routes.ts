import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { createLikeController, deleteLikeController } from "./likes.controller";

const router = Router();

router.post("/:post_id", isAuthenticated, asyncHandler(createLikeController));
router.delete("/:post_id", isAuthenticated, asyncHandler(deleteLikeController));

export default router;