"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const AppError_1 = require("./AppError");
class ServerError extends AppError_1.AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.ServerError = ServerError;
