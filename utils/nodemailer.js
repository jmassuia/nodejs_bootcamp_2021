const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Create a transporter
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PWD,
    },
  });

  //2) Define the email options
  const mailOptions = {
    from: "Joao Vitor Massuia Roberto <test1@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //   html
  };

  //3) Transmit the email and the content using the transporter and nodemailer utility
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
