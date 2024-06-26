const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'TU BAO TRAN <baotutran@email.io>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  console.log(mailOptions);
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
