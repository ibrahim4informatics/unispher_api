"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG = void 0;
const ENV_1 = __importDefault(require("../config/ENV"));
const JWT_CONFIG = {
    accessToken: {
        secret: ENV_1.default.JWT_ACCESS_TOKEN_SECRET,
    },
    refreshToken: {
        secret: ENV_1.default.JWT_REFRESH_TOKEN_SECRET,
    }
};
exports.JWT_CONFIG = JWT_CONFIG;
