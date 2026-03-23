"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniversitiesController = void 0;
const university_services_1 = require("./university.services");
const getUniversitiesController = async (req, res) => {
    const query = req.query;
    const universities = await (0, university_services_1.getUniversitiesService)(query);
    return res.status(200).json({ universities });
};
exports.getUniversitiesController = getUniversitiesController;
