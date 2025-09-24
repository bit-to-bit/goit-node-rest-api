import nodemailer from "nodemailer";
import "dotenv/config";

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, APP_HOST, APP_PORT } =
  process.env;

const nodemailerConfig = {
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: MAIL_USER };
  return transport.sendMail(email);
};

const generateVerifyEmail = (email, verificationCode) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${APP_HOST}:${APP_PORT}/api/auth/verify/${verificationCode}">Click verify email</a>`,
});

export default { sendEmail, generateVerifyEmail };
