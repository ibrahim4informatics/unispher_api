import { z } from "zod";

/**
 * Users Dtos
 */
/**
 * Password Regex to ensure strong password
 * 1 Upper Case Letter at least
 * 1 Special Character at least
 * 1 Lower Case Letter at least
 * 1 Digit at least 
 */
const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/
export const UserLoginBodySchema = z.object({

    password: z.string({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),

    student_id: z.string().regex(/\d+/, { error: "Student ID must be numeric" }).length(12, { error: "Student ID must be 12 digits" }).optional(),
    email: z.email().optional()


}).superRefine(({ student_id, email }, { addIssue }) => {

    const hasEmail = !!email;
    const hasStudentId = !!student_id;

    if (hasEmail && hasStudentId) addIssue({ code: "custom", path: ["student_id", "email"], message: "Provide student id or email not both" });

    if (!hasEmail && !hasStudentId) addIssue({ code: "custom", path: ["student_id", "email"], message: "Student Id or Email are required" });

})

export type UserLoginBody = z.infer<typeof UserLoginBodySchema>


export const UserRegisterBodySchema = z.object({

    first_name: z.string({ error: "the first name is required" }).min(2, { error: "first name must be at least 2 characters " }).max(35, { error: "first name maximum lenght exceeded" }),
    last_name: z.string({ error: "the first name is required" }).min(2, { error: "first name must be at least 2 characters " }).max(35, { error: "first name maximum lenght exceeded" }),
    email: z.email(),
    password: z.string()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),
    bio: z.string().max(500).optional(),
    student_id: z.string().regex(/\d+/).length(12).optional(),
    role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT")

}).superRefine(({ role, student_id }, context) => {

    if (role === "STUDENT" && !student_id) context.addIssue({ code: 'custom', path: ["student_id"], message: "Student Id is required for student registration" })
    if (role === "TEACHER" && student_id) context.addIssue({ code: "custom", path: ["root"], message: "Teacher has no student id" })

})

export type UserRegisterBody = z.infer<typeof UserRegisterBodySchema>;

/**
 * Refresh Token Dto
 */

export const RefreshTokenBodySchema = z.object({
    refresh_token: z.jwt({ error: ({ input }) => !input ? "the refresh token is required" : "invalid jwt token" })
})
export type RefreshTokenBody = z.infer<typeof RefreshTokenBodySchema>

/**
 * Reset Passwords Dtos
 */


export const SendResetPasswordOtpBodySchema = z.object({
    email: z.email({ error: ({ input }) => !input ? "email is required for reset password" : "invalid email" }),
})

export type SendResetPasswordOtpBody = z.infer<typeof SendResetPasswordOtpBodySchema>


export const VerifyOtpBodySchema = z.object({
    user_id: z.uuid({ error: ({ input }) => !input ? "user id is required for verfication" : "user id is invalid" }),
    otp_code: z.string({ error: "otp code is required for verification" }).length(6, { error: "otp has 6 digits only" }).regex(/\d{6}/, { error: "otp code contains only 6 numbers" })
})
export type VerifyOtpBody = z.infer<typeof VerifyOtpBodySchema>;


export const ResetPasswordBodySchema = z.object({
    reset_token: z.jwt({ error: ({ input }) => !input ? "the reset token is required" : "invalid token format" }),
    new_password: z.string()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),

});
export type ResetPasswordBody = z.infer<typeof ResetPasswordBodySchema>;
/**
 * Sessions Dtos
 */
export const SessionSchema = z.object({
    user_id: z.uuid({ error: ({ input }) => !input ? "user id is required" : "invalid user id" }),
    device: z.string({ error: "device name is required" }),
    token: z.string({ error: "token is required" })
})
export type Session = z.infer<typeof SessionSchema>
