

import { z } from 'zod';

const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/

export const ChangeEmailDto = z.object({
    new_email: z.email({ error: ({ input }) => !input ? "Email is required" : "Invalid email address" })
});

export const ChangePasswordDto = z.object({
    current_password: z.string({ error: "Current password is required" }),
    new_password: z.string({ error: "New password is required" })
        .min(8, { message: "New password must be at least 8 characters long" })
        .regex(PASSWORD_RULES, { message: "New password does not meet the requirements" })
});


export const UpdateUserDto = z.object({
    first_name: z
        .string()
        .trim()
        .max(35, { error: "First name must be less than 35 character" })
        .optional()
        .or(z.literal("").transform(() => undefined)),

    last_name: z
        .string()
        .trim()
        .max(35, { error: "Last name must be less than 35 character" })
        .optional()
        .or(z.literal("").transform(() => undefined)),

    bio: z
        .string()
        .trim()
        .max(500, { error: "Bio need to be less than 500 character" })
        .optional()
        .or(z.literal("").transform(() => undefined)),
})

export type UpdateUserDto = z.infer<typeof UpdateUserDto>
export type ChangeEmailDto = z.infer<typeof ChangeEmailDto>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordDto>;
