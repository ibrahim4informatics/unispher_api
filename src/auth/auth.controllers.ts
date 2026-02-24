import { Request, Response } from "express";
import { type UserRegisterBody } from "./auth.dto";
import { registerUserService } from "./auth.services";

const registerUserController = async (request: Request, res: Response) => {
    const body: UserRegisterBody = request.body;
    const user = await registerUserService(body);
    return res.status(200).json({ message: "user register success", user });

}


export {
    registerUserController
}