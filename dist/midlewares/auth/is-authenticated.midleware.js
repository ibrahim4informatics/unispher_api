"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UnauthorizedError_1 = require("../../shared/errors/UnauthorizedError");
const jsonwebtoken_1 = require("jsonwebtoken");
const ENV_1 = __importDefault(require("../../config/ENV"));
const isAuthenticated = async (req, res, next) => {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        throw new UnauthorizedError_1.UnauthorizedError("authentification is required");
    }
    const token = bearerToken.split(" ")[1];
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, ENV_1.default.JWT_ACCESS_TOKEN_SECRET);
        req.user = payload;
        next();
    }
    catch {
        throw new UnauthorizedError_1.UnauthorizedError("authentification is required");
    }
};
exports.default = isAuthenticated;
