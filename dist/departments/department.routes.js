"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_query_midleware_1 = __importDefault(require("../midlewares/validate-query.midleware"));
const department_dto_1 = require("./department.dto");
const asyncHandler_1 = require("../shared/asyncHandler");
const department_controllers_1 = require("./department.controllers");
const router = (0, express_1.Router)();
router.get("/", (0, validate_query_midleware_1.default)(department_dto_1.GetDepartmentsQuerySchema), (0, asyncHandler_1.asyncHandler)(department_controllers_1.getDepartmentsController));
exports.default = router;
