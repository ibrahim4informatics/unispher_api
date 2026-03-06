import { Router } from "express";

import { createStudentProfileController } from "./student.controller";
import validateBody from "../midlewares/validate.midleware";
import { CreateStudentProfileDtoSchema } from "./student.dto";
import { asyncHandler } from "../shared/asyncHandler";

const router = Router();

// Student profile related routes
router.post("/profile", validateBody(CreateStudentProfileDtoSchema), asyncHandler(createStudentProfileController));


export default router;