import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from =
      this.config.get<string>('mail.from') ?? 'No Reply <no-reply@shop.com>';

    const host = this.config.get<string>('mail.host');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get<number>('mail.port') ?? 587,
        secure: this.config.get<boolean>('mail.secure') ?? false,
        auth: {
          user: this.config.get<string>('mail.user'),
          pass: this.config.get<string>('mail.pass'),
        },
      });
    } else {
      // No SMTP configured (typical in local dev) — links get logged instead.
      this.transporter = null;
      this.logger.warn(
        'SMTP_HOST not set — emails will be logged to the console, not sent.',
      );
    }
  }

  async sendVerificationEmail(to: string, link: string) {
    await this.send(
      to,
      'Verify your email',
      `<p>Welcome! Please confirm your email:</p>
       <p><a href="${link}">Verify my email</a></p>
       <p>Or open this link: ${link}</p>`,
      `Verify your email: ${link}`,
    );
  }

  async sendPasswordResetEmail(to: string, link: string) {
    await this.send(
      to,
      'Reset your password',
      `<p>We received a request to reset your password.</p>
       <p><a href="${link}">Reset password</a></p>
       <p>If you didn't request this, ignore this email. The link expires soon.</p>`,
      `Reset your password: ${link}`,
    );
  }

  private async send(to: string, subject: string, html: string, text: string) {
    if (!this.transporter) {
      this.logger.log(`[DEV MAIL] To: ${to} | ${subject}\n${text}`);
      return;
    }
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
      text,
    });
    this.logger.log(`Email sent to ${to}: ${subject}`);
  }
}
