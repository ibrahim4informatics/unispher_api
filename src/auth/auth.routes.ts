

import { Router } from "express";
import { registerUserController } from "./auth.controllers";
import { asyncHandler } from "../shared/asyncHandler";


const router = Router();

//Authentication routes

router.post("/register",asyncHandler(registerUserController))

export default router;