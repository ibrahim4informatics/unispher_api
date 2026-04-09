
import { FileTypes } from "@prisma/client"
import db from "../config/db"
import { BadRequestError } from "../shared/errors/BadRequestError"
import { uploadToCloudinary } from "../shared/services/cloudinary.service"

type MessageAttachment = {
    type: FileTypes,
    url: string
}
type Message = {
    text: string,
    chat_id: number,
    sender_id: string,
    attachments?: MessageAttachment[]
}

export const createMessage = async (data: Message) => {
    const { text, chat_id, sender_id, attachments } = data;

    const chat = await db.chat.findFirst({
        where: {
            id: chat_id,
            participants: {
                some: {
                    user_id: sender_id
                }
            }
        }
    });
    if (!chat) {
        throw new Error("Chat not found");
    }
    const message = await db.message.create({
        data: {
            text,
            chat_id,
            sender_id,
            attachments: {
                create: attachments || []
            }
        },
        include: {
            attachments: true
        }
    });

    return message;
}


export const getMessagesByChatIdService = async (data: { chat_id: number, user_id: string }, page: number = 1) => {
    const { chat_id, user_id } = data;
    const limit = 30;
    const offset = (page - 1) * limit;

    const chat = await db.chat.findFirst({
        where: {
            id: chat_id,
            participants: {
                some: {
                    user_id
                }
            }
        }
    });
    if (!chat) {
        throw new Error("Chat not found");
    }
    const messages = await db.message.findMany({
        where: {
            chat_id
        },
        take: limit + 1,
        skip: offset,
        orderBy: {
            created_at: "desc"
        },
        include: {
            attachments: true,
        }

    });
    const has_more = messages.length > limit;
    if (has_more) messages.pop(); // remove the extra message used to check for more messages

    return {
        messages: messages.map(({ sender_id, ...message }) => ({
            ...message,
            sender: sender_id === user_id ? "self" : "other"
        })),
        has_more,
        page
    };
}


export const uploadAttachmentService = async (sender_id: string, chat_id: number, file?: Express.Multer.File) => {

    if (!file) throw new BadRequestError("No file provided");
    const chat = await db.chat.findFirst({
        where: {
            id: chat_id,
            participants: {
                some: {
                    user_id: sender_id
                }
            }
        }
    });
    if (!chat) {
        throw new BadRequestError("Chat not found");
    }

    const url = await uploadToCloudinary(file, `chats/${chat_id}/messages/${sender_id}`);
    const message = await db.message.create({
        data: {
            chat_id,
            sender_id,
            last_for_chat: {
                connect: {
                    id: chat_id
                }
            },
            attachments: {
                create: {
                    type: file.mimetype.split("/")[0].toUpperCase() as FileTypes,
                    url
                }
            }
        }
    });

    return message;


}