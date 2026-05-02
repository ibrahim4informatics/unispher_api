import { z } from "zod";


export const CreateCourseDto = z.object({

    name: z.string({ error: ({ input }) => !input ? "Course name is required" : "Course name must be string" })
        .min(3).max(255),
    code: z.string({ error: ({ input }) => !input ? "Course name is required" : "Course name must be string" })
        .min(2).max(10),
    description: z.string({ error: ({ input }) => !input ? "Course name is required" : "Course name must be string" })
        .min(3).max(255),
    module_id: z.number(),
    status: z.enum([
        "DRAFT",
        "PENDING"]).default("DRAFT"),
    faculty_id: z.number(),
    field_id: z.number(),
})


export type CreateCourseDto = z.infer<typeof CreateCourseDto>


export const GetCoursesQuery = z.object({
    page: z.string().optional(),
    name: z.string().max(100).optional(),
    code: z.string().max(30).optional(),
    module_id: z.number().optional(),
    field_id: z.number().optional(),
    faculty_id: z.number().optional(),
    status: z.enum([
        "DRAFT",
        "PENDING",
        "ACCEPTED",
        "REJECTED"
    ]).optional()
});

export type GetCourseQuery = z.infer<typeof GetCoursesQuery>


export const CreateSectionDto = z.object({
    title: z.string({ error: ({ input }) => !input ? "Section title is required" : "Section title must be string" })
        .min(3).max(255),
    content: z.string({ error: ({ input }) => !input ? "Section content is required" : "Section content must be string" })
    ,
    order: z.coerce.number().transform(val => parseInt(val.toString())),
})

export type CreateSectionDto = z.infer<typeof CreateSectionDto>;