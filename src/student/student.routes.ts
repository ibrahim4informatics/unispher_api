import { Router } from "express";

import { createStudentProfileController, getStudentAcademicProfileController, updateStudentProfileController } from "./student.controller";
import validateBody from "../midlewares/validate.midleware";
import { CreateStudentProfileDtoSchema, UpdateStudentProfileDtoSchema } from "./student.dto";
import { asyncHandler } from "../shared/asyncHandler";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";

const router = Router();

// Student profile related routes
router.post("/profile", validateBody(CreateStudentProfileDtoSchema), asyncHandler(createStudentProfileController));
router.patch("/profile", isAuthenticated, validateBody(UpdateStudentProfileDtoSchema), asyncHandler(updateStudentProfileController));
router.get("/academic-profile", isAuthenticated, asyncHandler(getStudentAcademicProfileController));

export default router;