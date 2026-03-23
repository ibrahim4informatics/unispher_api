"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationRead = exports.getUserNotification = exports.createNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const ServerError_1 = require("../shared/errors/ServerError");
const ForbidenError_1 = require("../shared/errors/ForbidenError");
const createNotification = async (data, receivers) => {
    if (receivers.length < 1)
        throw new ServerError_1.ServerError("receivers should contain at least one id");
    await db_1.default.notification.createMany({
        data: receivers.map(receiver_id => ({ ...data, receiver_id })),
        skipDuplicates: true
    });
};
exports.createNotification = createNotification;
const getUserNotification = async (user_id, page = 1) => {
    const limit = 30;
    const notifications_db = await db_1.default.notification.findMany({
        where: { receiver_id: user_id },
        take: limit + 1,
        skip: (page - 1) * limit,
        include: { actor: true },
        orderBy: { created_at: "desc" },
    });
    const has_more = notifications_db.length > limit;
    if (has_more)
        notifications_db.pop();
    return {
        notifications: notifications_db, has_more, page
    };
};
exports.getUserNotification = getUserNotification;
const markNotificationRead = async (notification_id, user_id) => {
    const notification = await db_1.default.notification.findUnique({
        where: {
            id: notification_id
        }
    });
    if (!notification || notification.is_read || notification.receiver_id !== user_id)
        throw new ForbidenError_1.ForbiddenError("Can't read notification");
    await db_1.default.notification.update({
        where: {
            id: notification.id
        },
        data: {
            is_read: true
        }
    });
};
exports.markNotificationRead = markNotificationRead;
