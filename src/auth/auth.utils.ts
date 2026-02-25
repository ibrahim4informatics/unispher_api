import { type UserAuthPayload } from "./auth.types"
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "./auth.constants";
import crypto from "crypto";
import ENV from "../config/ENV";
const generateAccessToken = (payload: UserAuthPayload): string => {
    const token = jwt.sign(payload, JWT_CONFIG.accessToken.secret!, { expiresIn: "15m" });
    return token;
}

const generateRefreshToken = (payload: UserAuthPayload): string => {
    const token = jwt.sign(payload, JWT_CONFIG.refreshToken.secret!, { expiresIn: "7d" });
    return token;
}

const verifyAccessToken = (token: string) => {
    try {
        const payload = jwt.verify(token, JWT_CONFIG.accessToken.secret!);
        return payload;
    }

    catch (err) {
        return err;

    }
}


const verifyRefreshToken = (token: string) => {
    try {
        const payload = jwt.verify(token, JWT_CONFIG.refreshToken.secret!);
        return payload as UserAuthPayload;
    }

    catch (err) {
        return false;

    }
}


const hashRefreshToken = (token:string)=>{

    return crypto.createHmac("sha256", ENV.REFRESH_TOKEN_HASH_SECRET!).update(token,"utf-8").digest("hex");

}


const generateResetPasswordOtpMail = (otp:string, first_name:string)=>{
    return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Password Reset Verification</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f2f6fb; font-family: Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0; background-color:#f2f6fb;">
            <tr>
            <td align="center">

                <table width="520" cellpadding="0" cellspacing="0" border="0"
                    style="background-color:#ffffff; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">

                <tr>
                    <td style="background-color:#0b3d91; padding:22px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
                        Password Reset Request
                    </h1>
                    </td>
                </tr>

                <tr>
                    <td style="padding:35px 40px; color:#2c3e50; font-size:15px; line-height:1.6;">

                    <p style="margin-top:0;">
                        Dear ${first_name},
                    </p>

                    <p>
                        We received a request to reset your account password for the Academic Portal.
                        To proceed, please use the verification code below.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                        <span style="
                        display:inline-block;
                        padding:16px 45px;
                        font-size:26px;
                        letter-spacing:6px;
                        font-weight:bold;
                        color:#0b3d91;
                        background-color:#e6eefc;
                        border:1px solid #c3d4f7;
                        border-radius:4px;
                        ">
                        ${otp}
                        </span>
                    </div>

                    <p>
                        This code will expire in <strong>10 minutes</strong> for security reasons.
                    </p>

                    <p>
                        If you did not initiate this request, please ignore this email.
                        Your password will remain unchanged.
                    </p>

                    <p style="margin-bottom:0;">
                        Regards,<br>
                        <strong>Unisphere IT Support</strong>
                    </p>

                    </td>
                </tr>

                <tr>
                    <td style="background-color:#f2f6fb; padding:18px; text-align:center; font-size:12px; color:#6c7a89;">
                    This is an automated message. Please do not reply.<br>
                    © 2026 Unisphere Academic Institution. All rights reserved.
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>
    `
}

export {
    generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, hashRefreshToken,
    generateResetPasswordOtpMail
}