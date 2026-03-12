import { Request, Response } from "express";
import { createLikeService, deleteLikeService } from "./likes.service";


export const createLikeController = async (req: Request, res: Response) => {
    const post_id = req.params?.post_id || null;
    const user_id = req.user.id || null;


    await createLikeService(user_id, post_id as (string | null));
    return res.status(201).json({ message: "Post liked" })

}


export const deleteLikeController = async (req: Request, res: Response) => {

    const post_id = req.params?.post_id || null;
    const user_id = req.user.id || null;

    await deleteLikeService(user_id, post_id as (string | null));
    return res.status(200).json({ message: "Post Unliked success" })
}