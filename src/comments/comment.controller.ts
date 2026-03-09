import { Request, Response } from "express";
import { type UpdateCommentDto, type CreateCommentDto } from "./comments.dto";
import { createComment, deleteComment, getCommentsOfPost, updateComment } from "./comment.service";


export const createCommentController = async (req: Request, res: Response) => {

    const data: CreateCommentDto = req.body;
    const user_id = req.user?.id || null;

    const comment = await createComment(data, user_id);

    return res.status(201).json({ comment });
}

export const updateCommentController = async (req: Request, res: Response) => {
    const data: UpdateCommentDto = req.body;
    const comment_id = req.params.comment_id ? parseInt(req.params.comment_id as string) : null;
    const user_id = req.user?.id || null;
    await updateComment(comment_id, user_id, data);
    return res.status(200).json({ message: "Comment updated" })
}



export const deleteCommentController = async (req: Request, res: Response) => {
    const comment_id = req.params.comment_id && parseInt(req.params.comment_id as string) || null;
    const user_id = req.user?.id || null
    await deleteComment(comment_id, user_id);
    return res.status(200).json({ message: "Comment deleted successfully" });
}

export const getPostCommentsController = async (req: Request, res: Response) => {
    const post_id = req.params.post_id && (parseInt(req.params.post_id as string)) || null;
    const comments = await getCommentsOfPost(post_id);

    return res.status(200).json({ comments })
}