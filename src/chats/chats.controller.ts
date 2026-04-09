import { Request, Response } from "express";
import { createChatService, deleteChatService, getChatByIdService, getChatByUserIdIfExist, getUserChatsService, updateLastReadAtService } from "./chats.services";
import { CreateChatDto } from "./chats.dto";


export const createChatController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const body: CreateChatDto = req.body;
    const chat = await createChatService(user_id, body);
    return res.status(201).json({ chat })
}

export const deleteChatController = async (req: Request, res: Response) => {

    const chat_id: number = parseInt(req.params.chat_id as string);
    const user_id = req.user.id;

    await deleteChatService(user_id, chat_id);
    return res.status(200).json({ message: "Chat deleted" })
}


export const getUserChatsController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const results = await getUserChatsService(user_id, page);
    return res.status(200).json(results);
}


export const getChatByUserIdController = async (req: Request, res: Response) => {
    const current_user_id = req.user.id;
    const user_id = req.params.user_id as string;
    const chat = await getChatByUserIdIfExist(current_user_id, user_id);
    return res.status(200).json({ chat });
}

export const getChatByIdController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const chat_id = parseInt(req.params.chat_id as string);
    const chat = await getChatByIdService(user_id, chat_id);
    return res.status(200).json({ chat });
}

export const updateLastReadAtController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const chat_id = parseInt(req.params.chat_id as string);
    await updateLastReadAtService(user_id, chat_id);
    return res.status(200).json({ message: "Last read at updated" });
}