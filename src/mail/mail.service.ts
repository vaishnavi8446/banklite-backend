// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { KycStatus } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // ✅ Your email
      pass: 'your-app-password', // ✅ Use app password (not your Gmail password)
    },
  });

  async sendKycStatusEmail(to: string, status: KycStatus) {
    if (status === KycStatus.APPROVED || status === KycStatus.REJECTED) {
      const subject = `Your KYC has been ${status}`;
      const message = `Hi, your KYC has been ${status.toLowerCase()}.`;

      await this.transporter.sendMail({
        from: '"BankLite" <your-email@gmail.com>',
        to,
        subject,
        text: message,
      });
    } else {
      throw new Error('Invalid KYC status for email');
    }
  }
}
