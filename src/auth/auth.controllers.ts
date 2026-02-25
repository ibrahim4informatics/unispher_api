import { Request, Response } from "express";
import { RefreshTokenBody, UserLoginBody, type UserRegisterBody } from "./auth.dto";
import { loginUserService, refreshTokenService, registerUserService } from "./auth.services";

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


const refreshTokenController = async (req:Request, res:Response)=> {
    const body:RefreshTokenBody = req.body;
    const accessToken = await refreshTokenService(body.refresh_token);
    return res.status(200).json({accessToken});
}

export {
    registerUserController,
    loginController,
    refreshTokenController
}