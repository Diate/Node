const nodemailer = require('nodemailer');
const sendEmail = async (option) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'TU BAO TRAN <baotutran12@email.io>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  transport.sendMail(mailOptions);
};
module.exports = sendEmail;
