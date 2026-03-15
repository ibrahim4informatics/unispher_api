import { Request, Response } from "express";
import { getUserNotification, markNotificationRead } from "./notifications.service";


export const getuserNotificationsController = async (req: Request, res: Response) => {

    const user_id = req.user.id;
    const page = parseInt(req.params.page as string) || 1;
    const notifications = await getUserNotification(user_id, page);
    return res.status(200).json({
        notifications
    })
}


export const markNotificationReadController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const notification_id = parseInt(req.params.notification_id as string)
    await markNotificationRead(notification_id, user_id);
    return res.status(200).json({
        message: "Notification has been read"
    })


}