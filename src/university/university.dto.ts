import { z } from "zod"
export const GetUniversitiesQuerySchema = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    short_name: z.string().optional(),
});

export type GetUniversitiesQuery = z.infer<typeof GetUniversitiesQuerySchema>;