
import { Router } from "express";
import validate from "../midlewares/validate.midleware";
import { CreatePostDto } from "./posts.dtos";
import { asyncHandler } from "../shared/asyncHandler";
import { createPostController, deletePostController, getPostByIdController } from "./posts.controller";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import uploadPostMedias from "../midlewares/multer/uploadPostMedias";


const router = Router();

router.post("/", isAuthenticated, uploadPostMedias.array("medias"), validate(CreatePostDto), asyncHandler(createPostController));
router.delete("/:post_id", isAuthenticated, asyncHandler(deletePostController))
router.get("/:post_id", isAuthenticated, asyncHandler(getPostByIdController))
export default router;