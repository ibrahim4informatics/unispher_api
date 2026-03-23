"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserPostsController = exports.deletePostMediaByIdController = exports.updatePostByIdController = exports.getPostByIdController = exports.getPostsController = exports.deletePostController = exports.createPostController = void 0;
const posts_service_1 = require("./posts.service");
const createPostController = async (req, res) => {
    const body = req.body;
    const files = req.files || [];
    const author_id = req.user?.id || "";
    await (0, posts_service_1.createPostService)(author_id, body, files);
    return res.status(201).json({ message: "Post created successfully" });
};
exports.createPostController = createPostController;
const deletePostController = async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;
    await (0, posts_service_1.deletePostBydIdService)(user_id, parseInt(post_id));
    return res.status(200).json({ message: "Post deleted successfully" });
};
exports.deletePostController = deletePostController;
const getPostsController = async (req, res) => {
    const query = req.query;
    const user_id = req.user.id;
    const posts = await (0, posts_service_1.getPostsService)(query, user_id);
    return res.status(200).json({ posts });
};
exports.getPostsController = getPostsController;
const getPostByIdController = async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.user.id;
    const post = await (0, posts_service_1.getPostByIdService)(parseInt(post_id), user_id);
    return res.status(200).json({
        post
    });
};
exports.getPostByIdController = getPostByIdController;
const updatePostByIdController = async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.user.id;
    const data = req.body;
    const files = req.files || [];
    await (0, posts_service_1.updatePostByIdService)(parseInt(post_id), user_id, data, files);
    return res.status(200).json({ message: "Post updated successfully" });
};
exports.updatePostByIdController = updatePostByIdController;
const deletePostMediaByIdController = async (req, res) => {
    const media_id = req.params.media_id;
    const user_id = req.user.id;
    await (0, posts_service_1.deletePostMediaByIdService)(parseInt(media_id), user_id);
    return res.status(200).json({ message: "Post media deleted successfully" });
};
exports.deletePostMediaByIdController = deletePostMediaByIdController;
const getCurrentUserPostsController = async (req, res) => {
    const user_id = req.user.id;
    const page = req.query.page;
    const results = await (0, posts_service_1.getCurrentUserPostsService)(user_id, parseInt(page) || undefined);
    return res.status(200).json(results);
};
exports.getCurrentUserPostsController = getCurrentUserPostsController;
