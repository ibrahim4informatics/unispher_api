"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentProfileDtoSchema = exports.CreateStudentProfileDtoSchema = void 0;
const zod_1 = require("zod");
exports.CreateStudentProfileDtoSchema = zod_1.z.object({
    university_id: zod_1.z.uuid({ error: ({ input }) => !input ? "University ID is required" : "Invalid University ID format" }),
    faculty_id: zod_1.z.number({ error: ({ input }) => !input ? "Faculty ID is required" : "Invalid Faculty ID format" }),
    department_id: zod_1.z.number({ error: ({ input }) => !input ? "Department ID is required" : "Invalid Department ID format" }),
    field_id: zod_1.z.number({ error: ({ input }) => !input ? "Field ID is required" : "Invalid Field ID format" }),
    level_id: zod_1.z.number({ error: ({ input }) => !input ? "Level ID is required" : "Invalid Level ID format" }),
    user_id: zod_1.z.uuid({ error: ({ input }) => !input ? "User ID is required" : "Invalid User ID format" }),
});
exports.UpdateStudentProfileDtoSchema = zod_1.z.object({
    university_id: zod_1.z.uuid({ error: ({ input }) => !input ? "University ID is required" : "Invalid University ID format" }).optional(),
    faculty_id: zod_1.z.number({ error: ({ input }) => !input ? "Faculty ID is required" : "Invalid Faculty ID format" }).optional(),
    department_id: zod_1.z.number({ error: ({ input }) => !input ? "Department ID is required" : "Invalid Department ID format" }).optional(),
    field_id: zod_1.z.number({ error: ({ input }) => !input ? "Field ID is required" : "Invalid Field ID format" }).optional(),
    level_id: zod_1.z.number({ error: ({ input }) => !input ? "Level ID is required" : "Invalid Level ID format" }).optional()
}).superRefine(({ university_id, faculty_id, department_id, field_id, level_id }, ctx) => {
    if (!university_id && !faculty_id && !department_id && !field_id && !level_id) {
        ctx.addIssue({
            code: "custom",
            path: ["root"],
            message: "Nothing to update"
        });
    }
});
