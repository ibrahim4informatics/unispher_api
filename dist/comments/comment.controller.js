"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostCommentsController = exports.deleteCommentController = exports.updateCommentController = exports.createCommentController = void 0;
const comment_service_1 = require("./comment.service");
const createCommentController = async (req, res) => {
    const data = req.body;
    const user_id = req.user?.id || null;
    const comment = await (0, comment_service_1.createComment)(data, user_id);
    return res.status(201).json({ comment });
};
exports.createCommentController = createCommentController;
const updateCommentController = async (req, res) => {
    const data = req.body;
    const comment_id = req.params.comment_id ? parseInt(req.params.comment_id) : null;
    const user_id = req.user?.id || null;
    await (0, comment_service_1.updateComment)(comment_id, user_id, data);
    return res.status(200).json({ message: "Comment updated" });
};
exports.updateCommentController = updateCommentController;
const deleteCommentController = async (req, res) => {
    const comment_id = req.params.comment_id && parseInt(req.params.comment_id) || null;
    const user_id = req.user?.id || null;
    await (0, comment_service_1.deleteComment)(comment_id, user_id);
    return res.status(200).json({ message: "Comment deleted successfully" });
};
exports.deleteCommentController = deleteCommentController;
const getPostCommentsController = async (req, res) => {
    const post_id = req.params.post_id && (parseInt(req.params.post_id)) || null;
    const comments = await (0, comment_service_1.getCommentsOfPost)(post_id);
    return res.status(200).json({ comments });
};
exports.getPostCommentsController = getPostCommentsController;
