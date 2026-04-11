import { Request, Response } from "express";
import { getMessagesByChatIdService } from "./messages.services";

export const getMessagesByChatIdController = async (req: Request, res: Response) => {
    const { chat_id } = req.params;
    const user_id = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    try {
        const messages = await getMessagesByChatIdService({ chat_id: parseInt(chat_id as string), user_id }, page);
        res.json(messages);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}


