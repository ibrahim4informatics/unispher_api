

import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import { asyncHandler } from "../shared/asyncHandler";
import { createCommentController, deleteCommentController, getPostCommentsController, updateCommentController } from "./comment.controller";
import validate from "../midlewares/validate.midleware";
import { CreateCommentDto, UpdateCommentDto } from "./comments.dto";


const router = Router();

router.post("/", isAuthenticated, validate(CreateCommentDto), asyncHandler(createCommentController));
router.patch("/:comment_id", isAuthenticated, validate(UpdateCommentDto), asyncHandler(updateCommentController));

router.delete("/:comment_id", isAuthenticated, asyncHandler(deleteCommentController));
router.get("/post/:post_id", isAuthenticated, asyncHandler(getPostCommentsController))


export default router;