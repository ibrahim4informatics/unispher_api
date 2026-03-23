"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../shared/asyncHandler");
const field_controllers_1 = require("./field.controllers");
const validate_query_midleware_1 = __importDefault(require("../midlewares/validate-query.midleware"));
const field_dto_1 = require("./field.dto");
const router = (0, express_1.Router)();
router.get("/", (0, validate_query_midleware_1.default)(field_dto_1.GetFieldQuerySchema), (0, asyncHandler_1.asyncHandler)(field_controllers_1.getFieldsController));
exports.default = router;
