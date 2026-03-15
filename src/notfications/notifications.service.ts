import { Notification, NotificationType } from "@prisma/client"
import db from "../config/db"
import { ServerError } from "../shared/errors/ServerError"
import { ForbiddenError } from "../shared/errors/ForbidenError";



export const createNotification = async (data: Omit<Notification, "id" | "created_at" | "receiver_id">, receivers: string[]) => {
    if (receivers.length < 1) throw new ServerError("receivers should contain at least one id");
    await db.notification.createMany({
        data: receivers.map(receiver_id => ({ ...data, receiver_id })),
        skipDuplicates: true
    })
}


export const getUserNotification = async (user_id: string, page: number = 1) => {

    const limit = 30;



    const notifications_db = await db.notification.findMany({
        where: { receiver_id: user_id },
        take: limit + 1,
        skip: (page - 1) * limit,
        include: { actor: true },
        orderBy: { created_at: "desc" },
    });
    const has_more = notifications_db.length > limit;
    if (has_more) notifications_db.pop();



    return {
        notifications: notifications_db, has_more, page
    }
}


export const markNotificationRead = async (notification_id: number, user_id: string) => {
    const notification = await db.notification.findUnique({
        where: {
            id: notification_id
        }
    });

    if (!notification || notification.is_read || notification.receiver_id !== user_id) throw new ForbiddenError("Can't read notification");

    await db.notification.update({
        where: {
            id: notification.id
        },
        data: {
            is_read: true
        }
    })
}
