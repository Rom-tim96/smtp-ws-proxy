import { Buffer } from 'node:buffer';
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT } =
  process.env;

class Mail {
  #transporter = null;

  constructor() {

    this.#transporter = nodemailer.createTransport({
      // service: "Yandex",
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD,
      },
    });
    
  }

  // #getTransporter() {
  //   return nodemailer.createTransport({
  //     host: EMAIL_HOST,
  //     port: EMAIL_PORT,
  //     secure: false,
  //     auth: {
  //       user: EMAIL_HOST_USER,
  //       pass: EMAIL_HOST_PASSWORD
  //     }
  //   })
  // }

  async send(reciever, message, attachments) {
    
    try {
      const info = await this.#transporter.sendMail({
        attachments,
        // : attachments.map(({filename, path}) => ({
          // filename, path//content: Buffer.from(path, 'base64url')
        // })),
        from: EMAIL_HOST_USER,
        to: reciever,
        subject: "Welcome to Test site",
        text: message,
        html: `<b>${message}</b>`,
      });
      return info.messageId;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default new Mail();
