"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdController = exports.getProfileController = exports.deleteUserController = exports.getUsersController = exports.uploadUserAvatarController = exports.changeAvatarController = exports.updateUserController = exports.changePasswordController = exports.changeEmailController = void 0;
const user_service_1 = require("./user.service");
const uploadUserAvatarController = async (req, res) => {
    const body = req.body;
    const file = req.file;
    await (0, user_service_1.uploadUserAvatarService)(body.user_id || undefined, file || undefined);
    return res.status(200).json({ message: "Profile picture uploaded successfully" });
};
exports.uploadUserAvatarController = uploadUserAvatarController;
const changeEmailController = async (req, res) => {
    const body = req.body;
    const user_id = req.user?.id || "";
    await (0, user_service_1.changeEmailService)(user_id, body.new_email);
    return res.status(200).json({ message: "Email changed successfully" });
};
exports.changeEmailController = changeEmailController;
const changePasswordController = async (req, res) => {
    const body = req.body;
    const user_id = req.user?.id || "";
    await (0, user_service_1.changePasswordService)(user_id, body.current_password, body.new_password);
    return res.status(200).json({ message: "Password changed successfully" });
};
exports.changePasswordController = changePasswordController;
const changeAvatarController = async (req, res) => {
    const file = req.file;
    const user_id = req.user?.id || "";
    await (0, user_service_1.changeAvatarService)(user_id, file || undefined);
    return res.status(200).json({ message: "Profile picture changed successfully" });
};
exports.changeAvatarController = changeAvatarController;
const deleteUserController = async (req, res) => {
    const user_id = req.user?.id || "";
    await (0, user_service_1.deleteUserService)(user_id);
    return res.status(200).json({ message: "User deleted successfully" });
};
exports.deleteUserController = deleteUserController;
const getProfileController = async (req, res) => {
    const user_id = req.user?.id || "";
    console.log(user_id);
    const user = await (0, user_service_1.getCurrentUserProfile)(user_id);
    return res.status(200).json({ profile: user });
};
exports.getProfileController = getProfileController;
const getUserByIdController = async (req, res) => {
    const current_user_id = req.user.id;
    const user_id = req.params.user_id;
    const user = await (0, user_service_1.getUserById)(user_id, current_user_id);
    return res.status(200).json({
        user
    });
};
exports.getUserByIdController = getUserByIdController;
const getUsersController = async (req, res) => {
    const user_id = req.user.id;
    const query = req.query;
    const results = await (0, user_service_1.getUsersService)(query, user_id);
    return res.status(200).json(results);
};
exports.getUsersController = getUsersController;
const updateUserController = async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;
    await (0, user_service_1.updateUserService)(data, user_id);
    return res.status(200).json({ message: "User updated" });
};
exports.updateUserController = updateUserController;
