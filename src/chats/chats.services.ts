
import db from "../config/db"
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { CreateChatDto } from "./chats.dto";


export const createChatService = async (user_id: string, { receiver_id }: CreateChatDto) => {
    if (!receiver_id) throw new BadRequestError("receiver id is required");
    const receiver = await db.user.findUnique({ where: { id: receiver_id }, select: { id: true } });
    if (!receiver) throw new NotFoundError("User does not exist")
    // find Chat if exists
    const chatExists = await db.chat.findFirst({
        where: {
            participants: {
                every: {
                    user_id: { in: [user_id, receiver_id] }
                }
            }
        },
        include: {
            participants: true
        }
    });


    if (chatExists) throw new ForbiddenError("Chat already exists");
    const chat = await db.chat.create({
        data: {
            participants: {
                create: [
                    { user_id },
                    { user_id: receiver_id }
                ]
            }
        }
    });
    return chat;
}


export const deleteChatService = async (user_id: string, chat_id: number) => {

    const chat = await db.chat.findUnique({
        where: {
            id: chat_id
        },
        select: {
            participants: {
                select: {
                    user_id: true
                }
            }
        }
    });

    if (!chat) throw new NotFoundError("Chat does not exist");
    const participantsIds = chat.participants.map(p => p.user_id);
    if (!participantsIds.includes(user_id)) throw new ForbiddenError("Can not delete this chat");

    await db.chat.delete({ where: { id: chat_id } });
}



export const getUserChatsService = async (user_id: string, page: number) => {

    const limit = 20
    const chats = await db.chat.findMany({
        where: {
            participants: {
                some: {
                    user_id
                },
            }
        },

        include: {
            participants: {
                include: {
                    user: true
                }
            },
            last_message: true
        },

        orderBy: {
            updated_at: "desc"
        },
        take: limit + 1,
        skip: (page - 1) * limit
    });

    const has_more = chats.length > limit;
    if (has_more) chats.pop();
    return {
        chats: chats.map(({ participants, ...chat }) => ({ participants: participants.filter(p => p.user_id !== user_id), ...chat })),
        page,
        has_more
    };

}