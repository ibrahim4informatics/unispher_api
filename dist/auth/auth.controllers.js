"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadIdentityController = exports.userLogoutController = exports.resetPasswordController = exports.verifyResetOtpController = exports.sendResetOtpController = exports.refreshTokenController = exports.loginController = exports.registerUserController = void 0;
const auth_services_1 = require("./auth.services");
const registerUserController = async (request, res) => {
    const body = request.body;
    const user = await (0, auth_services_1.registerUserService)(body);
    return res.status(201).json({ message: "user register success", user });
};
exports.registerUserController = registerUserController;
const loginController = async (req, res) => {
    const body = req.body;
    const device = req.headers["x-device"] || `${req.useragent?.platform} ${req.useragent?.isMobile ? "Phone" : "Desktop"}`;
    const { accessToken, refreshToken } = await (0, auth_services_1.loginUserService)(body, device);
    return res.status(200).json({ accessToken, refreshToken });
};
exports.loginController = loginController;
const refreshTokenController = async (req, res) => {
    const body = req.body;
    const accessToken = await (0, auth_services_1.refreshTokenService)(body.refresh_token);
    return res.status(200).json({ accessToken });
};
exports.refreshTokenController = refreshTokenController;
const sendResetOtpController = async (req, res) => {
    const body = req.body;
    const { user_id, result } = await (0, auth_services_1.sendPasswordOtpService)(body.email);
    return res.status(200).json({ user_id, result });
};
exports.sendResetOtpController = sendResetOtpController;
const verifyResetOtpController = async (req, res) => {
    const body = req.body;
    const { verified, reset_token } = await (0, auth_services_1.resetPasswordVeirfyOtpService)(body.otp_code, body.user_id);
    return res.status(200).json({ verified, reset_token });
};
exports.verifyResetOtpController = verifyResetOtpController;
const resetPasswordController = async (req, res) => {
    const body = req.body;
    const { password_changed } = await (0, auth_services_1.resetPasswordService)(body);
    return res.status(200).json({ password_changed });
};
exports.resetPasswordController = resetPasswordController;
const userLogoutController = async (req, res) => {
    const body = req.body;
    const result = await (0, auth_services_1.userLogoutService)(body);
    return res.status(200).json(result);
};
exports.userLogoutController = userLogoutController;
const uploadIdentityController = async (req, res) => {
    const file = req.file;
    const user_id = req.body.user_id;
    await (0, auth_services_1.uploadIdentityService)(user_id, file);
    return res.status(200).json({ message: "ID Card uploaded successfully" });
};
exports.uploadIdentityController = uploadIdentityController;
