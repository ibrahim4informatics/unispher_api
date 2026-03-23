"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacherProfileService = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const createTeacherProfileService = async (data) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: data.user_id
        },
        include: {
            teacher_profile: true
        }
    });
    if (!user || user.role !== "TEACHER")
        throw new NotFoundError_1.NotFoundError("User not found");
    if (user.teacher_profile)
        throw new BadRequestError_1.BadRequestError("Teacher profile already exists");
    const profile = await db_1.default.teacherProfile.create({
        data: {
            phone_number: data.phone_number,
            university_of_study: data.university_of_study,
            field_of_study: data.field_of_study,
            specialization: data.specialization,
            academic_title: data.academic_title,
            univeristy_id: data.university_id,
            user_id: data.user_id
        }
    });
    return profile;
};
exports.createTeacherProfileService = createTeacherProfileService;
