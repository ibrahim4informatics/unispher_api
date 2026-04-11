
import db from "../config/db"



type Message = {
    text: string,
    chat_id: number,
    sender_id: string,
}

export const createMessage = async (data: Message) => {
    const { text, chat_id, sender_id } = data;

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
        },
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


