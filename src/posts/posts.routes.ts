
import { Router } from "express";
import validate from "../midlewares/validate.midleware";
import { CreatePostDto } from "./posts.dtos";
import { asyncHandler } from "../shared/asyncHandler";
import { createPostController } from "./posts.controller";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import uploadPostMedias from "../midlewares/multer/uploadPostMedias";


const router = Router();

router.post("/", isAuthenticated, uploadPostMedias.array("medias"), validate(CreatePostDto), asyncHandler(createPostController));

export default router;