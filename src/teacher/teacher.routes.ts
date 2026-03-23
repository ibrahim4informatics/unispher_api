

import { Router } from "express";
import validate from "../midlewares/validate.midleware";
import { CreateTeacherProfileDto, UpdateTeacherProfileDto } from "./teacher.dto";
import { asyncHandler } from "../shared/asyncHandler";
import { createTeacherProfileController, getTeacherProfileController, updateTeacherProfileController } from "./teacher.controller";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";


const router = Router();


router.post("/", validate(CreateTeacherProfileDto), asyncHandler(createTeacherProfileController));
router.get("/", isAuthenticated, asyncHandler(getTeacherProfileController));
router.patch("/", isAuthenticated, validate(UpdateTeacherProfileDto), asyncHandler(updateTeacherProfileController));

export default router;