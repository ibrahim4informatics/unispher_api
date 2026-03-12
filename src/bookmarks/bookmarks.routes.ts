import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { createBookmarkController, deleteBookmarkController, getUserBookmarksController } from "./bookmarks.controller";

const router = Router();


router.get("/", isAuthenticated, asyncHandler(getUserBookmarksController));
router.post("/:post_id", isAuthenticated, asyncHandler(createBookmarkController));
router.delete("/:post_id", isAuthenticated, asyncHandler(deleteBookmarkController));


export default router;