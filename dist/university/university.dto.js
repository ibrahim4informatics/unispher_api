"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUniversitiesQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetUniversitiesQuerySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    short_name: zod_1.z.string().optional(),
});
