"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDepartmentsQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetDepartmentsQuerySchema = zod_1.z.object({
    university_id: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    faculty_id: zod_1.z.string().optional()
});
