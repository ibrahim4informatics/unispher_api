"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentAcademicProfileController = exports.updateStudentProfileController = exports.createStudentProfileController = void 0;
const student_service_1 = require("./student.service");
const createStudentProfileController = async (req, res) => {
    const createStudentProfileDto = req.body;
    const studentProfile = await (0, student_service_1.createStudentProfile)(createStudentProfileDto);
    return res.status(201).json({
        studentProfile
    });
};
exports.createStudentProfileController = createStudentProfileController;
const updateStudentProfileController = async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;
    await (0, student_service_1.updateStudentProfileService)(data, user_id);
    return res.status(200).json({ message: "Profile Updated" });
};
exports.updateStudentProfileController = updateStudentProfileController;
const getStudentAcademicProfileController = async (req, res) => {
    const user_id = req.user.id;
    const profile = await (0, student_service_1.getStudentAcademicProfileService)(user_id);
    return res.status(200).json({ profile });
};
exports.getStudentAcademicProfileController = getStudentAcademicProfileController;
