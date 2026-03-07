

import {z} from 'zod';

const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/

export const ChangeEmailDto = z.object({
    new_email: z.email({error:({input})=>!input ?"Email is required": "Invalid email address"})
});

export const ChangePasswordDto = z.object({
    current_password: z.string({error:"Current password is required"}),
    new_password: z.string({error: "New password is required"})
        .min(8, {message: "New password must be at least 8 characters long"})
        .regex(PASSWORD_RULES, {message: "New password does not meet the requirements"})
});

export type ChangeEmailDto = z.infer<typeof ChangeEmailDto>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordDto>;
