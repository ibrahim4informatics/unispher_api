import db from "../config/db";
import { createNotification } from "../notfications/notifications.service";
import { getPostByIdService } from "../posts/posts.service";
import { BadRequestError } from "../shared/errors/BadRequestError"
import { NotFoundError } from "../shared/errors/NotFoundError";

export const createLikeService = async (user_id: string, post_id: string | null) => {

    if (!post_id) throw new BadRequestError("post_id is required");

    const post = await getPostByIdService(parseInt(post_id));
    if (!post) throw new NotFoundError("Can not find post");

    const isAlreadyLiked = await db.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
            }
        }
    });

    if (isAlreadyLiked) throw new BadRequestError("Post already liked");

    const { user: liker } = await db.like.create({
        data: {
            user_id,
            post_id: parseInt(post_id),
        },
        include: {
            user: true
        }
    });

    await createNotification({
        actor_id: liker.id,
        body: `${liker.first_name} ${liker.last_name} liked your post.`,
        title: "Someone Liked your post",
        entity_id: post.id,
        is_read: false,
        type: "LIKE_POST"
    }, [post.author_id])
}

export const deleteLikeService = async (user_id: string, post_id: string | null) => {
    if (!post_id) throw new BadRequestError("Post id is required")
    const like = await db.like.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
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