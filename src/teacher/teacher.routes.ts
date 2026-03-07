

import { Router } from "express";
import validate from "../midlewares/validate.midleware";
import { CreateTeacherProfileDto } from "./teacher.dto";
import { asyncHandler } from "../shared/asyncHandler";
import { createTeacherProfileController } from "./teacher.controller";


const router = Router();


router.post("/", validate(CreateTeacherProfileDto), asyncHandler(createTeacherProfileController));

export default router;