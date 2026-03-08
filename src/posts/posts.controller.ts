import { Request, Response } from "express";
import { createPostService } from "./posts.service";


export const createPostController = async (req: Request, res: Response) => {
    const body = req.body;
    const files = req.files as Express.Multer.File[] || [];
    const author_id = req.user?.id || "";
    await createPostService(author_id, body, files);
    return res.status(201).json({ message: "Post created successfully" });
}