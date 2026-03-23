"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentsService = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDepartmentsService = async (getDepartmentsQuery) => {
    const departments = await db_1.default.department.findMany({
        where: {
            name: getDepartmentsQuery.name ? { contains: getDepartmentsQuery.name } : undefined,
            university_id: getDepartmentsQuery.university_id ? getDepartmentsQuery.university_id : undefined,
            faculty_id: getDepartmentsQuery.faculty_id ? parseInt(getDepartmentsQuery.faculty_id) : undefined,
        }
    });
    return departments;
};
exports.getDepartmentsService = getDepartmentsService;
