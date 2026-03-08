import db from "../config/db";
import { uploadToCloudinary } from "../shared/services/cloudinary.service";
import { type CreatePostDto } from "./posts.dtos";


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





export { createPostService };