"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacherProfileController = void 0;
const teacher_service_1 = require("./teacher.service");
const createTeacherProfileController = async (req, res) => {
    const body = req.body;
    const profile = await (0, teacher_service_1.createTeacherProfileService)(body);
    return res.status(201).json({ profile });
};
exports.createTeacherProfileController = createTeacherProfileController;
