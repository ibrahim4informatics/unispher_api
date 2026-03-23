"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookmarks = exports.deleteBookmark = exports.createBookmark = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const createBookmark = async (post_id, user_id) => {
    if (!post_id)
        throw new BadRequestError_1.BadRequestError("Post id is required");
    const bookmarkExists = await db_1.default.bookmark.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
            }
        }
    });
    if (bookmarkExists)
        throw new BadRequestError_1.BadRequestError("Bookmark exists");
    await db_1.default.bookmark.create({
        data: {
            post_id: parseInt(post_id),
            user_id
        }
    });
};
exports.createBookmark = createBookmark;
const deleteBookmark = async (post_id, user_id) => {
    if (!post_id)
        throw new BadRequestError_1.BadRequestError("Post id is required");
    const bookmark = await db_1.default.bookmark.findUnique({
        where: {
            user_id_post_id: {
                post_id: parseInt(post_id),
                user_id
            }
        }
    });
    if (!bookmark)
        throw new NotFoundError_1.NotFoundError("Bookmark is not found");
    await db_1.default.bookmark.delete({
        where: {
            id: bookmark.id
        }
    });
};
exports.deleteBookmark = deleteBookmark;
const getUserBookmarks = (user_id) => {
    const userBookmarks = db_1.default.bookmark.findMany({
        where: {
            user_id
        },
        include: {
            post: true
        }
    });
    return userBookmarks;
};
exports.getUserBookmarks = getUserBookmarks;
