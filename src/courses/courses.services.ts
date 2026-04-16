import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { CreateCourseDto, GetCourseQuery } from "./courses.dtos";

export const createCourseService = async (user_id: string, data: CreateCourseDto) => {

    const teacher = await db.teacherProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!teacher) throw new ForbiddenError("Teacher does not exists");

    const module = await db.module.findUnique({
        where: {
            id: data.module_id,
            fields: {
                some: {
                    id: data.field_id
                }
            }
        }
    });

    if (!module) throw new BadRequestError("Module Field Mismatched");

    const newCourse = await db.course.create({
        data: {
            ...data,
            publisher_id: teacher.id,
        }
    });

    return newCourse;
};


export const getCoursesService = async (user_id: string, query: GetCourseQuery) => {
    const limit = 20;
    const page = query.page || 1;

    const student = await db.studentProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!student) throw new ForbiddenError("Student profile not found");


    const courses = await db.course.findMany({
        where: {
            name: query.name ? { contains: query.name } : undefined,
            code: query.code ? { contains: query.code } : undefined,
            module_id: query.module_id ? query.module_id : undefined,
            field_id: query.field_id ? query.field_id : undefined,
            faculty_id: query.faculty_id ? query.faculty_id : undefined,
            status: "ACCEPTED",
        },
        include: {
            courseEnrollments: {
                select: {
                    student_id: true
                }
            },
            faculty: { select: { name: true, id: true, university: { select: { name: true } } } },
            module: {
                select: {
                    name: true,
                    id: true, code: true,
                    levels: { distinct: "name", select: { name: true, id: true } }
                }
            },
            field: {
                select: {
                    name: true, id: true
                }
            },
            publisher: {
                select: {
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            avatar_url: true,
                            id: true
                        }
                    }
                }
            }
        },
        take: limit + 1,
        skip: (page - 1) * limit
    });
    const has_more = courses.length > limit;
    if (has_more) courses.pop();
    return {
        courses: courses.map(({ courseEnrollments, ...course }) => ({ ...course, is_enrolled: courseEnrollments.filter(e => e.student_id === student.id).length > 0 })), page, has_more
    }
}

export const getOwnCoursesService = async (user_id: string, query: GetCourseQuery) => {
    const limit = 20;
    const page = query.page || 1;

    const teacher = await db.teacherProfile.findUnique({ where: { user_id }, select: { id: true } });


    if (!teacher) throw new ForbiddenError("User is not found");

    const courses = await db.course.findMany({
        where: {
            name: query.name ? { contains: query.name } : undefined,
            code: query.code ? { contains: query.code } : undefined,
            module_id: query.module_id ? query.module_id : undefined,
            field_id: query.field_id ? query.field_id : undefined,
            faculty_id: query.faculty_id ? query.faculty_id : undefined,
            status: query.status ? query.status : undefined,
            publisher_id: teacher.id
        },
        include: {
            module: {
                select: {
                    name: true,
                    id: true, code: true,
                    levels: { distinct: "name", select: { name: true, id: true } }
                }
            },
            field: {
                select: {
                    name: true, id: true
                }
            },
            faculty: { select: { name: true, id: true, university: { select: { name: true } } } },
            _count: {
                select: {
                    courseEnrollments: true,
                    courseSections: true
                }
            }
        },
        take: limit + 1,
        skip: (page - 1) * limit
    });
    const has_more = courses.length > limit;
    if (has_more) courses.pop();
    return {
        courses, page, has_more
    }
}


export const updateCourseService = async (user_id: string, course_id: string, data: Partial<CreateCourseDto>) => {

    const teacher = await db.teacherProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!teacher) throw new ForbiddenError("Teacher does not exists");

    const course = await db.course.findUnique({
        where: {
            id: course_id
        }
    });
    if (!course) throw new BadRequestError("Course not found");
    if (course.publisher_id !== teacher.id) throw new ForbiddenError("You are not the publisher of this course");
    await db.course.update({
        where: {
            id: course_id
        },
        data: {
            ...data,
            status: data.status ? data.status : "PENDING"
        }
    });
}


export const getCourseDetailsService = async (course_id: string) => {
    const course = await db.course.findUnique({
        where: {
            id: course_id,
            status: "ACCEPTED"
        },
        include: {
            faculty: { select: { name: true, id: true, university: { select: { name: true } } } },
            courseSections: {
                select: {
                    id: true,
                    title: true,
                    order: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
            module: {
                select: {
                    name: true,
                    id: true, code: true,
                    levels: { distinct: "name", select: { name: true, id: true } }
                }
            },
            field: {
                select: {
                    name: true, id: true
                }
            },
            publisher: {
                select: {
                    university: { select: { name: true } },
                    academic_title: true,
                    specialization: true,
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            avatar_url: true,
                            id: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    courseEnrollments: true,
                    courseSections: true
                }
            }
        }
    });
    if (!course) throw new NotFoundError("Course not found");
    return course;
}





export const getOwnCourseDetailsService = async (user_id: string, course_id: string) => {
    const teacher = await db.teacherProfile.findUnique({
        where: {
            user_id
        },
        select: {
            id: true,
        }
    });

    if (!teacher) throw new ForbiddenError("Teacher does not exists");
    const course = await db.course.findUnique({
        where: {
            id: course_id,
            publisher_id: teacher.id,
        },
        include: {
            faculty: { select: { name: true, id: true, university: { select: { name: true } } } },
            module: {
                select: {
                    name: true,
                    id: true, code: true,
                    levels: { distinct: "name", select: { name: true, id: true } }
                }
            },
            field: {
                select: {
                    name: true, id: true
                }
            },
            courseSections: {
                select: {
                    id: true,
                    title: true,
                    order: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
            _count: {
                select: {
                    courseEnrollments: true,
                    courseSections: true
                }
            }
        }
    });
    if (!course) throw new NotFoundError("Course not found");
    return course;
}