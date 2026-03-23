"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchema = exports.LogoutBodySchema = exports.ResetPasswordBodySchema = exports.VerifyOtpBodySchema = exports.SendResetPasswordOtpBodySchema = exports.RefreshTokenBodySchema = exports.UserRegisterBodySchema = exports.UserLoginBodySchema = void 0;
const zod_1 = require("zod");
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
const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/;
exports.UserLoginBodySchema = zod_1.z.object({
    password: zod_1.z.string({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),
    student_id: zod_1.z.string().regex(/\d+/, { error: "Student ID must be numeric" }).length(12, { error: "Student ID must be 12 digits" }).optional(),
    email: zod_1.z.email().optional()
}).superRefine(({ student_id, email }, { addIssue }) => {
    const hasEmail = !!email;
    const hasStudentId = !!student_id;
    if (hasEmail && hasStudentId)
        addIssue({ code: "custom", path: ["student_id", "email"], message: "Provide student id or email not both" });
    if (!hasEmail && !hasStudentId)
        addIssue({ code: "custom", path: ["student_id", "email"], message: "Student Id or Email are required" });
});
exports.UserRegisterBodySchema = zod_1.z.object({
    first_name: zod_1.z.string({ error: "the first name is required" }).min(2, { error: "first name must be at least 2 characters " }).max(35, { error: "first name maximum lenght exceeded" }),
    last_name: zod_1.z.string({ error: "the first name is required" }).min(2, { error: "first name must be at least 2 characters " }).max(35, { error: "first name maximum lenght exceeded" }),
    email: zod_1.z.email(),
    password: zod_1.z.string()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),
    bio: zod_1.z.string().max(500).optional(),
    student_id: zod_1.z.string().regex(/\d+/).length(12).optional(),
    role: zod_1.z.enum(["STUDENT", "TEACHER"]).default("STUDENT")
}).superRefine(({ role, student_id }, context) => {
    if (role === "STUDENT" && !student_id)
        context.addIssue({ code: 'custom', path: ["student_id"], message: "Student Id is required for student registration" });
    if (role === "TEACHER" && student_id)
        context.addIssue({ code: "custom", path: ["root"], message: "Teacher has no student id" });
});
/**
 * Refresh Token Dto
 */
exports.RefreshTokenBodySchema = zod_1.z.object({
    refresh_token: zod_1.z.jwt({ error: ({ input }) => !input ? "the refresh token is required" : "invalid jwt token" })
});
/**
 * Reset Passwords Dtos
 */
exports.SendResetPasswordOtpBodySchema = zod_1.z.object({
    email: zod_1.z.email({ error: ({ input }) => !input ? "email is required for reset password" : "invalid email" }),
});
exports.VerifyOtpBodySchema = zod_1.z.object({
    user_id: zod_1.z.uuid({ error: ({ input }) => !input ? "user id is required for verfication" : "user id is invalid" }),
    otp_code: zod_1.z.string({ error: "otp code is required for verification" }).length(6, { error: "otp has 6 digits only" }).regex(/\d{6}/, { error: "otp code contains only 6 numbers" })
});
exports.ResetPasswordBodySchema = zod_1.z.object({
    reset_token: zod_1.z.jwt({ error: ({ input }) => !input ? "the reset token is required" : "invalid token format" }),
    new_password: zod_1.z.string()
        .min(8, { error: "Password must be at least 8 characters" })
        .max(100, { error: "Password is too long" })
        .regex(PASSWORD_RULES, { error: "Password must include uppercase, lowercase, number, and special character" }),
});
/**
 * Log out dtos
 */
exports.LogoutBodySchema = zod_1.z.object({
    refresh_token: zod_1.z.jwt({ error: ({ input }) => !input ? "refresh token is required for log out" : "invalid token provided" })
});
/**
 * Sessions Dtos
 */
exports.SessionSchema = zod_1.z.object({
    user_id: zod_1.z.uuid({ error: ({ input }) => !input ? "user id is required" : "invalid user id" }),
    device: zod_1.z.string({ error: "device name is required" }),
    token: zod_1.z.string({ error: "token is required" })
});
