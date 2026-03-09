
import { Router } from "express";
import validate from "../midlewares/validate.midleware";
import { CreatePostDto, GetPostsQueryDto } from "./posts.dtos";
import { asyncHandler } from "../shared/asyncHandler";
import { createPostController, deletePostController, getPostByIdController, getPostsController } from "./posts.controller";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import uploadPostMedias from "../midlewares/multer/uploadPostMedias";
import validateQuery from "../midlewares/validate-query.midleware";


const router = Router();
router.get("/", isAuthenticated, validateQuery(GetPostsQueryDto), asyncHandler(getPostsController))
router.get("/:post_id", isAuthenticated, asyncHandler(getPostByIdController))
router.post("/", isAuthenticated, uploadPostMedias.array("medias"), validate(CreatePostDto), asyncHandler(createPostController));
router.delete("/:post_id", isAuthenticated, asyncHandler(deletePostController))

export default router;