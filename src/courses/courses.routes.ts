import { Router } from "express";
import isAuthenticated from "../midlewares/auth/is-authenticated.midleware";
import hasRoleOf from "../midlewares/auth/has-role-of";
import validate from "../midlewares/validate.midleware";
import { CreateCourseDto, CreateSectionDto } from "./courses.dtos";
import { asyncHandler } from "../shared/asyncHandler";
import { createCourseController, deleteOwnCourseController, getCourseDetailsController, getCoursesController, getOwnCourseDetailsController, getOwnCoursesController, updateCourseController } from "./courses.controllers";
import { createSectionController, deleteSectionController, deleteSectionMaterialController, getCourseSectionsController, getSectionDetailsController, updateSectionController, uploadSectionMaterialController } from "./sections.controllers";
import uploadCourseMaterials from "../midlewares/multer/uploadCourseMaterials";
import { deleteEnrollmentController, enrollStudentController, getEnrolledCoursesController, getStudentEnrollmentController, getStudentsEnrolledByCourseIdController, unenrollStudentController } from "./enrollments.controllers";

const router = Router();

/* =======================
   COURSE ROUTES
======================= */

// Create course (draft|pending)
router.post("/", isAuthenticated, hasRoleOf(["TEACHER"]), validate(CreateCourseDto), asyncHandler(createCourseController));

// // Get courses (filters: approved, search, category...)
router.get("/", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(getCoursesController));

// Get own courses (filters: approved, search, category...)
router.get("/my-courses", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(getOwnCoursesController));
// Get own course details


// get enrolled courses
router.get("/enrollments/courses", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(getEnrolledCoursesController));



// // Create section
router.post("/:course_id/sections", isAuthenticated, hasRoleOf(["TEACHER"]), uploadCourseMaterials.array("files", 5), validate(CreateSectionDto), asyncHandler(createSectionController));
router.get("/:course_id/sections", isAuthenticated, asyncHandler(getCourseSectionsController));

// enroll in course
router.post("/:course_id/enrollments", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(enrollStudentController));
// check if user enrolled or not in course
router.get("/:course_id/enrollments/me", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(getStudentEnrollmentController));
// quit course
router.delete("/:course_id/enrollments", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(unenrollStudentController));
// get students enrolled in a specific course
router.get("/:course_id/enrollments/students", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(getStudentsEnrolledByCourseIdController));
// teacher delete enrollment of a student
router.delete("/:course_id/enrollments/:student_id", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(deleteEnrollmentController));


// upload section materials
router.patch("/:course_id/sections/:section_id/materials", isAuthenticated, hasRoleOf(["TEACHER"]), uploadCourseMaterials.array("files", 5), asyncHandler(uploadSectionMaterialController));
router.delete("/:course_id/materials/:material_id", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(deleteSectionMaterialController));


router.get("/:course_id/sections/:section_id", isAuthenticated, asyncHandler(getSectionDetailsController));



// // Update section
router.patch("/:course_id/sections/:section_id", isAuthenticated, hasRoleOf(["TEACHER"]), validate(CreateSectionDto.partial()), asyncHandler(updateSectionController));

// // Delete section
router.delete("/:course_id/sections/:section_id", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(deleteSectionController));






// get own course details (only teacher & owner)
router.get("/my-courses/:course_id", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(getOwnCourseDetailsController));
router.delete("/my-courses/:course_id", isAuthenticated, hasRoleOf(["TEACHER"]), asyncHandler(deleteOwnCourseController));
// // Get single course details
router.get("/:course_id", isAuthenticated, hasRoleOf(["STUDENT"]), asyncHandler(getCourseDetailsController));
// // Update course (only  & owner)
router.patch("/:course_id", isAuthenticated, hasRoleOf(["TEACHER"]), validate(CreateCourseDto.partial()), asyncHandler(updateCourseController));



export default router;