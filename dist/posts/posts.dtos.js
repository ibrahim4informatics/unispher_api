"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsQueryDto = exports.CreatePostDto = void 0;
const zod_1 = require("zod");
exports.CreatePostDto = zod_1.z.object({
    content: zod_1.z.string({ error: "Content is required" }).min(10, { error: "Content must be at least 10 characters" }),
    type: zod_1.z.enum(["FEED", "FORUM", "QUESTION", "RESOURCE", "ANNOUNCEMENT"]),
});
exports.GetPostsQueryDto = zod_1.z.object({
    page: zod_1.z.string().refine(val => val === "" ? undefined : val).regex(/\d+/).transform(val => parseInt(val)).optional()
});
