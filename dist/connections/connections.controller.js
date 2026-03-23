"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConncetionsSuggestionController = exports.deleteConnectionController = exports.rejectConnectionRequestController = exports.acceptConnectionRequestController = exports.sendConnectionRequestController = exports.getConnectionRequestsController = exports.getConncetionsController = void 0;
const connections_service_1 = require("./connections.service");
const getConncetionsController = async (req, res) => {
    const user_id = req.user.id;
    const query = req.query;
    const connections = await (0, connections_service_1.getUserConnectionsService)(user_id, query);
    return res.status(200).json({ connections });
};
exports.getConncetionsController = getConncetionsController;
const getConnectionRequestsController = async (req, res) => {
    const user_id = req.user.id;
    const query = req.query;
    const result = await (0, connections_service_1.getUserConnectionRequestsService)(user_id, query);
    return res.status(200).json({ ...result });
};
exports.getConnectionRequestsController = getConnectionRequestsController;
const sendConnectionRequestController = async (req, res) => {
    const sender_id = req.user.id;
    const data = req.body;
    const connection = await (0, connections_service_1.sendConnectionRequestService)(data, sender_id);
    return res.status(201).json({ connection });
};
exports.sendConnectionRequestController = sendConnectionRequestController;
const acceptConnectionRequestController = async (req, res) => {
    const receiver_id = req.user.id;
    const connection_id = parseInt(req.params.connection_id);
    await (0, connections_service_1.acceptConnectionRequestService)(connection_id, receiver_id);
    return res.status(200).json({ message: "Connection request accepted" });
};
exports.acceptConnectionRequestController = acceptConnectionRequestController;
const rejectConnectionRequestController = async (req, res) => {
    const receiver_id = req.user.id;
    const connection_id = parseInt(req.params.connection_id);
    await (0, connections_service_1.rejectConnectionRequestService)(connection_id, receiver_id);
    return res.status(200).json({ message: "Connection request rejected" });
};
exports.rejectConnectionRequestController = rejectConnectionRequestController;
const deleteConnectionController = async (req, res) => {
    const user_id = req.user.id;
    const connection_id = parseInt(req.params.connection_id);
    await (0, connections_service_1.deleteConnectionService)(connection_id, user_id);
    return res.status(200).json({ message: "Connection deleted" });
};
exports.deleteConnectionController = deleteConnectionController;
const getConncetionsSuggestionController = async (req, res) => {
    const user_id = req.user.id;
    const page = req.params.page;
    const results = await (0, connections_service_1.getRecommendedConnectionsService)(user_id, parseInt(page) || undefined);
    return res.status(200).json(results);
};
exports.getConncetionsSuggestionController = getConncetionsSuggestionController;
