"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const validateQuery = (schema) => (req, res, next) => {
    const validateResult = schema.safeParse(req.query);
    if (validateResult.success) {
        next();
    }
    else {
        return res.status(400).json({ errors: zod_1.default.treeifyError(validateResult.error) });
    }
};
exports.default = validateQuery;
