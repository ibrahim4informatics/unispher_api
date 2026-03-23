"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_authenticated_midleware_1 = __importDefault(require("../midlewares/auth/is-authenticated.midleware"));
const asyncHandler_1 = require("../shared/asyncHandler");
const notifications_controller_1 = require("./notifications.controller");
const router = (0, express_1.Router)();
router.get("/", is_authenticated_midleware_1.default, (0, asyncHandler_1.asyncHandler)(notifications_controller_1.getuserNotificationsController));
router.patch("/:notification_id", is_authenticated_midleware_1.default, (0, asyncHandler_1.asyncHandler)(notifications_controller_1.markNotificationReadController));
exports.default = router;
