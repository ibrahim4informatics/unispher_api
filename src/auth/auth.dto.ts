import { z } from "zod";
/**
 * Password Regex to ensure strong password
 * 1 Upper Case Letter at least
 * 1 Special Character at least
 * 1 Lower Case Letter at least
 * 1 Digit at least 
 */
const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/
export const UserLoginBodySchema = z.object({

    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password is too long" })
        .regex(PASSWORD_RULES, { message: "Password must include uppercase, lowercase, number, and special character" }),

    student_id: z.string().regex(/\d+/).length(12).optional(),
    email: z.email().optional()


}).superRefine(({ student_id, email }, { addIssue }) => {

    const hasEmail = !!email;
    const hasStudentId = !!student_id;

    if (hasEmail && hasStudentId) addIssue({ code: "custom", path: ["student_id", "email"], message: "Provide student id or email not both" });

    if(!hasEmail && !hasStudentId)addIssue({ code: "custom", path: ["student_id", "email"], message: "Student Id or Email are required" });

})

export type UserLoginBody = z.infer<typeof UserLoginBodySchema>


export const UserRegisterBodySchema = z.object({
    
})

