"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLikeService = exports.createLikeService = void 0;
const db_1 = __importDefault(require("../config/db"));
const notifications_service_1 = require("../notfications/notifications.service");
const posts_service_1 = require("../posts/posts.service");
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const createLikeService = async (user_id, post_id) => {
    if (!post_id)
        throw new BadRequestError_1.BadRequestError("post_id is required");
    const post = await (0, posts_service_1.getPostByIdService)(parseInt(post_id));
    if (!post)
        throw new NotFoundError_1.NotFoundError("Can not find post");
    const isAlreadyLiked = await db_1.default.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
            }
        }
    });
    if (isAlreadyLiked)
        throw new BadRequestError_1.BadRequestError("Post already liked");
    const { user: liker } = await db_1.default.like.create({
        data: {
            user_id,
            post_id: parseInt(post_id),
        },
        include: {
            user: true
        }
    });
    await (0, notifications_service_1.createNotification)({
        actor_id: liker.id,
        body: `${liker.first_name} ${liker.last_name} liked your post.`,
        title: "Someone Liked your post",
        entity_id: post.id,
        is_read: false,
        type: "LIKE_POST"
    }, [post.author_id]);
};
exports.createLikeService = createLikeService;
const deleteLikeService = async (user_id, post_id) => {
    if (!post_id)
        throw new BadRequestError_1.BadRequestError("Post id is required");
    const like = await db_1.default.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
            }
        }
    });
    if (!like)
        throw new NotFoundError_1.NotFoundError("Like can not be found");
    await db_1.default.like.delete({
        where: {
            id: like.id
        }
    });
};
exports.deleteLikeService = deleteLikeService;
