const nodemailer = require("nodemailer");
module.exports = async (email, subject, text) => {
  console.log(process.env.HOST);
  console.log(process.env.SERVICE);
  console.log(process.env.EMAIL_PORT);
  console.log(process.env.SECURE);
  console.log(process.env.USER_NAME);
  console.log(process.env.PASS);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER_NAME,   
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not send");
    console.log(error);
  }
};
