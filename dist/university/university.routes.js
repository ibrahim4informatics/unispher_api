"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_query_midleware_1 = __importDefault(require("../midlewares/validate-query.midleware"));
const university_dto_1 = require("./university.dto");
const asyncHandler_1 = require("../shared/asyncHandler");
const university_controllers_1 = require("./university.controllers");
const router = (0, express_1.Router)();
router.get("/", (0, validate_query_midleware_1.default)(university_dto_1.GetUniversitiesQuerySchema), (0, asyncHandler_1.asyncHandler)(university_controllers_1.getUniversitiesController));
exports.default = router;
