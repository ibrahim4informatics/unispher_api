import { Request, Response } from "express";
import { createBookmark, deleteBookmark, getUserBookmarks } from "./bookmarks.service";


export const createBookmarkController = async (req: Request, res: Response) => {

    const user_id = req.user.id;
    const post_id = req.params.post_id;

    await createBookmark(post_id as string, user_id);
    return res.status(201).json({ message: "Bookmark created" })
}

export const deleteBookmarkController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;
    await deleteBookmark(post_id as string, user_id);
    return res.status(200).json({ message: "Bookmark deleted" })
}


export const getUserBookmarksController = async (req:Request, res:Response)=>{

    const user_id = req.user.id;
    const bookmarks = await getUserBookmarks(user_id);

    return res.status(200).json({bookmarks})

}