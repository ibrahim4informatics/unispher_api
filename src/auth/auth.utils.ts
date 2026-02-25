import { type UserAuthPayload } from "./auth.types"
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { JWT_CONFIG } from "./auth.constants";

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

export {
    generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken
}