"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogoutService = exports.uploadIdentityService = exports.resetPasswordService = exports.resetPasswordVeirfyOtpService = exports.sendPasswordOtpService = exports.refreshTokenService = exports.loginUserService = exports.registerUserService = void 0;
const db_1 = __importDefault(require("../config/db"));
const BadRequestError_1 = require("../shared/errors/BadRequestError");
const argon_service_1 = require("../shared/services/argon.service");
const UnauthorizedError_1 = require("../shared/errors/UnauthorizedError");
const ForbidenError_1 = require("../shared/errors/ForbidenError");
const auth_utils_1 = require("./auth.utils");
const nodemailer_service_1 = require("../shared/services/nodemailer.service");
const otp_generator_1 = __importDefault(require("otp-generator"));
const NotFoundError_1 = require("../shared/errors/NotFoundError");
const cloudinary_service_1 = require("../shared/services/cloudinary.service");
/**
 * Deletes a persisted session by its database identifier.
 * @param id Session primary key.
 * @returns `true` when deletion completes.
 */
const deleteSessionById = async (id) => {
    await db_1.default.session.delete({ where: { id } });
    return true;
};
/**
 * Finds a session using a plain refresh token.
 * The token is hashed before querying the database.
 * @param refresh_token Raw refresh token.
 * @returns Matching session or `null`.
 */
const getSessionByToken = async (refresh_token) => {
    const token = (0, auth_utils_1.hashRefreshToken)(refresh_token);
    const sesssion = await db_1.default.session.findUnique({ where: { token } });
    return sesssion;
};
/**
 * Creates a new login session for a user/device pair.
 * @param session Session payload containing user id, raw token and device.
 * @throws ForbiddenError When a session with the same token already exists.
 * @returns The created session record.
 */
const createSession = async (session) => {
    const token = (0, auth_utils_1.hashRefreshToken)(session.token);
    const session_exists = await db_1.default.session.findUnique({ where: { token } });
    if (session_exists)
        throw new ForbidenError_1.ForbiddenError("invalid session try again");
    const newSession = await db_1.default.session.create({
        data: {
            user_id: session.user_id,
            token,
            device: session.device
        }
    });
    return newSession;
};
// Exported Services Consumed by auth Controllers
/**
 * Registers a new user.
 * Teachers are validated by unique email, while students are validated by email or student id.
 * @param data Registration payload.
 * @throws BadRequestError When credentials are already in use.
 * @returns The created user without sensitive fields.
 */
const registerUserService = async (data) => {
    const { student_id, email, password, first_name, last_name, bio, role = "STUDENT" } = data;
    const hashPassword = await (0, argon_service_1.hash)(password);
    if (role === "TEACHER") {
        const teacher = await db_1.default.user.findUnique({ where: { email } });
        if (teacher)
            throw new BadRequestError_1.BadRequestError("the email is taken");
        const { avatar_url, student_id, password, ...newTeacher } = await db_1.default.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword } });
        return newTeacher;
    }
    else {
        const student = await db_1.default.user.findFirst({ where: { OR: [{ student_id }, { email }] } });
        if (student && student.email === email)
            throw new BadRequestError_1.BadRequestError("the email is taken");
        else if (student && student.student_id === student_id)
            throw new BadRequestError_1.BadRequestError("the student exist");
        const { avatar_url, password, ...newStudent } = await db_1.default.user.create({ data: { email, first_name, last_name, role, bio, password: hashPassword, student_id } });
        return newStudent;
    }
};
exports.registerUserService = registerUserService;
/**
 * Authenticates a user and creates a new refresh-token session.
 * Students must authenticate with student id, while non-students may use email.
 * @param data Login credentials.
 * @param device Device metadata to attach to the session.
 * @throws BadRequestError When a student tries to log in with email.
 * @throws UnauthorizedError When credentials are invalid.
 * @returns A pair of access and refresh tokens.
 */
const loginUserService = async (data, device) => {
    const { password, email, student_id } = data;
    let user;
    /**
     * Here it means that a student who made request for auth  with his student id
     */
    if (student_id) {
        user = await db_1.default.user.findUnique({ where: { student_id } });
    }
    else if (email) {
        user = await db_1.default.user.findUnique({ where: { email } });
        if (user?.role === "STUDENT")
            throw new BadRequestError_1.BadRequestError("Can not login with email");
    }
    if (!user)
        throw new UnauthorizedError_1.UnauthorizedError("Invalid email or password");
    const isCorrectPassword = await (0, argon_service_1.verify)(password, user.password);
    if (!isCorrectPassword)
        throw new UnauthorizedError_1.UnauthorizedError("Invalid email or password");
    const accessToken = (0, auth_utils_1.generateAccessToken)({ email: user.email, id: user.id });
    const refreshToken = (0, auth_utils_1.generateRefreshToken)({ email: user.email, id: user.id });
    createSession({ device, token: refreshToken, user_id: user.id });
    return {
        accessToken, refreshToken
    };
};
exports.loginUserService = loginUserService;
/**
 * Validates a refresh token and issues a new access token.
 * Invalid refresh tokens trigger session cleanup when applicable.
 * @param refresh_token Raw refresh token.
 * @throws UnauthorizedError When token/session is invalid or expired.
 * @returns A new access token.
 */
