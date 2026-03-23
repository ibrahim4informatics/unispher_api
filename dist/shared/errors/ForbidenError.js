"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const AppError_1 = require("./AppError");
class ForbiddenError extends AppError_1.AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
