import {z} from "zod";

export const GetFacultiesQuerySchema = z.object({
    university_id:z.string().optional(),
    name:z.string().optional(),
})

export type GetFacultiesQuery = z.infer<typeof GetFacultiesQuerySchema>;