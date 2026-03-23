"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserPostsService = exports.deletePostMediaByIdService = exports.updatePostByIdService = exports.getPostsService = exports.getPostByIdService = exports.deletePostBydIdService = exports.createPostService = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const ForbidenError_1 = require("../shared/errors/ForbidenError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const cloudinary_service_1 = require("../shared/services/cloudinary.service");
const connections_service_1 = require("../connections/connections.service");
const notifications_service_1 = require("../notfications/notifications.service");
const createPostService = async (author_id, data, file) => {
    // console.log(file)
    const post = await db_1.default.post.create({
        data: {
            author_id,
            content: data.content,
            type: data.type,
        },
        include: {
            author: true
        }
    });
    //upload files if exist
    if (file && file.length > 0) {
        const uploadPromises = file.map((f) => ((0, cloudinary_service_1.uploadToCloudinary)(f, `posts/${post.id}/attachments`)));
        const attachments = await Promise.all(uploadPromises);
        const data = attachments.map((url) => {
            const mediaType = url.split('.').pop()?.toLowerCase();
            let type = "OTHER";
            if (mediaType) {
                if (["jpg", "jpeg", "png", "gif"].includes(mediaType)) {
                    type = "IMAGE";
                }
                else if (["mp4", "avi", "mov"].includes(mediaType)) {
                    type = "VIDEO";
                }
            }
            return {
                post_id: post.id,
                url,
                type
            };
        });
        await db_1.default.postMedia.createMany({
            data
        });
        const connectedUsersIds = await (0, connections_service_1.getUserConnectionsIds)(author_id);
        if (connectedUsersIds.length > 0) {
            (0, notifications_service_1.createNotification)({
                type: "PUBLISHED_POST",
                actor_id: author_id,
                entity_id: post.id,
                is_read: false,
                title: "New post added",
                body: `${post.author.first_name} ${post.author.last_name} published new post`
            }, connectedUsersIds);
        }
        return post;
    }
};
exports.createPostService = createPostService;
const deletePostBydIdService = async (user_id, post_id) => {
    if (!post_id || !user_id)
        throw new BadRequestError_1.BadRequestError("Can not delete post");
    const post = await db_1.default.post.findUnique({ where: { id: post_id }, include: { postMedias: true } });
    if (!post)
        throw new NotFoundError_1.NotFoundError("Post can not be found");
    if (post.author_id !== user_id)
        throw new ForbidenError_1.ForbiddenError("Post can not be deleted");
    if (post.postMedias.length > 0) {
        const deleteMediasPromises = post.postMedias.map(m => {
            const public_id = (0, cloudinary_service_1.getPublicId)(m.url);
            return (0, cloudinary_service_1.deleteFromCloudinary)(public_id);
        });
        await Promise.all(deleteMediasPromises);
    }
    await db_1.default.post.delete({
        where: {
            id: post_id
        }
    });
};
exports.deletePostBydIdService = deletePostBydIdService;
// get posts based on user
const getPostsService = async (query, user_id) => {
    const page = query.page || 1;
    const posts = await db_1.default.post.findMany({
        take: 20,
        skip: (page - 1) * 20,
        orderBy: {
            created_at: "desc"
        },
        include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {
                select: {
                    user_id: true
                }
            },
            postMedias: true,
            author: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                    booksmarks: true
                }
            }
        }
    });
    const returnedPosts = posts.map(({ likes, booksmarks, ...post }) => {
        const is_liked = likes.filter(l => l.user_id === user_id).length;
        const is_booked = booksmarks.filter(b => b.user_id === user_id).length;
        return {
            ...post, is_liked: is_liked > 0 ? true : false,
            is_booked: is_booked > 0 ? true : false
        };
    });
    return returnedPosts;
};
exports.getPostsService = getPostsService;
const getPostByIdService = async (post_id, user_id) => {
    const post = await db_1.default.post.findUnique({
        where: { id: post_id }, include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {
                select: {
                    user_id: true
                }
            },
            postMedias: true,
            author: {
                include: {
                    student_profile: {
                        include: {
                            field: true,
                            university: true
                        }
                    },
                    teacher_profile: {
                        include: {
                            university: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    booksmarks: true,
                    likes: true
                }
            }
        }
    });
    if (!post)
        throw new NotFoundError_1.NotFoundError("post can not be found");
    const is_liked = post.likes.filter(l => l.user_id === user_id).length;
    const is_booked = post.booksmarks.filter(b => b.user_id === user_id).length;
    const { likes, booksmarks, ...postData } = post;
    return { ...postData, is_booked: is_booked > 0 ? true : false, is_liked: is_liked > 0 ? true : false };
};
exports.getPostByIdService = getPostByIdService;
const updatePostByIdService = async (post_id, user_id, data, files) => {
    const post = await db_1.default.post.findUnique({ where: { id: post_id } });
    if (!post)
        throw new NotFoundError_1.NotFoundError("Post can not be found");
    if (post.author_id !== user_id)
        throw new ForbidenError_1.ForbiddenError("Post can not be updated");
    if (files && files.length > 0) {
        const uploadPromises = files.map((f) => ((0, cloudinary_service_1.uploadToCloudinary)(f, `posts/${post.id}/attachments`)));
        const attachments = await Promise.all(uploadPromises);
        const data = attachments.map((url) => {
            const mediaType = url.split('.').pop()?.toLowerCase();
            let type = "OTHER";
            if (mediaType) {
                if (["jpg", "jpeg", "png", "gif"].includes(mediaType)) {
                    type = "IMAGE";
                }
                else if (["mp4", "avi", "mov"].includes(mediaType)) {
                    type = "VIDEO";
                }
            }
            return {
                post_id: post.id,
                url,
                type
            };
        });
        await db_1.default.postMedia.createMany({
            data
        });
    }
    await db_1.default.post.update({
        where: {
            id: post_id
        },
        data
    });
};
exports.updatePostByIdService = updatePostByIdService;
const deletePostMediaByIdService = async (post_media_id, user_id) => {
    const postMedia = await db_1.default.postMedia.findUnique({ where: { id: post_media_id }, include: { post: true } });
    if (!postMedia)
        throw new NotFoundError_1.NotFoundError("Post media can not be found");
    if (postMedia.post.author_id !== user_id)
        throw new ForbidenError_1.ForbiddenError("Post media can not be deleted");
    const public_id = (0, cloudinary_service_1.getPublicId)(postMedia.url);
    console.log(public_id);
    const deletep = await (0, cloudinary_service_1.deleteFromCloudinary)(public_id, postMedia.type === "IMAGE" ? "image" : postMedia.type === "VIDEO" ? "video" : "raw");
    console.log(deletep);
    await db_1.default.postMedia.delete({ where: { id: post_media_id } });
};
exports.deletePostMediaByIdService = deletePostMediaByIdService;
const getCurrentUserPostsService = async (user_id, page = 1) => {
    const limite = 20;
    const posts = await db_1.default.post.findMany({
        where: {
            author_id: user_id
        },
        take: limite + 1,
        skip: (page - 1) * limite,
        orderBy: {
            created_at: "desc"
        },
        include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {
                select: {
                    user_id: true
                }
            },
            postMedias: true,
            author: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                    booksmarks: true
                }
            }
        }
    });
    const has_more = posts.length > limite;
    if (has_more)
        posts.pop();
    const refactored_posts = posts.map(({ likes, booksmarks, ...post }) => {
        const is_liked = likes.filter(l => l.user_id === user_id).length > 0;
        const is_booked = booksmarks.filter(b => b.user_id === user_id).length > 0;
        return { ...post, is_liked, is_booked };
    });
    return { posts: refactored_posts, page, has_more };
};
exports.getCurrentUserPostsService = getCurrentUserPostsService;
