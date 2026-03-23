"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacultiesController = void 0;
const faculty_service_1 = require("./faculty.service");
const getFacultiesController = async (req, res) => {
    const query = req.query;
    const faculties = await (0, faculty_service_1.getFacultiesService)(query);
    return res.status(200).json({ faculties });
};
exports.getFacultiesController = getFacultiesController;
