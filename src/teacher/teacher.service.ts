import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { UpdateTeacherProfileDto, type CreateTeacherProfileDto } from "./teacher.dto";

const createTeacherProfileService = async (data: CreateTeacherProfileDto) => {

    const user = await db.user.findUnique({
        where: {
            id: data.user_id
        },
        include: {
            teacher_profile: true
        }
    });

    if (!user || user.role !== "TEACHER") throw new NotFoundError("User not found");
    if (user.teacher_profile) throw new BadRequestError("Teacher profile already exists");

    const profile = await db.teacherProfile.create({
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
}


const getTeacherProfileService = async (teacher_id: string) => {
    const profile = await db.teacherProfile.findUnique({
        where: {
            user_id: teacher_id
        }
    });
    if (!profile) throw new NotFoundError("Teacher profile not found");
    return profile;
}

const updateTeacherProfileService = async (teacher_id: string, data: UpdateTeacherProfileDto) => {
    const profile = await db.teacherProfile.findUnique({
        where: {
            user_id: teacher_id
        }
    });
    if (!profile) throw new NotFoundError("Teacher profile not found");

    await db.teacherProfile.update({
        where: {
            user_id: teacher_id
        },
        data: {
            univeristy_id: data.university_id || profile.univeristy_id,
            phone_number: data.phone_number || profile.phone_number,
            university_of_study: data.university_of_study || profile.university_of_study,
            field_of_study: data.field_of_study || profile.field_of_study,
            specialization: data.specialization || profile.specialization,
            academic_title: data.academic_title || profile.academic_title,
        }
    });

}


export { createTeacherProfileService, getTeacherProfileService, updateTeacherProfileService };