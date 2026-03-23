"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const validate_midleware_1 = __importDefault(require("../midlewares/validate.midleware"));
const student_dto_1 = require("./student.dto");
const asyncHandler_1 = require("../shared/asyncHandler");
const is_authenticated_midleware_1 = __importDefault(require("../midlewares/auth/is-authenticated.midleware"));
const router = (0, express_1.Router)();
// Student profile related routes
router.post("/profile", (0, validate_midleware_1.default)(student_dto_1.CreateStudentProfileDtoSchema), (0, asyncHandler_1.asyncHandler)(student_controller_1.createStudentProfileController));
router.patch("/profile", is_authenticated_midleware_1.default, (0, validate_midleware_1.default)(student_dto_1.UpdateStudentProfileDtoSchema), (0, asyncHandler_1.asyncHandler)(student_controller_1.updateStudentProfileController));
router.get("/academic-profile", is_authenticated_midleware_1.default, (0, asyncHandler_1.asyncHandler)(student_controller_1.getStudentAcademicProfileController));
exports.default = router;
