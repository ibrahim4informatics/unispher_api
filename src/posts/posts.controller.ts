import { Request, Response } from "express";
import { createPostService, deletePostBydIdService, getPostByIdService, getPostsService } from "./posts.service";
import { GetPostsQueryDto } from "./posts.dtos";


export const createPostController = async (req: Request, res: Response) => {
    const body = req.body;
    const files = req.files as Express.Multer.File[] || [];
    const author_id = req.user?.id || "";
    await createPostService(author_id, body, files);
    return res.status(201).json({ message: "Post created successfully" });
}

export const deletePostController = async (req: Request, res: Response) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id
    await deletePostBydIdService(user_id, parseInt(post_id as string));
    return res.status(200).json({ message: "Post deleted successfully" })
}

export const getPostsController = async (req: Request, res: Response) => {
    const query: GetPostsQueryDto = req.query;
    const user_id = req.user.id;
    const posts = await getPostsService(query, user_id);
    return res.status(200).json({ posts });
}

export const getPostByIdController = async (req: Request, res: Response) => {
    const post_id = req.params.post_id as string;
    const user_id = req.user.id
    const post = await getPostByIdService(parseInt(post_id), user_id);

    return res.status(200).json({
        post
    })

}

