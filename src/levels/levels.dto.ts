import {z} from "zod";

export const GetLevelsQuerySchema = z.object({
    name: z.string().optional(),
    field_id: z.string().optional(),
})

export type GetLevelsQuery = z.infer<typeof GetLevelsQuerySchema>