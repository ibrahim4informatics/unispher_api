import db from "../config/db";
import { NotFoundError } from "../shared/errors/NotFoundError";
import { CreateSectionDto } from "./courses.dtos";
import { deleteFromCloudinary, getPublicId, uploadToCloudinary } from "../shared/services/cloudinary.service";
import { FileTypes } from "@prisma/client";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { BadRequestError } from "../shared/errors/BadRequestError";

export const createSectionService = async (user_id: string, course_id: string, data: CreateSectionDto, files: Express.Multer.File[]) => {
    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });




    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to add section to this course");
    const section = await db.courseSection.create({
        data: {
            ...data,
            order: parseInt(data.order.toString()),
            course_id
        }
    })

    if (files && files.length > 0) {

        const uploadPromises = files.map(file => uploadToCloudinary(file, `courses-materials/${course_id}/${section.id}`));
        const urls = await Promise.all(uploadPromises);

        const data = urls.map(url => ({ link: url, course_section_id: section.id, type: FileTypes.PDF, name: url.split('/').pop() || "file" }))
        await db.courseMaterial.createMany({
            data
        });
    }
    return section;
}


export const updateSectionService = async (user_id: string, course_id: string, section_id: number, data: Partial<CreateSectionDto>) => {
    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to update section of this course");

    const section = await db.courseSection.findFirst({
        where: { id: section_id, course_id }
    });


    if (!section) throw new NotFoundError("Section not found");
    await db.courseSection.update({
        where: { id: section_id },
        data: {
            ...data
        }
    });
}


export const deleteSectionService = async (user_id: string, course_id: string, section_id: number) => {
    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to delete section of this course");
    const section = await db.courseSection.findFirst({
        where: { id: section_id, course_id }
    });
    if (!section) throw new NotFoundError("Section not found");
    const courseMaterials = await db.courseMaterial.findMany({
        where: { course_section_id: section_id },
        select: { link: true }
    });
    const deletePromises = courseMaterials.map(material => deleteFromCloudinary(material.link));
    await Promise.all(deletePromises);
    await db.courseSection.delete({
        where: { id: section_id }
    });
    await db.course.update({ where: { id: course_id }, data: { status: "PENDING" } });

}

export const uploadCourseMaterialService = async (user_id: string, course_id: string, section_id: number, files: Express.Multer.File[]) => {
    if(!files || files.length === 0) throw new BadRequestError("No files uploaded");
    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to upload material to this course");

    const section = await db.courseSection.findFirst({
        where: { id: section_id, course_id }
    });

    if (!section) throw new NotFoundError("Section not found");

    const uploadPromises = files.map(file => uploadToCloudinary(file, `courses-materials/${course_id}/${section_id}`));
    const urls = await Promise.all(uploadPromises);

    const data = urls.map(url => ({ link: url, course_section_id: section_id, type: FileTypes.PDF, name: url.split('/').pop() || "file" }))
    await db.courseMaterial.createMany({
        data
    });
}

export const deleteSectionMaterialService = async (user_id: string, course_id: string, material_id: number) => {
    const course = await db.course.findUnique({
        where: { id: course_id },
        include: { publisher: { select: { user_id: true } } }
    });

    if (!course || course.publisher.user_id !== user_id) throw new NotFoundError("Course not found or you don't have permission to delete material of this course");

    const material = await db.courseMaterial.findFirst({
        where: { id: material_id },
        include: { course_section: { select: { course_id: true } } }
    });

    if (!material || material.course_section.course_id !== course_id) throw new ForbiddenError("Material not found or does not belong to this course");

    await deleteFromCloudinary(getPublicId(material.link), "raw");
    await db.courseMaterial.delete({
        where: { id: material_id }
    });
}


export const getCourseSectionsService = async (user_id: string, course_id: string, page: number = 1) => {
    const limit = 10;

    const course = await db.course.findFirst({
        where: {
            id: course_id,
            OR: [
                { status: "ACCEPTED", courseEnrollments: { some: { student: { user_id } } } },
                { publisher: { user_id } }
            ]
        }
    })

    if (!course) throw new NotFoundError("Course not found");
    const sections = await db.courseSection.findMany({
        where: { course_id },
        include: { materials: true },
        take: limit + 1,
        skip: (page - 1) * limit,
        orderBy: {
            order: "asc",
        }
    });
    const has_more = sections.length > limit;
    if (has_more) sections.pop();
    if (!sections) throw new NotFoundError("Course not found or no sections found for this course");
    return { sections, page, has_more };
}

export const getSectionDetailsService = async (user_id: string, course_id: string, section_id: number) => {

    const section = await db.courseSection.findFirst({
        where: {
            id: section_id,
            course_id,
            OR: [
                { course: { publisher: { user_id } } },
                { course: { status: "ACCEPTED", courseEnrollments: { some: { student: { user_id } } } } }
            ]
        },
        include: { materials: true }
    });
    if (!section) throw new NotFoundError("Section not found");
    return section;
}