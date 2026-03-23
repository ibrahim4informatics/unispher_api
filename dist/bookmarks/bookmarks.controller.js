"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookmarksController = exports.deleteBookmarkController = exports.createBookmarkController = void 0;
const bookmarks_service_1 = require("./bookmarks.service");
const createBookmarkController = async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;
    await (0, bookmarks_service_1.createBookmark)(post_id, user_id);
    return res.status(201).json({ message: "Bookmark created" });
};
exports.createBookmarkController = createBookmarkController;
const deleteBookmarkController = async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;
    await (0, bookmarks_service_1.deleteBookmark)(post_id, user_id);
    return res.status(200).json({ message: "Bookmark deleted" });
};
exports.deleteBookmarkController = deleteBookmarkController;
const getUserBookmarksController = async (req, res) => {
    const user_id = req.user.id;
    const bookmarks = await (0, bookmarks_service_1.getUserBookmarks)(user_id);
    return res.status(200).json({ bookmarks });
};
exports.getUserBookmarksController = getUserBookmarksController;
