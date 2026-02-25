import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import ENV from "../../config/ENV";
import { AppError } from "../errors/AppError";

//Initialize nodemailer

const transport = nodemailer.createTransport(
    {
        service: "gmail",
        auth: {
            user: "appunisphere@gmail.com",
            pass: ENV.GMAIL_APP_PASSWORD
        }
    }
)


const sendMail = async (mailOptions: MailOptions) => {
    try {
        const result = await transport.sendMail(mailOptions);
        return result;
    }

    catch (err) {
        throw new AppError("Reset password failed due to email services", 501)
    }

}

export { sendMail }