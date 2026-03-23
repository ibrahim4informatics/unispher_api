"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLevelsQuerySchema = void 0;
const zod_1 = require("zod");
exports.GetLevelsQuerySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    field_id: zod_1.z.string().optional(),
});
