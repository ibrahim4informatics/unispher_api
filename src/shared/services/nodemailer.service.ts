import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import ENV from "../../config/ENV";
import { AppError } from "../errors/AppError";
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')
//Initialize nodemailer

const transport = nodemailer.createTransport(
    {

        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        // service:"gmail",
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
        console.log(err)
        throw new AppError("Reset password failed due to email services", 501)
    }

}

export { sendMail }