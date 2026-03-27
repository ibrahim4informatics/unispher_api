import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { ServerError } from "../shared/errors/ServerError";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { verify, hash } from "../shared/services/argon.service";
import { deleteFromCloudinary, getPublicId, uploadToCloudinary } from "../shared/services/cloudinary.service";
import { type UpdateUserDto } from "./user.dto";

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

    const emailIsUsed = await db.user.findUnique({
        where: { email: new_email },
        select: {
            id: true
        }
    });

    if (emailIsUsed) throw new BadRequestError("Email is used");

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

const getUserById = async (user_id: string, current_user_id: string) => {

    if (user_id === current_user_id) throw new ForbiddenError("Can not get your profile")
    const user = await db.user.findUnique({
        where: {
            id: user_id
        },
        include: {
            student_profile: {
                include: {
                    university: true,
                    field: true
                }
            },
            teacher_profile: {
                include: {
                    university: true,
                }
            },
            admin_profile: true,
            _count: {
                select: {
                    bookmarks: true,
                    posts: true
                }
            }
        }
    });

    const connection_status = await db.connection.findFirst({
        where: {
            OR: [
                { receiver_id: user_id, sender_id: current_user_id },
                { receiver_id: current_user_id, sender_id: user_id },
            ]
        },
        select: {
            status: true
        }
    })

    if (!user) throw new NotFoundError("User not found");



    const connections_count = await db.connection.count({
        where: {
            OR: [
                { status: "ACCEPTED", sender_id: user_id },
                { status: "ACCEPTED", receiver_id: user_id }
            ]
        }
    });

    return { ...user, _count: { ...user._count, connections: connections_count }, connection_status: connection_status?.status || null };
}

const getCurrentUserProfile = async (user_id: string) => {
    console.log("this is user profile route")

    const profile = await db.user.findUnique({
        where: {
            id: user_id
        },

        select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar_url: true,
            role: true,
            bio: true,
            _count: {
                select: {
                    bookmarks: true,
                    posts: true,

                }
            }
        }
    })

    const connections_count = await db.connection.count({
        where: {
            OR: [
                { status: "ACCEPTED", sender_id: user_id },
                { status: "ACCEPTED", receiver_id: user_id }
            ]
        }
    });
    if (!profile) throw new UnauthorizedError("User is not logged in");
    return { ...profile, _count: { ...profile._count, connections: connections_count } };

}


const getUsersService = async (
    query: { page?: number; name?: string; role?: "STUDENT" | "TEACHER" },
    user_id: string
) => {

    const limit = 20;
    const page = query?.page || 1;
    const users = await db.user.findMany({
        where: {
            id: { not: user_id },

            OR: query?.name ? [
                {
                    first_name: {
                        contains: query.name
                    }

                },
                {
                    last_name: {
                        contains: query.name
                    }
                }
            ] : undefined,
            role: query?.role || undefined,
        },

        include: {
            student_profile: {
                include: {
                    university: true,
                    field: true,
                },
            },
            teacher_profile: {
                include: {
                    university: true,
                },
            },
        },

        orderBy: {
            created_at: "desc",
        },

        take: limit + 1,
        skip: (page - 1) * limit,
    });

    const has_more = users.length > limit;
    if (has_more) users.pop();

    return {
        users,
        page,
        has_more,
    };
};


const updateUserService = async (data: UpdateUserDto, user_id: string) => {
    const user = await db.user.findUnique({ where: { id: user_id } });
    if (!user) throw new ForbiddenError("Can not update the profile");

    await db.user.update({
        where: {
            id: user_id,
        },
        data: {
            first_name: data.first_name ? data.first_name : undefined,
            last_name: data.last_name ? data.last_name : undefined,
            bio: data.bio ? data.bio : undefined
        }
    });
}

export {
    uploadUserAvatarService,
    changeEmailService,
    changePasswordService,
    changeAvatarService,
    deleteUserService,
    getUserById,
    getCurrentUserProfile,
    getUsersService,
    updateUserService

}