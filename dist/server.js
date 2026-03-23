"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const app_1 = __importDefault(require("./app"));
const PORT = 3000;
const server = (0, node_http_1.createServer)(app_1.default);
server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
