"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_midleware_1 = __importDefault(require("../midlewares/validate.midleware"));
const teacher_dto_1 = require("./teacher.dto");
const asyncHandler_1 = require("../shared/asyncHandler");
const teacher_controller_1 = require("./teacher.controller");
const router = (0, express_1.Router)();
router.post("/", (0, validate_midleware_1.default)(teacher_dto_1.CreateTeacherProfileDto), (0, asyncHandler_1.asyncHandler)(teacher_controller_1.createTeacherProfileController));
exports.default = router;
