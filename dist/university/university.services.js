"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniversitiesService = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUniversitiesService = async (getUniversitiesQuery) => {
    const universities = await db_1.default.university.findMany({
        where: {
            name: getUniversitiesQuery.name ? { contains: getUniversitiesQuery.name } : undefined,
            city: getUniversitiesQuery.city ? getUniversitiesQuery.city : undefined,
            short_name: getUniversitiesQuery.short_name ? { contains: getUniversitiesQuery.short_name } : undefined
        }
    });
    return universities;
};
exports.getUniversitiesService = getUniversitiesService;
