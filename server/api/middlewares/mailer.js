const nodemailer = require("nodemailer");
const config = require("config");
module.exports.forgetPassword = async (email, subject, text) => {
  let mailer = nodemailer.createTransport({
    service: config.get("app.mail.service"),
    secure: false,
    auth: {
      user: config.get("app.mail.mail"),
      pass: config.get("app.mail.password")
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  await mailer
    .sendMail({
      from: config.get("app.mail.mail"),
      to: email,
      subject: subject,
      text: text
    })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};
