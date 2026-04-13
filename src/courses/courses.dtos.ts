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
        "PENDING",
        "ACCEPTED",
        "REJECTED"]).default("DRAFT")

})


export type CreateCourseDto = z.infer<typeof CreateCourseDto>