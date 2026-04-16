import db from "../config/db";
import { NotFoundError } from "../shared/errors/NotFoundError";

export const enrollStudentService = async (user_id: string, course_id: string) => {

    const student = await db.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!student) throw new NotFoundError("Student profile not found");
    const existing = await db.courseEnrollment.findFirst({
        where: { student_id: student.id, course_id }
    });

    if (existing) throw new Error("Already enrolled");

    const course = await db.course.findUnique({
        where: { id: course_id }
    });

    if (!course || course.status !== "ACCEPTED") throw new NotFoundError("Course not found");

    const enrollment = await db.courseEnrollment.create({
        data: {
            student_id: student.id,
            course_id
        }
    });

    return enrollment;
};


export const unenrollStudentService = async (user_id: string, course_id: string) => {
    const student = await db.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!student) throw new NotFoundError("Student profile not found");

    const enrollment = await db.courseEnrollment.findFirst({
        where: {
            student_id: student.id,
            course_id
        }
    });

    if (!enrollment) throw new NotFoundError("Enrollment not found");

    await db.courseEnrollment.delete({
        where: { id: enrollment.id }
    });
}

export const getEnrolledCoursesService = async (user_id: string, page: number = 1) => {
    const limitPerPage = 20;
    const student = await db.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });
    if (!student) throw new NotFoundError("Student profile not found");
    const enrollments = await db.courseEnrollment.findMany({
        where: {
            student_id: student.id
        },
        include: {
            course: {
                include: {
                    _count: {
                        select: {
                            courseSections: true
                        }
                    }
                }
            }
        },
        take: limitPerPage + 1,
        skip: (page - 1) * limitPerPage,
        orderBy: {
            updated_at: "desc"
        }
    });
    const has_more = enrollments.length > limitPerPage;
    if (has_more) enrollments.pop();
    return { courses: enrollments.map(e => ({ ...e.course })), has_more, page };
};


export const getStudentEnrollmentService = async (user_id: string, course_id: string) => {
    const student = await db.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });
    if (!student) throw new NotFoundError("Student profile not found");
    const enrollment = await db.courseEnrollment.findFirst({
        where: {
            student_id: student.id,
            course_id
        }
    });
    if (!enrollment) throw new NotFoundError("Enrollment not found");
    return enrollment;
}


export const getStudentsEnrolledByCourseId = async (user_id: string, course_id: string, page: number = 1) => {
    const limit = 30;
    const teacher = await db.teacherProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!teacher) throw new NotFoundError("Teacher profile not found");

    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to view enrollments of this course");

    const enrollments = await db.courseEnrollment.findMany({
        where: { course_id },
        include: {
            student: { select: { user: { select: { first_name: true, last_name: true, avatar_url: true, id: true } } } }
        },
        take: limit + 1,
        skip: (page - 1) * limit
    });
    const has_more = enrollments.length > limit;
    if (has_more) enrollments.pop();
    return { students: enrollments.map(e => ({ ...e.student.user, student_id: e.student_id })), has_more, page };
}


export const deleteEnrollmentService = async (user_id: string, course_id: string, student_id: number) => {


    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to delete enrollments of this course");

    const enrollment = await db.courseEnrollment.findFirst({
        where: { course_id, student_id }
    });

    if (!enrollment) throw new NotFoundError("Enrollment not found");

    await db.courseEnrollment.delete({
        where: { id: enrollment.id }
    });
}