"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentAcademicProfileService = exports.updateStudentProfileService = exports.createStudentProfile = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const NotFoundError_1 = require("../shared/errors/NotFoundError");
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
const createStudentProfile = async (createStudentProfileDto) => {
    const user_exists = await db_1.default.user.findUnique({
        where: {
            id: createStudentProfileDto.user_id
        },
        include: {
            student_profile: true
        }
    });
    if (!user_exists)
        throw new NotFoundError_1.NotFoundError("User not found");
    if (user_exists.student_profile)
        throw new BadRequestError_1.BadRequestError("User already has a student profile");
    const university = await db_1.default.university.findUnique({
        where: {
            id: createStudentProfileDto.university_id
        }
    });
    if (!university)
        throw new NotFoundError_1.NotFoundError("University not found");
    const faculty = await db_1.default.faculty.findUnique({
        where: {
            id: createStudentProfileDto.faculty_id
        }
    });
    if (!faculty || faculty.university_id !== createStudentProfileDto.university_id)
        throw new NotFoundError_1.NotFoundError("Faculty not found");
    const department = await db_1.default.department.findUnique({
        where: {
            id: createStudentProfileDto.department_id
        }
    });
    if (!department || department.faculty_id !== createStudentProfileDto.faculty_id)
        throw new NotFoundError_1.NotFoundError("Department not found");
    const field = await db_1.default.field.findUnique({
        where: {
            id: createStudentProfileDto.field_id
        }
    });
    if (!field || field.department_id !== createStudentProfileDto.department_id)
        throw new NotFoundError_1.NotFoundError("Field not found");
    const level = await db_1.default.level.findUnique({
        where: {
            id: createStudentProfileDto.level_id
        }
    });
    if (!level || level.field_id !== createStudentProfileDto.field_id)
        throw new NotFoundError_1.NotFoundError("Level not found");
    const studentProfile = await db_1.default.studentProfile.create({
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
};
exports.createStudentProfile = createStudentProfile;
const updateStudentProfileService = async (updateStudentProfileDto, user_id) => {
    const profile = await db_1.default.studentProfile.findUnique({
        where: {
            user_id
        }
    });
    if (!profile)
        throw new BadRequestError_1.BadRequestError("Invalid user");
    await db_1.default.studentProfile.update({
        where: {
            user_id
        },
        data: {
            univeristy_id: updateStudentProfileDto.university_id,
            faculty_id: updateStudentProfileDto.faculty_id,
            department_id: updateStudentProfileDto.department_id,
            level_id: updateStudentProfileDto.level_id,
            field_id: updateStudentProfileDto.field_id
        }
    });
};
exports.updateStudentProfileService = updateStudentProfileService;
const getStudentAcademicProfileService = async (user_id) => {
    const profile = await db_1.default.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            univeristy_id: true,
            field_id: true,
            department_id: true,
            faculty_id: true,
            level_id: true
        }
    });
    if (!profile)
        throw new BadRequestError_1.BadRequestError("Invalid user id");
    return profile;
};
exports.getStudentAcademicProfileService = getStudentAcademicProfileService;
