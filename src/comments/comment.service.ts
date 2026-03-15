import db from "../config/db";
import { createNotification } from "../notfications/notifications.service";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { type CreateCommentDto, type UpdateCommentDto } from "./comments.dto";

export const createComment = async (data: CreateCommentDto, user_id: string) => {

    if (!user_id) throw new UnauthorizedError("Can not create comment");
    const post = await db.post.findUnique({
        where: { id: data.post_id },
        select: {
            id: true,
            author_id: true
        }
    },
    );

    if (!post) throw new NotFoundError("Post does not exists");

    const comment = await db.comment.create({
        data: {
            ...data,
            author_id: user_id
        },
        include: {
            author: true
        }
    });

    const truncatedContent =
        comment.content.length > 25
            ? comment.content.slice(0, 25) + "…"
            : comment.content;
    await createNotification(
        {

            type: "COMMENT_POST",
            actor_id: user_id,
            entity_id: post.id,
            is_read: false,
            body: `${comment.author.first_name} ${comment.author.last_name} commented on your post: "${truncatedContent}"`,
            title: "You have a new comment on your post"

        },
        [post.author_id]
    )
    return comment;
}


export const updateComment = async (comment_id: number | null, user_id: string, data: UpdateCommentDto) => {
    if (!comment_id) throw new BadRequestError("Comment id is required")
    const comment = await db.comment.findUnique({ where: { id: comment_id } });
    if (!comment) throw new NotFoundError("Comment does not exist");
    if (!user_id || comment.author_id !== user_id) throw new UnauthorizedError("Can not update comment");
    await db.comment.update({
        where: {
            id: comment.id
        },
        data: {
            content: data.content
        }
    });
}


export const deleteComment = async (comment_id: number | null, user_id: string) => {
    if (!comment_id) throw new BadRequestError("No comment selected");
    const comment = await db.comment.findUnique({ where: { id: comment_id } });
    if (!comment) throw new NotFoundError("Comment does not exist");

    if (!user_id || comment.author_id !== user_id) throw new UnauthorizedError("Can not delete this comment");

    await db.comment.delete({ where: { id: comment.id } });
}


export const getCommentsOfPost = async (post_id: number | null) => {
    if (!post_id) throw new BadRequestError("Post id is required");
    const post = await db.post.findUnique({ where: { id: post_id } });
    if (!post) throw new NotFoundError("Post does not exist")
    const comments = await db.comment.findMany({ where: { post_id }, include: { author: true }, orderBy: { created_at: "desc" } });
    return comments;
}
