"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedConnectionsService = exports.getUserConnectionsIds = exports.deleteConnectionService = exports.getUserConnectionRequestsService = exports.getUserConnectionsService = exports.rejectConnectionRequestService = exports.acceptConnectionRequestService = exports.sendConnectionRequestService = void 0;
const db_1 = __importDefault(require("../config/db"));
const notifications_service_1 = require("../notfications/notifications.service");
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const ForbidenError_1 = require("../shared/errors/ForbidenError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const sendConnectionRequestService = async (data, sender_id) => {
    const receiver_id = data.receiver_id;
    const receiver = await db_1.default.user.findUnique({ where: { id: receiver_id } });
    if (!receiver)
        throw new NotFoundError_1.NotFoundError("Receiver user can not be found");
    if (receiver_id === sender_id)
        throw new BadRequestError_1.BadRequestError("Can not send connection request to yourself");
    const connectionExists = await db_1.default.connection.findFirst({
        where: {
            OR: [
                { sender_id, receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        }
    });
    if (connectionExists)
        throw new BadRequestError_1.BadRequestError("Connection request already sent");
    const connection = await db_1.default.connection.create({
        data: {
            sender_id,
            receiver_id
        },
        include: {
            sender: true
        }
    });
    await (0, notifications_service_1.createNotification)({
        type: "CONNECTION_REQUEST",
        title: "You have a new connection request",
        body: `${connection.sender.first_name} ${connection.sender.last_name} has sent you a connection request. Accept now to start collaborating.`,
        actor_id: sender_id,
        entity_id: connection.id,
        is_read: false
    }, [connection.receiver_id]);
    return connection;
};
exports.sendConnectionRequestService = sendConnectionRequestService;
const acceptConnectionRequestService = async (connection_id, receiver_id) => {
    const connection = await db_1.default.connection.findUnique({ where: { id: connection_id }, include: { receiver: true } });
    if (!connection || connection.status !== "PENDING")
        throw new NotFoundError_1.NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id)
        throw new ForbidenError_1.ForbiddenError("Can not accept this connection request");
    await db_1.default.connection.update({
        where: { id: connection_id },
        data: {
            status: "ACCEPTED"
        }
    });
    await (0, notifications_service_1.createNotification)({
        type: "CONNECTION_ACCEPTED",
        title: "Your connection request has been accepted",
        actor_id: receiver_id,
        body: `${connection.receiver.first_name} ${connection.receiver.last_name} has accepted your connection request. You can now message and collaborate with them.`,
        entity_id: connection.id,
        is_read: false
    }, [connection.sender_id]);
};
exports.acceptConnectionRequestService = acceptConnectionRequestService;
const rejectConnectionRequestService = async (connection_id, receiver_id) => {
    const connection = await db_1.default.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "PENDING")
        throw new NotFoundError_1.NotFoundError("Connection request can not be found");
    if (connection.receiver_id !== receiver_id)
        throw new BadRequestError_1.BadRequestError("Can not reject this connection request");
    await db_1.default.connection.delete({ where: { id: connection_id } });
};
exports.rejectConnectionRequestService = rejectConnectionRequestService;
const getUserConnectionsService = async (user_id, query) => {
    const page = query.page || 1;
    const limit = 30;
    const nameParts = query.sender_name ? query.sender_name.split(" ") : [];
    const connections_db = await db_1.default.connection.findMany({
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
        connections_db.pop();
    }
    const connections = connections_db.map(c => c.sender_id === user_id ? c.receiver : c.sender);
    return { connections, has_more, page };
};
exports.getUserConnectionsService = getUserConnectionsService;
const getUserConnectionRequestsService = async (user_id, query) => {
    const nameParts = query.sender_name ? query.sender_name.split(" ") : [];
    const page = query.page || 1;
    const limit = 30;
    const connectionRequests = await db_1.default.connection.findMany({
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
    };
};
exports.getUserConnectionRequestsService = getUserConnectionRequestsService;
const deleteConnectionService = async (connection_id, user_id) => {
    const connection = await db_1.default.connection.findUnique({ where: { id: connection_id } });
    if (!connection || connection.status !== "ACCEPTED")
        throw new NotFoundError_1.NotFoundError("Connection can not be found");
    if (connection.sender_id !== user_id && connection.receiver_id !== user_id)
        throw new BadRequestError_1.BadRequestError("Can not delete this connection");
    await db_1.default.connection.delete({ where: { id: connection_id } });
};
exports.deleteConnectionService = deleteConnectionService;
const getUserConnectionsIds = async (user_id) => {
    const connections_db = await db_1.default.connection.findMany({
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
};
exports.getUserConnectionsIds = getUserConnectionsIds;
const getRecommendedConnectionsService = async (user_id, page = 1) => {
    const limit = 20;
    const userConnections = await db_1.default.connection.findMany({
        where: {
            OR: [
                { receiver_id: user_id, status: "ACCEPTED" },
                { sender_id: user_id, status: "ACCEPTED" },
            ],
        },
        select: { sender_id: true, receiver_id: true },
    });
    const userConnectedIds = userConnections.map(conn => conn.sender_id === user_id ? conn.receiver_id : conn.sender_id);
    const usersConnectedConnections = await db_1.default.connection.findMany({
        where: {
            OR: [
                { receiver_id: { in: userConnectedIds }, status: "ACCEPTED" },
                { sender_id: { in: userConnectedIds }, status: "ACCEPTED" },
            ],
        },
        take: 80,
        orderBy: {
            created_at: "desc"
        }
    });
    const suggestionUserIds = Array.from(new Set(usersConnectedConnections.map(conn => userConnectedIds.includes(conn.receiver_id) ? conn.sender_id : conn.receiver_id))).filter(id => id !== user_id && !userConnectedIds.includes(id));
    const suggestions = await db_1.default.user.findMany({
        where: { id: { in: suggestionUserIds } },
        select: {
            first_name: true,
            last_name: true,
            role: true,
            avatar_url: true,
            student_profile: { select: { university: true, field: true } },
            teacher_profile: { select: { university: true, academic_title: true } },
        },
        take: limit + 1,
        skip: (page - 1) * limit,
        orderBy: {
            created_at: "desc"
        }
    });
    const has_more = suggestions.length > limit;
    if (has_more)
        suggestions.pop();
    return { suggestions, has_more };
};
exports.getRecommendedConnectionsService = getRecommendedConnectionsService;
