import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
class Mailer {
  static instance;
  constructor() {
    if (!Mailer.instance) {
      console.log('Initializing Mailer');
      Mailer.instance = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: "awsomecoders@gmail.com",
            pass: "PIYpiy29@123",
          },
        })
      );
    }
    return Mailer.instance;
  }
  static getInstance() {
    if (!Mailer.instance) {
      new Mailer();
    }
    return Mailer.instance;
  }
}

export default Mailer;
