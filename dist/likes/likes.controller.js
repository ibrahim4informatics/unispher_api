"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLikeController = exports.createLikeController = void 0;
const likes_service_1 = require("./likes.service");
const createLikeController = async (req, res) => {
    const post_id = req.params?.post_id || null;
    const user_id = req.user.id || null;
    await (0, likes_service_1.createLikeService)(user_id, post_id);
    return res.status(201).json({ message: "Post liked" });
};
exports.createLikeController = createLikeController;
const deleteLikeController = async (req, res) => {
    const post_id = req.params?.post_id || null;
    const user_id = req.user.id || null;
    await (0, likes_service_1.deleteLikeService)(user_id, post_id);
    return res.status(200).json({ message: "Post Unliked success" });
};
exports.deleteLikeController = deleteLikeController;
