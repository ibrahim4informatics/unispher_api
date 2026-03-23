import { z } from "zod";

export const CreateTeacherProfileDto = z.object({
    phone_number: z.string().max(10).refine((val) => /^\d{10}$/.test(val)).optional(),
    university_of_study: z.string({ error: ({ input }) => !input ? "University of study is required" : "Invalid university of study format" }).max(255),
    field_of_study: z.string({ error: ({ input }) => !input ? "Field of study is required" : "Invalid field of study format" }).max(255),
    specialization: z.string({ error: ({ input }) => !input ? "Specialization is required" : "Invalid specialization format" }).max(255),
    academic_title: z.enum(["ASSISTANT","LECTURER","PROFESSOR","DOCTOR","RESEARCHER","NONE"]),
    university_id: z.uuid({ error: ({ input }) => !input ? "University id is required" : "Invalid university id format" }),
    user_id: z.uuid({ error: ({ input }) => !input ? "User id is required" : "Invalid user id format" }),
});

export type CreateTeacherProfileDto = z.infer<typeof CreateTeacherProfileDto>;



export const UpdateTeacherProfileDto = CreateTeacherProfileDto.partial();

export type UpdateTeacherProfileDto = z.infer<typeof UpdateTeacherProfileDto>;