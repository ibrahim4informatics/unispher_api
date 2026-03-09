import db from "../config/db";
import { getPostByIdService } from "../posts/posts.service";
import { BadRequestError } from "../shared/errors/BadRequestError"
import { NotFoundError } from "../shared/errors/NotFoundError";

export const createLikeService = async (user_id: string, post_id: number) => {

    if (!post_id) throw new BadRequestError("post_id is required");

    const post = await getPostByIdService(post_id);
    if (!post) throw new NotFoundError("Can not find post");

    const isAlreadyLiked = await db.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id
            }
        }
    });

    if (isAlreadyLiked) throw new BadRequestError("Post already liked");

    await db.like.create({
        data: {
            user_id,
            post_id
        }
    });
}

export const deleteLikeService = async (user_id: string, post_id: number) => {
    const like = await db.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id
            }
        }
    });

    if (!like) throw new NotFoundError("Like can not be found");

    await db.like.delete({
        where: {
            id: like.id
        }
    })
}