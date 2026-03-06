import { StudentProfile } from "@prisma/client";
import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { CreateStudentProfileDto } from "./student.dto";
import { uploadToCloudinary } from "../shared/services/cloudinary.service";
import { ServerError } from "../shared/errors/ServerError";

/**
 * Creates a student profile after validating the hierarchical relationship of academic entities.
 * 
 * @param createStudentProfileDto - The data transfer object containing:
 *   - university_id: The ID of the university
 *   - faculty_id: The ID of the faculty (must belong to the specified university)
 *   - department_id: The ID of the department (must belong to the specified faculty)
 *   - field_id: The ID of the field (must belong to the specified department)
 *   - level_id: The ID of the level (must belong to the specified field)
 *   - user_id: The ID of the user associated with this profile
 * 
 * @returns {Promise<StudentProfile>} The created student profile object
 * 
 * @throws {NotFoundError} If any of the referenced entities (university, faculty, department, field, or level) 
 *                         are not found or do not maintain the correct hierarchical relationship
 * 
 * @example
 * const studentProfile = await createStudentProfile({
 *   university_id: 'uni_123',
 *   faculty_id: 'fac_456',
 *   department_id: 'dep_789',
 *   field_id: 'fld_012',
 *   level_id: 'lvl_345',
 *   user_id: 'usr_678'
 * });
 */
const createStudentProfile = async (createStudentProfileDto: CreateStudentProfileDto): Promise<StudentProfile> => {

    const user_exists = await db.user.findUnique({
        where: {
            id: createStudentProfileDto.user_id
        },
        include: {
            student_profile: true
        }
    });

    if (!user_exists) throw new NotFoundError("User not found");
    if (user_exists.student_profile) throw new BadRequestError("User already has a student profile");

    const university = await db.university.findUnique({
        where: {
            id: createStudentProfileDto.university_id
        }
    });

    if (!university) throw new NotFoundError("University not found");

    const faculty = await db.faculty.findUnique({
        where: {
            id: createStudentProfileDto.faculty_id
        }
    });

    if (!faculty || faculty.university_id !== createStudentProfileDto.university_id) throw new NotFoundError("Faculty not found");
    const department = await db.department.findUnique({
        where: {
            id: createStudentProfileDto.department_id
        }
    });

    if (!department || department.faculty_id !== createStudentProfileDto.faculty_id) throw new NotFoundError("Department not found");

    const field = await db.field.findUnique({
        where: {
            id: createStudentProfileDto.field_id
        }
    });

    if (!field || field.department_id !== createStudentProfileDto.department_id) throw new NotFoundError("Field not found");

    const level = await db.level.findUnique({
        where: {
            id: createStudentProfileDto.level_id
        }
    });



    if (!level || level.field_id !== createStudentProfileDto.field_id) throw new NotFoundError("Level not found");

    const studentProfile = await db.studentProfile.create({
        data: {
            univeristy_id: createStudentProfileDto.university_id,
            faculty_id: createStudentProfileDto.faculty_id,
            department_id: createStudentProfileDto.department_id,
            field_id: createStudentProfileDto.field_id,
            level_id: createStudentProfileDto.level_id,
            user_id: createStudentProfileDto.user_id,
        }
    });


    return studentProfile;

}





export {
    createStudentProfile,
}