"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.verify = void 0;
const argon2_1 = __importDefault(require("argon2"));
const AppError_1 = require("../errors/AppError");
const hash = async (value) => {
    try {
        const hash = await argon2_1.default.hash(value);
        return hash;
    }
    catch (err) {
        console.log(`Argon2 Hash Error:${err}`);
        throw new AppError_1.AppError("Can not register user", 501);
    }
};
exports.hash = hash;
const verify = async (value, hash) => {
    try {
        const isVerified = await argon2_1.default.verify(hash, value);
        return isVerified;
    }
    catch (err) {
        console.log(`Argon2 Verify Error:${err}`);
        throw new AppError_1.AppError("Can not login user", 501);
    }
};
exports.verify = verify;
