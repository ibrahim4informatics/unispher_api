import {z} from "zod";


export const GetDepartmentsQuerySchema = z.object({
    university_id:z.string().optional(),
    name:z.string().optional(),
    faculty_id:z.string().optional()
})


export type GetDepartmentsQuery = z.infer<typeof GetDepartmentsQuerySchema>;