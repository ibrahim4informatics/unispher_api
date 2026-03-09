import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { deleteFromCloudinary, getPublicId, uploadToCloudinary } from "../shared/services/cloudinary.service";
import { GetPostsQueryDto, type CreatePostDto } from "./posts.dtos";


const createPostService = async (author_id: string, data: CreatePostDto, file: Express.Multer.File[]) => {

    const post = await db.post.create({
        data: {
            author_id,
            content: data.content,
            type: data.type,
        }
    });

    //upload files if exist
    if (file && file.length > 0) {

        const uploadPromises = file.map((f) => (
            uploadToCloudinary(f, `posts/${post.id}/attachments`)
        ));

        const attachments = await Promise.all(uploadPromises);

        const data = attachments.map((url) => {

            const mediaType = url.split('.').pop()?.toLowerCase();
            let type: "IMAGE" | "VIDEO" | "OTHER" = "OTHER";
            if (mediaType) {
                if (["jpg", "jpeg", "png", "gif"].includes(mediaType)) {
                    type = "IMAGE";
                } else if (["mp4", "avi", "mov"].includes(mediaType)) {
                    type = "VIDEO";
                }
            }
            return {
                post_id: post.id,
                url,
                type
            }
        });

        await db.postMedia.createMany({
            data
        });

        return post;


    }
}


const deletePostBydIdService = async (user_id?: string, post_id?: number) => {
    if (!post_id || !user_id) throw new BadRequestError("Can not delete post")
    const post = await db.post.findUnique({ where: { id: post_id }, include: { postMedias: true } });
    if (!post) throw new NotFoundError("Post can not be found");
    if (post.author_id !== user_id) throw new ForbiddenError("Post can not be deleted")

    if (post.postMedias.length > 0) {

        const deleteMediasPromises = post.postMedias.map(m => {
            const public_id = getPublicId(m.url);
            return deleteFromCloudinary(public_id);
        })
        await Promise.all(deleteMediasPromises);
    }
    await db.post.delete({
        where: {
            id: post_id
        }
    })
}

// get posts based on user
const getPostsService = async (query: GetPostsQueryDto) => {

    const page = query.page || 1;

    const posts = await db.post.findMany({
        take: 20,
        skip: (page - 1) * 20,

        orderBy: {
            created_at: "desc"
        },
        include: {
            postMedias: true,
            author: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                    booksmarks: true
                }
            }
        }
    }
    );

    return posts;


}

const getPostByIdService = async (post_id: number) => {

    const post = await db.post.findUnique({
        where: { id: post_id }, include: {
            postMedias: true,
            author: true,
        }
    });

    if (!post) throw new NotFoundError("post can not be found");
    return post;

}
export { createPostService, deletePostBydIdService, getPostByIdService, getPostsService };
