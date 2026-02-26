import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError";
import { verify } from "jsonwebtoken";
import ENV from "../../config/ENV";
import { UserAuthPayload } from "../../auth/auth.types";



const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        throw new UnauthorizedError("authentification is required")
    }
    const token = bearerToken.split(" ")[1];
    try {
        const payload = verify(token, ENV.JWT_ACCESS_TOKEN_SECRET!) as UserAuthPayload;
        req.user = payload;
        next();
    }
    catch {

        throw new UnauthorizedError("authentification is required")

    }
}


export default isAuthenticated;