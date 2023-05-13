"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function SendOtpMail(toperson,otp) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.stackmail.com",
    port: 465,
    secure:  true, // true for 465, false for other ports
    auth: {
      user: "noreply@studioxcreative.ng", // generated ethereal user
      pass: "demgofeelit!!A", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"DoNotReply" <noreply@studioxcreative.ng>', // sender address
    to: toperson, // list of receivers
    subject: "OTP VERIFICATION ", // Subject line
   
    html: `<b>Your Verification Code is ${otp}</b>`, // html body
  });


  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports ={SendOtpMail}
// SendOtpMail().catch(console.error);
