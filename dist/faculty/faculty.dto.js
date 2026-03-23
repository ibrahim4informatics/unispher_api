"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFacultiesQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetFacultiesQuerySchema = zod_1.z.object({
    university_id: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
});
