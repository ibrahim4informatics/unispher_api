"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevels = void 0;
const db_1 = __importDefault(require("../config/db"));
const getLevels = async (query) => {
    const levels = await db_1.default.level.findMany({
        where: {
            name: query.name ? {
                contains: query.name
            } : undefined,
            field_id: query.field_id ? parseInt(query.field_id) : undefined,
        }
    });
    return levels;
};
exports.getLevels = getLevels;
