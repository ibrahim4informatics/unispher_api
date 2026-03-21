import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler";
import { changeAvatarController, changeEmailController, changePasswordController, deleteUserController, getProfileController, getUserByIdController, getUsersController, updateUserController, uploadUserAvatarController } from "./user.controller";
import uploadUserAvatar from "../midlewares/multer/uploadUserAvatar";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import validate from "../midlewares/validate.midleware";
import { ChangeEmailDto, ChangePasswordDto, UpdateUserDto } from "./user.dto";


const router = Router();


router.get("/", isAuthenticated, asyncHandler(getUsersController));
router.patch("/", isAuthenticated, validate(UpdateUserDto), asyncHandler(updateUserController))
router.get("/me", isAuthenticated, asyncHandler(getProfileController));
router.post("/avatar", uploadUserAvatar.single("picture"), asyncHandler(uploadUserAvatarController));

router.patch("/email", isAuthenticated, validate(ChangeEmailDto), asyncHandler(changeEmailController));
router.patch("/password", isAuthenticated, validate(ChangePasswordDto), asyncHandler(changePasswordController));
router.patch("/avatar", isAuthenticated, uploadUserAvatar.single("picture"), asyncHandler(changeAvatarController));

router.delete("/", isAuthenticated, asyncHandler(deleteUserController));

router.get("/:user_id", isAuthenticated, asyncHandler(getUserByIdController));


export default router;