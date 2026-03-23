"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacultiesService = void 0;
const db_1 = __importDefault(require("../config/db"));
const getFacultiesService = async (query) => {
    const faculties = await db_1.default.faculty.findMany({
        where: {
            university_id: query.university_id ? query.university_id : undefined,
            name: query.name ? { contains: query.name } : undefined
        }
    });
    return faculties;
};
exports.getFacultiesService = getFacultiesService;
