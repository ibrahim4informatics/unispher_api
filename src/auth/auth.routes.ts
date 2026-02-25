

import { Router } from "express";
import { loginController, refreshTokenController, registerUserController } from "./auth.controllers";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { RefreshTokenBodySchema, UserLoginBodySchema, UserRegisterBodySchema } from "./auth.dto";


const router = Router();

//Authentication routes

router.post("/register",validate(UserRegisterBodySchema),asyncHandler(registerUserController))
router.post("/login",validate(UserLoginBodySchema),asyncHandler(loginController))
router.post("/refresh-token", validate(RefreshTokenBodySchema), asyncHandler(refreshTokenController));

export default router;