"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const asyncHandler_1 = require("../shared/asyncHandler");
const validate_midleware_1 = __importDefault(require("../midlewares/validate.midleware"));
const auth_dto_1 = require("./auth.dto");
const uploadIdentityCard_1 = __importDefault(require("../midlewares/multer/uploadIdentityCard"));
const is_authenticated_midleware_1 = __importDefault(require("../midlewares/auth/is-authenticated.midleware"));
const router = (0, express_1.Router)();
//Authentication routes
router.post("/register", (0, validate_midleware_1.default)(auth_dto_1.UserRegisterBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.registerUserController));
router.post("/login", (0, validate_midleware_1.default)(auth_dto_1.UserLoginBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.loginController));
router.post("/refresh-token", (0, validate_midleware_1.default)(auth_dto_1.RefreshTokenBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.refreshTokenController));
//sending otp code
router.post("/reset", (0, validate_midleware_1.default)(auth_dto_1.SendResetPasswordOtpBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.sendResetOtpController));
router.post("/reset/verify", (0, validate_midleware_1.default)(auth_dto_1.VerifyOtpBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.verifyResetOtpController));
router.patch("/reset", (0, validate_midleware_1.default)(auth_dto_1.ResetPasswordBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.resetPasswordController));
router.post("/logout", is_authenticated_midleware_1.default, (0, validate_midleware_1.default)(auth_dto_1.LogoutBodySchema), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.userLogoutController));
router.post("/upload-identity", uploadIdentityCard_1.default.single("file"), (0, asyncHandler_1.asyncHandler)(auth_controllers_1.uploadIdentityController));
exports.default = router;
