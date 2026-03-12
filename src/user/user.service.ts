import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { ServerError } from "../shared/errors/ServerError";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { verify, hash } from "../shared/services/argon.service";
import { deleteFromCloudinary, getPublicId, uploadToCloudinary } from "../shared/services/cloudinary.service";

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


const changeEmailService = async (user_id: string, new_email: string) => {

    const user = await db.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) throw new NotFoundError("User not found");

    await db.user.update({
        where: {
            id: user_id
        },
        data: {
            email: new_email
        }
    });
}

const changePasswordService = async (user_id: string, current_password: string, new_password: string) => {

    const user = await db.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) throw new NotFoundError("User not found");

    const isPasswordValid = await verify(current_password, user.password);
    if (!isPasswordValid) throw new BadRequestError("Current password is incorrect");

    const hashedNewPassword = await hash(new_password);
    await db.user.update({
        where: {
            id: user_id
        },
        data: {
            password: hashedNewPassword
        }
    });

}

const changeAvatarService = async (user_id?: string, file?: Express.Multer.File) => {

    if (!file) throw new BadRequestError("Profile picture is required");

    const user = await db.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) throw new NotFoundError("User not found");

    if (user.avatar_url) {
        await deleteFromCloudinary(getPublicId(user.avatar_url));
    }

    const avatar_url = await uploadToCloudinary(file, `users/${user_id}/profile_pictures`);

    await db.user.update({
        where: {
            id: user_id
        },
        data: {
            avatar_url
        }
    });
}


const deleteUserService = async (user_id: string) => {

    const user = await db.user.findUnique({
        where: {
            id: user_id
        }
    });

    if (!user) throw new NotFoundError("User not found");

    if (user.avatar_url) {
        await deleteFromCloudinary(getPublicId(user.avatar_url));
    }

    await db.user.delete({
        where: {
            id: user_id
        }
    });
}

const getUserById = async (user_id: string) => {

    const user = await db.user.findUnique({
        where: {
            id: user_id
        },
        include: {
            student_profile: true,
            teacher_profile: true,
            admin_profile: true
        }
    });

    return user;
}

const getCurrentUserProfile = (user_id:string)=>{
    console.log("this is user profile route")

    const profile = getUserById(user_id);
    if(!profile) throw new UnauthorizedError("User is not logged in");
    return profile;

}

export {
    uploadUserAvatarService,
    changeEmailService,
    changePasswordService,
    changeAvatarService,
    deleteUserService,
    getUserById,
    getCurrentUserProfile

}