const refreshTokenService = async (refresh_token) => {
    const payload = (0, auth_utils_1.verifyRefreshToken)(refresh_token);
    if (!payload) {
        const session = await getSessionByToken(refresh_token);
        if (!session)
            throw new UnauthorizedError_1.UnauthorizedError("user is not authentificated");
        await deleteSessionById(session.id);
        throw new UnauthorizedError_1.UnauthorizedError("user is not authentificated");
    }
    const session = await getSessionByToken(refresh_token);
    if (!session || session.is_expired || (session.expires_at && session.expires_at < new Date()))
        throw new UnauthorizedError_1.UnauthorizedError("invalid or expired session login again");
    const accessToken = (0, auth_utils_1.generateAccessToken)({ email: payload.email, id: payload.id });
    return accessToken;
};
exports.refreshTokenService = refreshTokenService;
/**
 * Generates and emails a password-reset OTP to an existing user.
 * @param user_email User email address.
 * @throws BadRequestError When the email does not match any account.
 * @returns Email sending result and the target user id.
 */
const sendPasswordOtpService = async (user_email) => {
    const user = await db_1.default.user.findUnique({ where: { email: user_email } });
    if (!user)
        throw new BadRequestError_1.BadRequestError("Email provided is invalid");
    const otp_code = otp_generator_1.default.generate(6, { digits: true, specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
    // Create otp in db
    await db_1.default.otp.create({
        data: {
            code: otp_code,
            user_id: user.id,
        }
    });
    const result = await (0, nodemailer_service_1.sendMail)({
        sender: '"Unisphere"<appunisphere@gmail.com>',
        subject: "Account Reset Password Request",
        to: user_email,
        html: (0, auth_utils_1.generateResetPasswordOtpMail)(otp_code, user.first_name)
    });
    return { result, user_id: user.id };
};
exports.sendPasswordOtpService = sendPasswordOtpService;
/**
 * Verifies the submitted OTP for password reset and issues a temporary reset token.
 * OTP validity window is 10 minutes from creation.
 * @param otp_code One-time password code.
 * @param user_id User identifier associated with the OTP.
 * @throws BadRequestError When OTP is invalid or expired.
 * @returns Verification status and reset token.
 */
const resetPasswordVeirfyOtpService = async (otp_code, user_id) => {
    const otp = await db_1.default.otp.findUnique({
        where: {
            user_id_code: {
                user_id, code: otp_code
            }
        }
    });
    const timeDif = otp ? new Date().getTime() - otp.created_at.getTime() : 10 * 60 * 1000;
    const timeDiffMin = Math.floor(timeDif / (1000 * 60));
    if (!otp || timeDiffMin >= 10)
        throw new BadRequestError_1.BadRequestError("Invalid or expired otp code");
    await db_1.default.otp.delete({ where: { id: otp.id } });
    const reset_token = (0, auth_utils_1.generateOtpVerifiedToken)(user_id);
    return { verified: true, reset_token };
};
exports.resetPasswordVeirfyOtpService = resetPasswordVeirfyOtpService;
/**
 * Resets a user's password after validating the OTP-verified token.
 * @param resetPasswordBody Reset payload containing token and new password.
 * @throws ForbiddenError When token or user data is invalid.
 * @returns Password change status.
 */
const resetPasswordService = async (resetPasswordBody) => {
    const payload = (0, auth_utils_1.verfyOtpVerfiedToken)(resetPasswordBody.reset_token);
    if (!payload)
        throw new ForbidenError_1.ForbiddenError("Can not reset password try again");
    const user = await db_1.default.user.findUnique({ where: { id: payload.user_id } });
    if (!user)
        throw new ForbidenError_1.ForbiddenError("Can not reset password invalid data");
    const hashPassword = await (0, argon_service_1.hash)(resetPasswordBody.new_password);
    await db_1.default.user.update({ where: { id: user.id }, data: { password: hashPassword } });
    return {
        password_changed: true
    };
};
exports.resetPasswordService = resetPasswordService;
/**
 * Logs out a user by invalidating the associated refresh-token session.
 * @param logoutBody Logout payload containing refresh token.
 * @throws NotFoundError When the session is invalid or expired.
 * @returns Session deletion status and message.
 */
const userLogoutService = async (logoutBody) => {
    const session = await getSessionByToken(logoutBody.refresh_token);
    if (!session || session.is_expired || (session.expires_at && session.expires_at < new Date()))
        throw new NotFoundError_1.NotFoundError("invalid session data");
    const deleteStatus = await deleteSessionById(session.id);
    return { deleteStatus, message: "user logout success!" };
};
exports.userLogoutService = userLogoutService;
const uploadIdentityService = async (user_id, file) => {
    if (!file)
        throw new BadRequestError_1.BadRequestError("No file uploaded");
    if (!file.mimetype.startsWith("image/"))
        throw new BadRequestError_1.BadRequestError("Invalid file type only images allowed");
    if (!user_id)
        throw new BadRequestError_1.BadRequestError("user id is required");
    const user = await db_1.default.user.findUnique({ where: { id: user_id } });
    if (!user)
        throw new BadRequestError_1.BadRequestError("invalid user id");
    const fileUrl = await (0, cloudinary_service_1.uploadToCloudinary)(file, "unispher_id_cards");
    await db_1.default.user.update({ where: { id: user_id }, data: { id_card_url: fileUrl } });
};
exports.uploadIdentityService = uploadIdentityService;
