import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { changeAvatarController, changeEmailController, changePasswordController, deleteUserController, getProfileController, uploadUserAvatarController } from "./user.controller";
import uploadUserAvatar from "../midlewares/multer/uploadUserAvatar";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import validate from "../midlewares/validate.midleware";
import { ChangeEmailDto, ChangePasswordDto } from "./user.dto";


const router = Router();


router.get("/me", isAuthenticated, asyncHandler(getProfileController));
router.post("/avatar", uploadUserAvatar.single("picture"), asyncHandler(uploadUserAvatarController));

router.patch("/email", validate(ChangeEmailDto), isAuthenticated, asyncHandler(changeEmailController));
router.patch("/password", validate(ChangePasswordDto),isAuthenticated, asyncHandler(changePasswordController));
router.patch("/avatar", isAuthenticated, uploadUserAvatar.single("picture"), asyncHandler(changeAvatarController));

router.delete("/", isAuthenticated, asyncHandler(deleteUserController));


export default router;