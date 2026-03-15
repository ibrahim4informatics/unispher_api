import { Notification, NotificationType } from "@prisma/client"
import db from "../config/db"
import { ServerError } from "../shared/errors/ServerError"



export const createNotification = async (data: Omit<Notification, "id" | "created_at" | "receiver_id">, receivers: string[]) => {
    if (receivers.length < 1) throw new ServerError("receivers should contain at least one id");
    await db.notification.createMany({
        data: receivers.map(receiver_id => ({ ...data, receiver_id })),
        skipDuplicates: true
    })
}


export const getUserNotification = async (user_id: string, page: number = 1) => {

    const limit = 30;


    const { notifications, has_more } = await db.$transaction(async (db) => {
        const notifications_db = await db.notification.findMany({
            where: { receiver_id: user_id },
            take: limit + 1,
            skip: (page - 1) * limit,
            include: { actor: true },
            orderBy: { created_at: "desc" },
        });
        const has_more = notifications_db.length > limit;
        if (has_more) notifications_db.pop();
        const unreadIds = notifications_db.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length > 0) {
            await db.notification.updateMany({
                where: { id: { in: unreadIds } },
                data: { is_read: true },
            });
        }

        return { notifications: notifications_db, has_more };
    });

    return {
        notifications, has_more, page
    }
}

