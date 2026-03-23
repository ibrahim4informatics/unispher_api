"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsOfPost = exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const db_1 = __importDefault(require("../config/db"));
const notifications_service_1 = require("../notfications/notifications.service");
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const UnauthorizedError_1 = require("../shared/errors/UnauthorizedError");
const createComment = async (data, user_id) => {
    if (!user_id)
        throw new UnauthorizedError_1.UnauthorizedError("Can not create comment");
    const post = await db_1.default.post.findUnique({
        where: { id: data.post_id },
        select: {
            id: true,
            author_id: true
        }
    });
    if (!post)
        throw new NotFoundError_1.NotFoundError("Post does not exists");
    const comment = await db_1.default.comment.create({
        data: {
            ...data,
            author_id: user_id
        },
        include: {
            author: true
        }
    });
    const truncatedContent = comment.content.length > 25
        ? comment.content.slice(0, 25) + "…"
        : comment.content;
    await (0, notifications_service_1.createNotification)({
        type: "COMMENT_POST",
        actor_id: user_id,
        entity_id: post.id,
        is_read: false,
        body: `${comment.author.first_name} ${comment.author.last_name} commented on your post: "${truncatedContent}"`,
        title: "You have a new comment on your post"
    }, [post.author_id]);
    return comment;
};
exports.createComment = createComment;
const updateComment = async (comment_id, user_id, data) => {
    if (!comment_id)
        throw new BadRequestError_1.BadRequestError("Comment id is required");
    const comment = await db_1.default.comment.findUnique({ where: { id: comment_id } });
    if (!comment)
        throw new NotFoundError_1.NotFoundError("Comment does not exist");
    if (!user_id || comment.author_id !== user_id)
        throw new UnauthorizedError_1.UnauthorizedError("Can not update comment");
    await db_1.default.comment.update({
        where: {
            id: comment.id
        },
        data: {
            content: data.content
        }
    });
};
exports.updateComment = updateComment;
const deleteComment = async (comment_id, user_id) => {
    if (!comment_id)
        throw new BadRequestError_1.BadRequestError("No comment selected");
    const comment = await db_1.default.comment.findUnique({ where: { id: comment_id } });
    if (!comment)
        throw new NotFoundError_1.NotFoundError("Comment does not exist");
    if (!user_id || comment.author_id !== user_id)
        throw new UnauthorizedError_1.UnauthorizedError("Can not delete this comment");
    await db_1.default.comment.delete({ where: { id: comment.id } });
};
exports.deleteComment = deleteComment;
const getCommentsOfPost = async (post_id) => {
    if (!post_id)
        throw new BadRequestError_1.BadRequestError("Post id is required");
    const post = await db_1.default.post.findUnique({ where: { id: post_id } });
    if (!post)
        throw new NotFoundError_1.NotFoundError("Post does not exist");
    const comments = await db_1.default.comment.findMany({ where: { post_id }, include: { author: true }, orderBy: { created_at: "desc" } });
    return comments;
};
exports.getCommentsOfPost = getCommentsOfPost;
