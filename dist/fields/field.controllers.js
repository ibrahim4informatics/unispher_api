"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsController = void 0;
const field_service_1 = require("./field.service");
const getFieldsController = async (req, res) => {
    const query = req.query;
    const fields = await (0, field_service_1.getFieldsService)(query);
    return res.status(200).json({
        fields
    });
};
exports.getFieldsController = getFieldsController;
