"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ENV_1 = __importDefault(require("../../config/ENV"));
const AppError_1 = require("../errors/AppError");
//Initialize nodemailer
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "appunisphere@gmail.com",
        pass: ENV_1.default.GMAIL_APP_PASSWORD
    }
});
const sendMail = async (mailOptions) => {
    try {
        const result = await transport.sendMail(mailOptions);
        return result;
    }
    catch (err) {
        throw new AppError_1.AppError("Reset password failed due to email services", 501);
    }
};
exports.sendMail = sendMail;
