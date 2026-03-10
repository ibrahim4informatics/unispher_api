import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
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
        }
    });

    return connection;

}


export const acceptConnectionRequestService = async (connection_id: number, receiver_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "PENDING") throw new NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id) throw new BadRequestError("Can not accept this connection request");

    await db.connection.update({
        where: { id: connection_id },
        data: {
            status: "ACCEPTED"
        }
    });

}


export const rejectConnectionRequestService = async (connection_id: number, receiver_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "PENDING") throw new NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id) throw new BadRequestError("Can not reject this connection request");

    await db.connection.delete({ where: { id: connection_id } });

}


export const getUserConnectionsService = async (user_id: string) => {

    const connections = await db.connection.findMany({
        where: {
            OR: [
                { sender_id: user_id, status: "ACCEPTED" },
                { receiver_id: user_id, status: "ACCEPTED" }
            ],

        },
        include: {
            sender: true,
            receiver: true
        }
    });
    return connections.map(c => c.sender_id === user_id ? c.receiver : c.sender);
}

export const getUserConnectionRequestsService = async (user_id: string, query: GetConnectionsRequestsQueryDto) => {
    const nameParts = query.sender_name ? query.sender_name.split(" ") : [];
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
        }
    });

    return connectionRequests.map(c => ({ ...c.sender, connection_id: c.id }));

}


export const deleteConnectionService = async (connection_id: number, user_id: string) => {

    const connection = await db.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "ACCEPTED") throw new NotFoundError("Connection can not be found");
    if (connection.sender_id !== user_id && connection.receiver_id !== user_id) throw new BadRequestError("Can not delete this connection");

    await db.connection.delete({ where: { id: connection_id } });

}