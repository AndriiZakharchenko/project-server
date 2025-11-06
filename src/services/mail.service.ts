import nodemailer from 'nodemailer';

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  static async sendActivationMail(to: string, link: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Account Activation on ${process.env.CLIENT_URL}`,
        html: `
        <div>
          <h1>To activate your account, please click on the link below:</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
      });

      console.log('Email sent successfully:', {
        to,
        messageId: info.messageId,
        response: info.response,
      });
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }
}
