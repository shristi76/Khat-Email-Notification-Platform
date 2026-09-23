const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (recipient, subject, message, replyTo) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    replyTo,
    to: recipient,
    subject: subject,
    text: message,
  });
};

module.exports = { sendEmail };
