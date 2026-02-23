import ENV from "../config/ENV";

const JWT_CONFIG ={
    accessToken:{
        secret:ENV.JWT_ACCESS_TOKEN_SECRET,
    },
    refreshToken:{
        secret:ENV.JWT_REFRESH_TOKEN_SECRET,
    }
}

export {
    JWT_CONFIG
}