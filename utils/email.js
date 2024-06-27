const nodemailer = require('nodemailer');
const sendEmail = async (option) => {
  var transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '7a6ea375a0d4fe',
      pass: '44cf8225a7bec3',
    },
  });
  console.log(transport);
  const mailOptions = {
    from: 'TU BAO TRAN <baotutran12@email.io>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  console.log(mailOptions);
  transport.sendMail(mailOptions);
};
module.exports = sendEmail;
