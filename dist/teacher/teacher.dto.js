"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeacherProfileDto = void 0;
const zod_1 = require("zod");
exports.CreateTeacherProfileDto = zod_1.z.object({
    phone_number: zod_1.z.string().max(10).refine((val) => /^\d{10}$/.test(val)).optional(),
    university_of_study: zod_1.z.string({ error: ({ input }) => !input ? "University of study is required" : "Invalid university of study format" }).max(255),
    field_of_study: zod_1.z.string({ error: ({ input }) => !input ? "Field of study is required" : "Invalid field of study format" }).max(255),
    specialization: zod_1.z.string({ error: ({ input }) => !input ? "Specialization is required" : "Invalid specialization format" }).max(255),
    academic_title: zod_1.z.enum(["ASSISTANT", "LECTURER", "PROFESSOR", "DOCTOR", "RESEARCHER", "NONE"]),
    university_id: zod_1.z.uuid({ error: ({ input }) => !input ? "University id is required" : "Invalid university id format" }),
    user_id: zod_1.z.uuid({ error: ({ input }) => !input ? "User id is required" : "Invalid user id format" }),
});
