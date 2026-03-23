"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_authenticated_midleware_1 = __importDefault(require("../midlewares/auth/is-authenticated.midleware"));
const asyncHandler_1 = require("../shared/asyncHandler");
const comment_controller_1 = require("./comment.controller");
const validate_midleware_1 = __importDefault(require("../midlewares/validate.midleware"));
const comments_dto_1 = require("./comments.dto");
const router = (0, express_1.Router)();
router.post("/", is_authenticated_midleware_1.default, (0, validate_midleware_1.default)(comments_dto_1.CreateCommentDto), (0, asyncHandler_1.asyncHandler)(comment_controller_1.createCommentController));
router.patch("/:comment_id", is_authenticated_midleware_1.default, (0, validate_midleware_1.default)(comments_dto_1.UpdateCommentDto), (0, asyncHandler_1.asyncHandler)(comment_controller_1.updateCommentController));
router.delete("/:comment_id", is_authenticated_midleware_1.default, (0, asyncHandler_1.asyncHandler)(comment_controller_1.deleteCommentController));
router.get("/post/:post_id", is_authenticated_midleware_1.default, (0, asyncHandler_1.asyncHandler)(comment_controller_1.getPostCommentsController));
exports.default = router;
