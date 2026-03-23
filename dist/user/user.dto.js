"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = exports.ChangePasswordDto = exports.ChangeEmailDto = void 0;
const zod_1 = require("zod");
const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/;
exports.ChangeEmailDto = zod_1.z.object({
    new_email: zod_1.z.email({ error: ({ input }) => !input ? "Email is required" : "Invalid email address" })
});
exports.ChangePasswordDto = zod_1.z.object({
    current_password: zod_1.z.string({ error: "Current password is required" }),
    new_password: zod_1.z.string({ error: "New password is required" })
        .min(8, { message: "New password must be at least 8 characters long" })
        .regex(PASSWORD_RULES, { message: "New password does not meet the requirements" })
});
exports.UpdateUserDto = zod_1.z.object({
    first_name: zod_1.z
        .string()
        .trim()
        .max(35, { error: "First name must be less than 35 character" })
        .optional()
        .or(zod_1.z.literal("").transform(() => undefined)),
    last_name: zod_1.z
        .string()
        .trim()
        .max(35, { error: "Last name must be less than 35 character" })
        .optional()
        .or(zod_1.z.literal("").transform(() => undefined)),
    bio: zod_1.z
        .string()
        .trim()
        .max(500, { error: "Bio need to be less than 500 character" })
        .optional()
        .or(zod_1.z.literal("").transform(() => undefined)),
});
