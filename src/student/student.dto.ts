
import {z} from "zod";


export const CreateStudentProfileDtoSchema = z.object({
    university_id: z.uuid({error:({input})=> !input ? "University ID is required" : "Invalid University ID format"}),
    faculty_id: z.number({error:({input})=> !input ? "Faculty ID is required" : "Invalid Faculty ID format"}),
    department_id: z.number({error:({input})=> !input ? "Department ID is required" : "Invalid Department ID format"}),
    field_id: z.number({error:({input})=> !input ? "Field ID is required" : "Invalid Field ID format"}),
    level_id: z.number({error:({input})=> !input ? "Level ID is required" : "Invalid Level ID format"}),
    user_id: z.uuid({error:({input})=> !input ? "User ID is required" : "Invalid User ID format"}),
})

export type CreateStudentProfileDto = z.infer<typeof CreateStudentProfileDtoSchema>;

