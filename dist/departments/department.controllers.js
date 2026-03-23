"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentsController = void 0;
const department_services_1 = require("./department.services");
const getDepartmentsController = async (req, res) => {
    const query = req.query;
    const departments = await (0, department_services_1.getDepartmentsService)(query);
    return res.status(200).json({ departments });
};
exports.getDepartmentsController = getDepartmentsController;
