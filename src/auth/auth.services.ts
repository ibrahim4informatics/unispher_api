import { User } from "@prisma/client";
import { LogoutBody, ResetPasswordBody, Session, UserLoginBody, UserRegisterBody } from "./auth.dto";
import db from "../config/db";
import { BadRequestError } from "../shared/errors/BadRequestError";
import { hash, verify } from "../shared/services/argon.service";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";
import { ForbiddenError } from "../shared/errors/ForbidenError";
import { generateAccessToken, generateOtpVerifiedToken, generateRefreshToken, generateResetPasswordOtpMail, hashRefreshToken, verfyOtpVerfiedToken, verifyRefreshToken } from "./auth.utils";
import { sendMail } from "../shared/services/nodemailer.service";
import otpGenerator from "otp-generator";
import { NotFoundError } from "../shared/errors/NotFoundError";



/**
 * Deletes a persisted session by its database identifier.
 * @param id Session primary key.
 * @returns `true` when deletion completes.
 */
const deleteSessionById = async (id: number) => {
    await db.session.delete({ where: { id } });
    return true;
}


/**
 * Finds a session using a plain refresh token.
 * The token is hashed before querying the database.
 * @param refresh_token Raw refresh token.
 * @returns Matching session or `null`.
 */
const getSessionByToken = async (refresh_token: string) => {
    const token = hashRefreshToken(refresh_token);
    const sesssion = await db.session.findUnique({ where: { token } });
    return sesssion;
}

/**
 * Creates a new login session for a user/device pair.
 * @param session Session payload containing user id, raw token and device.
 * @throws ForbiddenError When a session with the same token already exists.
 * @returns The created session record.
 */
const createSession = async (session: Session) => {
    const token = hashRefreshToken(session.token);
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
/**
 * Registers a new user.
 * Teachers are validated by unique email, while students are validated by email or student id.
 * @param data Registration payload.
 * @throws BadRequestError When credentials are already in use.
 * @returns The created user without sensitive fields.
 */
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


/**
 * Authenticates a user and creates a new refresh-token session.
 * Students must authenticate with student id, while non-students may use email.
 * @param data Login credentials.
 * @param device Device metadata to attach to the session.
 * @throws BadRequestError When a student tries to log in with email.
 * @throws UnauthorizedError When credentials are invalid.
 * @returns A pair of access and refresh tokens.
 */
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


/**
 * Validates a refresh token and issues a new access token.
 * Invalid refresh tokens trigger session cleanup when applicable.
 * @param refresh_token Raw refresh token.
 * @throws UnauthorizedError When token/session is invalid or expired.
 * @returns A new access token.
 */
const refreshTokenService = async (refresh_token: string) => {
    const payload = verifyRefreshToken(refresh_token);
    if (!payload) {
        const session = await getSessionByToken(refresh_token);
        if (!session) throw new UnauthorizedError("user is not authentificated");
        await deleteSessionById(session.id);
        throw new UnauthorizedError("user is not authentificated")
    }
    const session = await getSessionByToken(refresh_token);
    if (!session || session.is_expired || (session.expires_at && session.expires_at < new Date())) throw new UnauthorizedError("invalid or expired session login again");
    const accessToken = generateAccessToken({ email: payload.email, id: payload.id });
    return accessToken;
}


/**
 * Generates and emails a password-reset OTP to an existing user.
 * @param user_email User email address.
 * @throws BadRequestError When the email does not match any account.
 * @returns Email sending result and the target user id.
 */
const sendPasswordOtpService = async (user_email: string) => {

    const user = await db.user.findUnique({ where: { email: user_email } });

    if (!user) throw new BadRequestError("Email provided is invalid");
    const otp_code = otpGenerator.generate(6, { digits: true, specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });

    // Create otp in db
    await db.otp.create({
        data: {
            code: otp_code,
            user_id: user.id,
        }
    })
    const result = await sendMail({
        sender: '"Unisphere"<appunisphere@gmail.com>',
        to: user_email,
        html: generateResetPasswordOtpMail(otp_code, user.first_name)
    });
    return { result, user_id: user.id };
}

/**
 * Verifies the submitted OTP for password reset and issues a temporary reset token.
 * OTP validity window is 10 minutes from creation.
 * @param otp_code One-time password code.
 * @param user_id User identifier associated with the OTP.
 * @throws BadRequestError When OTP is invalid or expired.
 * @returns Verification status and reset token.
 */
const resetPasswordVeirfyOtpService = async (otp_code: string, user_id: string) => {

    const otp = await db.otp.findUnique({
        where: {
            user_id_code: {
                user_id, code: otp_code
            }
        }
    });

    const timeDif = otp ? new Date().getTime() - otp.created_at.getTime() : 10 * 60 * 1000;
    const timeDiffMin = Math.floor(timeDif / (1000 * 60));
    if (!otp || timeDiffMin >= 10) throw new BadRequestError("Invalid or expired otp code");

    await db.otp.delete({ where: { id: otp.id } });
    const reset_token = generateOtpVerifiedToken(user_id);
    return { verified: true, reset_token };
}


/**
 * Resets a user's password after validating the OTP-verified token.
 * @param resetPasswordBody Reset payload containing token and new password.
 * @throws ForbiddenError When token or user data is invalid.
 * @returns Password change status.
 */
const resetPasswordService = async (resetPasswordBody: ResetPasswordBody) => {
    const payload = verfyOtpVerfiedToken(resetPasswordBody.reset_token);
    if (!payload) throw new ForbiddenError("Can not reset password try again");
    const user = await db.user.findUnique({ where: { id: payload.user_id } });
    if (!user) throw new ForbiddenError("Can not reset password invalid data");
    const hashPassword = await hash(resetPasswordBody.new_password);
    await db.user.update({ where: { id: user.id }, data: { password: hashPassword } })
    return {
        password_changed: true
    }

}

/**
 * Logs out a user by invalidating the associated refresh-token session.
 * @param logoutBody Logout payload containing refresh token.
 * @throws NotFoundError When the session is invalid or expired.
 * @returns Session deletion status and message.
 */
const userLogoutService = async (logoutBody: LogoutBody) => {
    const session = await getSessionByToken(logoutBody.refresh_token);
    if (!session || session.is_expired || (session.expires_at && session.expires_at < new Date())) throw new NotFoundError("invalid session data");
    const deleteStatus = await deleteSessionById(session.id);
    return { deleteStatus, message: "user logout success!" }
}


export {
    registerUserService,
    loginUserService,
    refreshTokenService,
    sendPasswordOtpService,
    resetPasswordVeirfyOtpService,
    resetPasswordService,
    userLogoutService
}