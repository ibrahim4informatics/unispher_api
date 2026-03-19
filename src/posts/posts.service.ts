import { file } from "zod";
import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { deleteFromCloudinary, getPublicId, uploadToCloudinary } from "../shared/services/cloudinary.service";
import { GetPostsQueryDto, type CreatePostDto } from "./posts.dtos";
import { getUserConnectionsIds } from "../connections/connections.service";
import { createNotification } from "../notfications/notifications.service";


const createPostService = async (author_id: string, data: CreatePostDto, file: Express.Multer.File[]) => {

    // console.log(file)

    const post = await db.post.create({
        data: {
            author_id,
            content: data.content,
            type: data.type,
        },
        include: {
            author: true
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


        const connectedUsersIds = await getUserConnectionsIds(author_id);
        if (connectedUsersIds.length > 0) {
            createNotification({
                type: "PUBLISHED_POST",
                actor_id: author_id,
                entity_id: post.id,
                is_read: false,
                title: "New post added",
                body: `${post.author.first_name} ${post.author.last_name} published new post`
            }, connectedUsersIds)
        }

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
const getPostsService = async (query: GetPostsQueryDto, user_id: string) => {

    const page = query.page || 1;

    const posts = await db.post.findMany({
        take: 20,
        skip: (page - 1) * 20,

        orderBy: {
            created_at: "desc"
        },
        include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {
                select: {
                    user_id: true
                }
            }
            ,
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

    const returnedPosts = posts.map(({ likes, booksmarks, ...post }) => {

        const is_liked = likes.filter(l => l.user_id === user_id).length;
        const is_booked = booksmarks.filter(b => b.user_id === user_id).length;


        return {
            ...post, is_liked: is_liked > 0 ? true : false,
            is_booked: is_booked > 0 ? true : false
        }
    })

    return returnedPosts;


}

const getPostByIdService = async (post_id: number, user_id?: string) => {

    const post = await db.post.findUnique({
        where: { id: post_id }, include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {

                select: {
                    user_id: true
                }

            },

            postMedias: true,
            author: {

                include: {
                    student_profile: {
                        include: {
                            field: true,
                            university: true
                        }
                    },
                    teacher_profile: {
                        include: {
                            university: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    booksmarks: true,
                    likes: true
                }
            }
        }
    });

    if (!post) throw new NotFoundError("post can not be found");


    const is_liked = post.likes.filter(l => l.user_id === user_id).length;
    const is_booked = post.booksmarks.filter(b => b.user_id === user_id).length;
    const { likes, booksmarks, ...postData } = post
    return { ...postData, is_booked: is_booked > 0 ? true : false, is_liked: is_liked > 0 ? true : false };

}

const updatePostByIdService = async (post_id: number, user_id: string, data: CreatePostDto, files: Express.Multer.File[]) => {

    const post = await db.post.findUnique({ where: { id: post_id } });
    if (!post) throw new NotFoundError("Post can not be found");
    if (post.author_id !== user_id) throw new ForbiddenError("Post can not be updated")

    if (files && files.length > 0) {

        const uploadPromises = files.map((f) => (
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
    }

    await db.post.update({
        where: {
            id: post_id
        },
        data
    })

}


const deletePostMediaByIdService = async (post_media_id: number, user_id: string) => {

    const postMedia = await db.postMedia.findUnique({ where: { id: post_media_id }, include: { post: true } });
    if (!postMedia) throw new NotFoundError("Post media can not be found");
    if (postMedia.post.author_id !== user_id) throw new ForbiddenError("Post media can not be deleted");

    const public_id = getPublicId(postMedia.url);
    console.log(public_id);
    const deletep = await deleteFromCloudinary(public_id, postMedia.type === "IMAGE" ? "image" : postMedia.type === "VIDEO" ? "video" : "raw");
    console.log(deletep)
    await db.postMedia.delete({ where: { id: post_media_id } });

}


const getCurrentUserPostsService = async (user_id: string, page: number = 1) => {

    const limite = 20;

    const posts = await db.post.findMany({
        where: {
            author_id: user_id
        },
        take: limite + 1,
        skip: (page - 1) * limite,

        orderBy: {
            created_at: "desc"
        },
        include: {
            likes: {
                select: {
                    user_id: true
                }
            },
            booksmarks: {
                select: {
                    user_id: true
                }
            }
            ,
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

    const has_more = posts.length > limite;
    if (has_more) posts.pop();

    const refactored_posts = posts.map(({ likes, booksmarks, ...post }) => {

        const is_liked = likes.filter(l => l.user_id === user_id).length > 0;
        const is_booked = booksmarks.filter(b => b.user_id === user_id).length > 0;

        return { ...post, is_liked, is_booked }

    });
    return { posts: refactored_posts, page, has_more }
}


export { createPostService, deletePostBydIdService, getPostByIdService, getPostsService, updatePostByIdService, deletePostMediaByIdService, getCurrentUserPostsService };
