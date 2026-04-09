import { Request, Response } from "express";
import { getMessagesByChatIdService, uploadAttachmentService } from "./messages.services";

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


export const uploadAttachmentsController = async (req: Request, res: Response) => {
    const { chat_id } = req.body;
    const sender_id = req.user.id;
    const file = req.file;

    try {
        const message = await uploadAttachmentService(sender_id, parseInt(chat_id as string), file);
        res.status(201).json({ message });
    } catch (err) {
        res.status(400).json({ error: err });
    }
}