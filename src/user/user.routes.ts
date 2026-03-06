import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { uploadUserAvatarController } from "./user.controller";
import uploadUserAvatar from "../midlewares/multer/uploadUserAvatar";


const router = Router();


router.post("/avatar", uploadUserAvatar.single("picture"), asyncHandler(uploadUserAvatarController));



export default router;