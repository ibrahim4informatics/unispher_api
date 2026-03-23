"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationReadController = exports.getuserNotificationsController = void 0;
const notifications_service_1 = require("./notifications.service");
const getuserNotificationsController = async (req, res) => {
    const user_id = req.user.id;
    const page = parseInt(req.params.page) || 1;
    const notifications = await (0, notifications_service_1.getUserNotification)(user_id, page);
    return res.status(200).json({
        notifications
    });
};
exports.getuserNotificationsController = getuserNotificationsController;
const markNotificationReadController = async (req, res) => {
    const user_id = req.user.id;
    const notification_id = parseInt(req.params.notification_id);
    await (0, notifications_service_1.markNotificationRead)(notification_id, user_id);
    return res.status(200).json({
        message: "Notification has been read"
    });
};
exports.markNotificationReadController = markNotificationReadController;
