"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserService = exports.getUsersService = exports.getCurrentUserProfile = exports.getUserById = exports.deleteUserService = exports.changeAvatarService = exports.changePasswordService = exports.changeEmailService = exports.uploadUserAvatarService = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const ForbidenError_1 = require("../shared/errors/ForbidenError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const ServerError_1 = require("../shared/errors/ServerError");
const UnauthorizedError_1 = require("../shared/errors/UnauthorizedError");
const argon_service_1 = require("../shared/services/argon.service");
const cloudinary_service_1 = require("../shared/services/cloudinary.service");
const uploadUserAvatarService = async (user_id, picture) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!picture)
        throw new BadRequestError_1.BadRequestError("Profile picture is required");
    if (!user || !user_id)
        throw new NotFoundError_1.NotFoundError("User not found");
    const picture_url = await (0, cloudinary_service_1.uploadToCloudinary)(picture, `users/${user_id}/profile_pictures`);
    if (!picture_url)
        throw new ServerError_1.ServerError("Failed to upload profile picture");
    await db_1.default.user.update({
        where: {
            id: user_id
        },
        data: {
            avatar_url: picture_url
        }
    });
};
exports.uploadUserAvatarService = uploadUserAvatarService;
const changeEmailService = async (user_id, new_email) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!user)
        throw new NotFoundError_1.NotFoundError("User not found");
    const emailIsUsed = await db_1.default.user.findUnique({
        where: { email: new_email },
        select: {
            id: true
        }
    });
    if (emailIsUsed)
        throw new BadRequestError_1.BadRequestError("Email is used");
    await db_1.default.user.update({
        where: {
            id: user_id
        },
        data: {
            email: new_email
        }
    });
};
exports.changeEmailService = changeEmailService;
const changePasswordService = async (user_id, current_password, new_password) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!user)
        throw new NotFoundError_1.NotFoundError("User not found");
    const isPasswordValid = await (0, argon_service_1.verify)(current_password, user.password);
    if (!isPasswordValid)
        throw new BadRequestError_1.BadRequestError("Current password is incorrect");
    const hashedNewPassword = await (0, argon_service_1.hash)(new_password);
    await db_1.default.user.update({
        where: {
            id: user_id
        },
        data: {
            password: hashedNewPassword
        }
    });
};
exports.changePasswordService = changePasswordService;
const changeAvatarService = async (user_id, file) => {
    if (!file)
        throw new BadRequestError_1.BadRequestError("Profile picture is required");
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!user)
        throw new NotFoundError_1.NotFoundError("User not found");
    if (user.avatar_url) {
        await (0, cloudinary_service_1.deleteFromCloudinary)((0, cloudinary_service_1.getPublicId)(user.avatar_url));
    }
    const avatar_url = await (0, cloudinary_service_1.uploadToCloudinary)(file, `users/${user_id}/profile_pictures`);
    await db_1.default.user.update({
        where: {
            id: user_id
        },
        data: {
            avatar_url
        }
    });
};
exports.changeAvatarService = changeAvatarService;
const deleteUserService = async (user_id) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        }
    });
    if (!user)
        throw new NotFoundError_1.NotFoundError("User not found");
    if (user.avatar_url) {
        await (0, cloudinary_service_1.deleteFromCloudinary)((0, cloudinary_service_1.getPublicId)(user.avatar_url));
    }
    await db_1.default.user.delete({
        where: {
            id: user_id
        }
    });
};
exports.deleteUserService = deleteUserService;
const getUserById = async (user_id, current_user_id) => {
    if (user_id === current_user_id)
        throw new ForbidenError_1.ForbiddenError("Can not get your profile");
    const user = await db_1.default.user.findUnique({
        where: {
            id: user_id
        },
        include: {
            student_profile: true,
            teacher_profile: true,
            admin_profile: true,
            _count: {
                select: {
                    bookmarks: true,
                    posts: true
                }
            }
        }
    });
    const connection_status = await db_1.default.connection.findFirst({
        where: {
            OR: [
                { receiver_id: user_id, sender_id: current_user_id },
                { receiver_id: current_user_id, sender_id: user_id },
            ]
        },
        select: {
            status: true
        }
    });
    if (!user)
        throw new NotFoundError_1.NotFoundError("User not found");
    const connections_count = await db_1.default.connection.count({
        where: {
            OR: [
                { status: "ACCEPTED", sender_id: user_id },
                { status: "ACCEPTED", receiver_id: user_id }
            ]
        }
    });
    return { ...user, _count: { ...user._count, connections: connections_count }, connection_status: connection_status?.status || null };
};
exports.getUserById = getUserById;
const getCurrentUserProfile = async (user_id) => {
    console.log("this is user profile route");
    const profile = await db_1.default.user.findUnique({
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
    });
    const connections_count = await db_1.default.connection.count({
        where: {
            OR: [
                { status: "ACCEPTED", sender_id: user_id },
                { status: "ACCEPTED", receiver_id: user_id }
            ]
        }
    });
    if (!profile)
        throw new UnauthorizedError_1.UnauthorizedError("User is not logged in");
    return { ...profile, _count: { ...profile._count, connections: connections_count } };
};
exports.getCurrentUserProfile = getCurrentUserProfile;
const getUsersService = async (query, user_id) => {
    const limit = 20;
    const page = query?.page || 1;
    const users = await db_1.default.user.findMany({
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
    if (has_more)
        users.pop();
    return {
        users,
        page,
        has_more,
    };
};
exports.getUsersService = getUsersService;
const updateUserService = async (data, user_id) => {
    const user = await db_1.default.user.findUnique({ where: { id: user_id } });
    if (!user)
        throw new ForbidenError_1.ForbiddenError("Can not update the profile");
    await db_1.default.user.update({
        where: {
            id: user_id,
        },
        data: {
            first_name: data.first_name ? data.first_name : undefined,
            last_name: data.last_name ? data.last_name : undefined,
            bio: data.bio ? data.bio : undefined
        }
    });
};
exports.updateUserService = updateUserService;
