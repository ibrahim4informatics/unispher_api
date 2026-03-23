"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentDto = exports.CreateCommentDto = void 0;
const zod_1 = require("zod");
exports.CreateCommentDto = zod_1.z.object({
    content: zod_1.z.string({ error: ({ input }) => !input ? "content is required" : "Content should be string" }).max(500, { error: "Content should not be longer than 500 character" }),
    post_id: zod_1.z.number({ error: ({ input }) => !input ? "Post id is required" : "Post id must be number" })
});
exports.UpdateCommentDto = zod_1.z.object({
    content: zod_1.z.string({ error: ({ input }) => !input ? "content is required" : "Content should be string" }).max(500, { error: "Content should not be longer than 500 character" }),
});
