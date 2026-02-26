

import { Router } from "express";
import { loginController, refreshTokenController, registerUserController, resetPasswordController, sendResetOtpController, userLogoutController, verifyResetOtpController } from "./auth.controllers";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { LogoutBodySchema, RefreshTokenBodySchema, ResetPasswordBodySchema, SendResetPasswordOtpBodySchema, UserLoginBodySchema, UserRegisterBodySchema, VerifyOtpBodySchema } from "./auth.dto";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";


const router = Router();

//Authentication routes

router.post("/register", validate(UserRegisterBodySchema), asyncHandler(registerUserController))
router.post("/login", validate(UserLoginBodySchema), asyncHandler(loginController))
router.post("/refresh-token", validate(RefreshTokenBodySchema), asyncHandler(refreshTokenController));
//sending otp code
router.post("/reset", validate(SendResetPasswordOtpBodySchema), asyncHandler(sendResetOtpController));
router.post("/reset/verify", validate(VerifyOtpBodySchema), asyncHandler(verifyResetOtpController));
router.patch("/reset", validate(ResetPasswordBodySchema), asyncHandler(resetPasswordController));
router.post("/logout", isAuthenticated, validate(LogoutBodySchema), asyncHandler(userLogoutController));

export default router;