"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const level_controllers_1 = require("./level.controllers");
const validate_query_midleware_1 = __importDefault(require("../midlewares/validate-query.midleware"));
const levels_dto_1 = require("./levels.dto");
const router = (0, express_1.Router)();
router.get("/", (0, validate_query_midleware_1.default)(levels_dto_1.GetLevelsQuerySchema), level_controllers_1.getLevelsController);
exports.default = router;
