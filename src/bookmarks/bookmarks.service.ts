import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError"
import { NotFoundError } from "../shared/errors/NotFoundError";

export const createBookmark = async (post_id: string, user_id: string) => {

    if (!post_id) throw new BadRequestError("Post id is required");

    const bookmarkExists = await db.bookmark.findUnique({
        where: {
            user_id_post_id: {
                user_id,
                post_id: parseInt(post_id)
            }
        }
    });

    if (bookmarkExists) throw new BadRequestError("Bookmark exists");

    await db.bookmark.create({
        data: {
            post_id: parseInt(post_id),
            user_id
        }
    });
}



export const deleteBookmark = async (post_id: string, user_id: string) => {

    if (!post_id) throw new BadRequestError("Post id is required");

    const bookmark = await db.bookmark.findUnique({
        where: {
            user_id_post_id: {
                post_id: parseInt(post_id),
                user_id
            }
        }
    });

    if (!bookmark) throw new NotFoundError("Bookmark is not found");

    await db.bookmark.delete({
        where: {
            id: bookmark.id
        }
    });
}


export const getUserBookmarks = (user_id: string) => {
    const userBookmarks = db.bookmark.findMany({
        where: {
            user_id
        },
        include: {
            post: true
        }
    });

    return userBookmarks
}