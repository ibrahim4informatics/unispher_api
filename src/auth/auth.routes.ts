

import { Router } from "express";
import { registerUserController } from "./auth.controllers";
import { asyncHandler } from "../shared/asyncHandler";
import validate from "../midlewares/validate.midleware";
import { UserRegisterBodySchema } from "./auth.dto";


const router = Router();

//Authentication routes

router.post("/register",validate(UserRegisterBodySchema),asyncHandler(registerUserController))

export default router;