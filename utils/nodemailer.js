const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Joao Vitor Massuia Roberto <${process.env.MAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      //Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PWD,
        },
      });
    }
  }
  async send(template, subject) {
    //Send the actual email

    //1) Render HTML based on pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.htmlToText(html),
      //   html
    };

    //3) Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the natours family");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};

// const sendEmail = async (options) => {
//   //1) Create a transporter
//   var transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     auth: {
//       user: process.env.MAIL_USERNAME,
//       pass: process.env.MAIL_PWD,
//     },
//   });

//   //2) Define the email options
//   const mailOptions = {
//     from: "Joao Vitor Massuia Roberto <test1@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     //   html
//   };

//   //3) Transmit the email and the content using the transporter and nodemailer utility
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
