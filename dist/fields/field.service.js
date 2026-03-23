"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsService = void 0;
const db_1 = __importDefault(require("../config/db"));
const getFieldsService = async (queryParams) => {
    const fields = await db_1.default.field.findMany({
        where: {
            name: queryParams.name ? {
                contains: queryParams.name
            } : undefined,
            department_id: queryParams.department_id ? parseInt(queryParams.department_id) : undefined,
        }
    });
    return fields;
};
exports.getFieldsService = getFieldsService;
