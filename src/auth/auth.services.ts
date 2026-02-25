import { User } from "@prisma/client";
import { Session, UserLoginBody, UserRegisterBody } from "./auth.dto";
import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { hash, verify } from "../shared/services/argon.service";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshToken } from "./auth.utils";




const getSessionByToken = async (refresh_token: string) => {
    const token = hashRefreshToken(refresh_token);
    const sesssion = await db.session.findUnique({ where: { token } });
    return sesssion;
}

const createSession = async (session: Session) => {
    const token = hashRefreshToken (session.token);
    const session_exists = await db.session.findUnique({ where: { token } })
    if (session_exists) throw new ForbiddenError("invalid session try again");
    const newSession = await db.session.create({
        data: {
            user_id: session.user_id,
            token,
            device: session.device
        }
    })
    return newSession;
}



// Exported Services Consumed by auth Controllers
const registerUserService = async (data: UserRegisterBody): Promise<Omit<User, "password" | "avatar_url" | "student_id">> => {

    const { student_id, email, password, first_name, last_name, bio, role = "STUDENT" } = data;

    const hashPassword = await hash(password);
    if (role === "TEACHER") {
        const teacher = await db.user.findUnique({ where: { email } });
        if (teacher) throw new BadRequestError("the email is taken");
        const { avatar_url, student_id, password, ...newTeacher } = await db.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword } });
        return newTeacher;
    }
    else {
        const student = await db.user.findFirst({ where: { OR: [{ student_id }, { email }] } });
        if (student) throw new BadRequestError("Student with this credentials already exist");
        const { avatar_url, password, ...newStudent } = await db.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword, student_id } });
        return newStudent;
    }
}


const loginUserService = async (data: UserLoginBody, device: string) => {
    const { password, email, student_id } = data;
    let user;

    /**
     * Here it means that a student who made request for auth  with his student id
     */
    if (student_id) {
        user = await db.user.findUnique({ where: { student_id } });
    }

    else if (email) {
        user = await db.user.findUnique({ where: { email } });
        if (user?.role === "STUDENT") throw new BadRequestError("Can not login with email");
    }

    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isCorrectPassword: boolean = await verify(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedError("Invalid email or password");

    const accessToken = generateAccessToken({ email: user.email, id: user.id });
    const refreshToken = generateRefreshToken({ email: user.email, id: user.id });

    createSession({ device, token: refreshToken, user_id: user.id });

    return {
        accessToken, refreshToken
    }
}


const refreshTokenService = async (refresh_token: string) => {
    const payload = verifyRefreshToken(refresh_token);
    if (!payload) throw new UnauthorizedError("user is not authentificated");
    const session = await getSessionByToken(refresh_token);
    if(!session || session.is_expired || (session.expires_at && session.expires_at < new Date())) throw new UnauthorizedError("invalid or expired session login again");
    const accessToken = generateAccessToken({email:payload.email,id:payload.id});
    return accessToken;
}



export {
    registerUserService,
    loginUserService,
    refreshTokenService
}