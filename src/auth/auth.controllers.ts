import { Request, Response } from "express";
import { LogoutBody, RefreshTokenBody, ResetPasswordBody, SendResetPasswordOtpBody, UserLoginBody, VerifyOtpBody, type UserRegisterBody } from "./auth.dto";
import { loginUserService, refreshTokenService, registerUserService, resetPasswordService, resetPasswordVeirfyOtpService, sendPasswordOtpService, userLogoutService } from "./auth.services";

const registerUserController = async (request: Request, res: Response) => {
    const body: UserRegisterBody = request.body;
    const user = await registerUserService(body);
    return res.status(201).json({ message: "user register success", user });

}


const loginController = async (req: Request, res: Response) => {
    const body: UserLoginBody = req.body;
    const device: string = req.headers["x-device"] as string || `${req.useragent?.platform} ${req.useragent?.isMobile ? "Phone" : "Desktop"}`;
    const { accessToken, refreshToken } = await loginUserService(body, device);
    return res.status(200).json({ accessToken, refreshToken });
}


const refreshTokenController = async (req: Request, res: Response) => {
    const body: RefreshTokenBody = req.body;
    const accessToken = await refreshTokenService(body.refresh_token);
    return res.status(200).json({ accessToken });
}

const sendResetOtpController = async (req: Request, res: Response) => {
    const body: SendResetPasswordOtpBody = req.body;
    const { user_id, result } = await sendPasswordOtpService(body.email);
    return res.status(200).json({ user_id, result });

}

const verifyResetOtpController = async (req: Request, res: Response) => {
    const body: VerifyOtpBody = req.body;
    const { verified, reset_token } = await resetPasswordVeirfyOtpService(body.otp_code, body.user_id)
    return res.status(200).json({ verified, reset_token });
}

const resetPasswordController = async (req: Request, res: Response) => {
    const body: ResetPasswordBody = req.body;
    const { password_changed } = await resetPasswordService(body);
    return res.status(200).json({ password_changed })
}

const userLogoutController = async (req:Request, res:Response)=>{
    const body:LogoutBody = req.body;
    const result = await userLogoutService(body);
    return res.status(200).json(result);
}



export {
    registerUserController,
    loginController,
    refreshTokenController,
    sendResetOtpController,
    verifyResetOtpController,
    resetPasswordController,
    userLogoutController
}