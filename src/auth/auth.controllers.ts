import { Request, Response } from "express";
import { UserLoginBody, type UserRegisterBody } from "./auth.dto";
import { loginUserService, registerUserService } from "./auth.services";

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


export {
    registerUserController,
    loginController
}