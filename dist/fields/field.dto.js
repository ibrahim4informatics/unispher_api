"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFieldQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetFieldQuerySchema = zod_1.z.object({
    department_id: zod_1.z.string().regex(/\d+/).optional(),
    name: zod_1.z.string().optional(),
});
