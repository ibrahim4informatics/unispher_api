

import { Router } from "express";
import { loginController, registerUserController } from "./auth.controllers";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { UserLoginBodySchema, UserRegisterBodySchema } from "./auth.dto";


const router = Router();

//Authentication routes

router.post("/register",validate(UserRegisterBodySchema),asyncHandler(registerUserController))
router.post("/login",validate(UserLoginBodySchema),asyncHandler(loginController))

export default router;