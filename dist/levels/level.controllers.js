"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevelsController = void 0;
const levels_service_1 = require("./levels.service");
const getLevelsController = async (req, res) => {
    const query = req.query;
    const levels = await (0, levels_service_1.getLevels)(query);
    return res.status(200).json({
        levels
    });
};
exports.getLevelsController = getLevelsController;
