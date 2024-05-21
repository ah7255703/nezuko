import nodemailer from 'nodemailer';

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: "eae9d8f2eb13afb90d28994cd5ffa00e"
            }
        })
        this.verify().then((f) => {
            if (f) {
                console.log("Email Service is ready")
            } else {
                console.log("Email Service is not ready")
            }
        })
    }

    async verify() {
        return this.transporter.verify()
    }

    get ts() {
        return this.transporter;
    }
}

export const mailService = new EmailService()