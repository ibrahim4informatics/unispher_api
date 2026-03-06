import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { ServerError } from "../shared/errors/ServerError";
import { uploadToCloudinary } from "../shared/services/cloudinary.service";

const uploadUserAvatarService = async (user_id?: string, picture?: Express.Multer.File) => {

    const user = await db.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!picture) throw new BadRequestError("Profile picture is required");
    if (!user || !user_id) throw new NotFoundError("User not found");

    const picture_url = await uploadToCloudinary(picture, `users/${user_id}/profile_pictures`);
    if (!picture_url) throw new ServerError("Failed to upload profile picture");
    await db.user.update({
        where: {
            id: user_id
        },
        data: {
            avatar_url: picture_url
        }
    });
}

export {
    uploadUserAvatarService
}