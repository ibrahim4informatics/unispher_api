"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConnectionsRequestsQueryDto = exports.SendConnectionRequestDto = void 0;
const zod_1 = require("zod");
exports.SendConnectionRequestDto = zod_1.z.object({
    receiver_id: zod_1.z.uuid({ error: ({ input }) => !input ? "Receiver id is required" : "Receiver id must be a valid uuid" }),
});
exports.GetConnectionsRequestsQueryDto = zod_1.z.object({
    sender_name: zod_1.z.string().refine(val => val === "" ? undefined : val).optional(),
    page: zod_1.z.string().refine(val => val === "" ? undefined : val).regex(/\d+/).transform(val => parseInt(val)).optional()
});
