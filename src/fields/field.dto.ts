import { z } from "zod";


export const GetFieldQuerySchema = z.object({
    department_id: z.string().regex(/\d+/).optional(),
    name:z.string().optional(),

});

export type GetFieldQuery = z.infer<typeof GetFieldQuerySchema>; 