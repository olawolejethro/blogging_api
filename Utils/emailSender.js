const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function emailSender({ email, body, subject }) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Olawole Jethro 👻" <${process.env.EMAIL_USER}>`, // sender address
    to: `kunlekzi2@gmail.com, ${email}`, // list of receivers
    subject, // Subject line
    // text: "kindly make use of this link to reset your password?", // plain text body
    html: body, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
module.exports = emailSender;
