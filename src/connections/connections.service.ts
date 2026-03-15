import db from "../config/db";
import { createNotification } from "../notfications/notifications.service";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { GetConnectionsRequestsQueryDto, type SendConnectionRequestDto } from "./connections.dto";

export const sendConnectionRequestService = async (data: SendConnectionRequestDto, sender_id: string) => {

    const receiver_id = data.receiver_id;

    const receiver = await db.user.findUnique({ where: { id: receiver_id } });
    if (!receiver) throw new NotFoundError("Receiver user can not be found");
    if (receiver_id === sender_id) throw new BadRequestError("Can not send connection request to yourself");
    const connectionExists = await db.connection.findFirst({
        where: {
            OR: [
                { sender_id, receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        }
    });
    if (connectionExists) throw new BadRequestError("Connection request already sent");

    const connection = await db.connection.create({
        data: {
            sender_id,
            receiver_id
        },
        include: {
            sender: true
        }
    });


    await createNotification({
        type: "CONNECTION_REQUEST",
        title: "You have a new connection request",
        body: `${connection.sender.first_name} ${connection.sender.last_name} has sent you a connection request. Accept now to start collaborating.`,
        actor_id: sender_id,
        entity_id: connection.id,
        is_read: false
    }, [connection.receiver_id]);

    return connection;

}


export const acceptConnectionRequestService = async (connection_id: number, receiver_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id }, include: { receiver: true } });
    if (!connection || connection.status !== "PENDING") throw new NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id) throw new ForbiddenError("Can not accept this connection request");

    await db.connection.update({
        where: { id: connection_id },
        data: {
            status: "ACCEPTED"
        }
    });

    await createNotification({
        type: "CONNECTION_ACCEPTED",
        title: "Your connection request has been accepted",
        actor_id: receiver_id,
        body: `${connection.receiver.first_name} ${connection.receiver.last_name} has accepted your connection request. You can now message and collaborate with them.`,
        entity_id: connection.id,
        is_read: false
    }, [connection.sender_id]);

}


export const rejectConnectionRequestService = async (connection_id: number, receiver_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "PENDING") throw new NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id) throw new BadRequestError("Can not reject this connection request");

    await db.connection.delete({ where: { id: connection_id } });

}


export const getUserConnectionsService = async (user_id: string, query: GetConnectionsRequestsQueryDto) => {

    const page = query.page || 1;
    const limit = 30
    const nameParts = query.sender_name ? query.sender_name.split(" ") : [];

    const connections_db = await db.connection.findMany({
        where: {
            OR: [
                {
                    sender_id: user_id, status: "ACCEPTED",
                    receiver: query.sender_name ? {
                        first_name: {
                            contains: nameParts[0] || undefined
                        },
                        last_name: {
                            contains: nameParts[1] || undefined
                        }
                    } : undefined

                },
                {
                    receiver_id: user_id, status: "ACCEPTED",
                    sender: query.sender_name ? {
                        first_name: {
                            contains: nameParts[0] || undefined
                        },
                        last_name: {
                            contains: nameParts[1] || undefined
                        }

                    } : undefined
                }
            ],


        },
        include: {
            sender: true,
            receiver: true
        },
        take: limit + 1,
        skip: (page - 1) * limit,
        orderBy: {
            created_at: "desc"
        }
    });

    const has_more = connections_db.length > limit;

    if (has_more) {
        connections_db.pop()
    }

    const connections = connections_db.map(c => c.sender_id === user_id ? c.receiver : c.sender);
    return { connections, has_more, page }
}

export const getUserConnectionRequestsService = async (user_id: string, query: GetConnectionsRequestsQueryDto) => {
    const nameParts = query.sender_name ? query.sender_name.split(" ") : [];
    const page = query.page || 1;
    const limit = 30;
    const connectionRequests = await db.connection.findMany({
        where: {
            receiver_id: user_id,
            status: "PENDING",
            sender: {
                first_name: query.sender_name ? {

                    contains: nameParts[0] || undefined,

                } : undefined,

                last_name: query.sender_name ? {

                    contains: nameParts[1] || undefined,

                } : undefined,
            }
        },
        include: {
            sender: true
        },

        take: limit + 1,
        skip: (page - 1) * limit
    });

    const has_more = connectionRequests.length > limit;
    if (has_more) {
        connectionRequests.pop();
    }

    const connections = connectionRequests.map(c => ({ ...c.sender, connection_id: c.id }));


    return {
        connections, has_more, page
    }

}


export const deleteConnectionService = async (connection_id: number, user_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "ACCEPTED") throw new NotFoundError("Connection can not be found");
    if (connection.sender_id !== user_id && connection.receiver_id !== user_id) throw new BadRequestError("Can not delete this connection");

    await db.connection.delete({ where: { id: connection_id } });

}

export const getUserConnectionsIds = async (user_id: string) => {

    const connections_db = await db.connection.findMany({
        where: {
            OR: [
                {
                    sender_id: user_id, status: "ACCEPTED",

                },
                {
                    receiver_id: user_id, status: "ACCEPTED",

                }
            ],


        },

        select: {
            sender_id: true,
            receiver_id: true
        }
    });
    const connectedUsersIds = connections_db.map(conn => conn.receiver_id === user_id ? conn.sender_id : conn.receiver_id);
    return connectedUsersIds;
}