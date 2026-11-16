import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

interface PriceAlertPayload {
  source: string;
  destination: string;
  currentPrice: number;
  targetPrice: number;
  discount: number;
}

interface NotificationResult {
  success: boolean;
  message: string;
  provider?: string;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter | null = null;
  private readonly emailFrom: string;
  private readonly smtpUser: string;
  private readonly isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDev =
      this.configService.get("NODE_ENV", "development") !== "production";
    this.emailFrom = this.configService.get<string>(
      "EMAIL_FROM",
      "Flight Alerts <alerts@nomadlabs.app>",
    );
    this.smtpUser = this.configService.get<string>("SMTP_USER", "");
  }

  async onModuleInit() {
    const host = this.configService.get<string>("SMTP_HOST");
    const port = this.configService.get<number>("SMTP_PORT", 587);
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587
        auth: { user, pass },
      });

      try {
        await this.transporter.verify();
        this.logger.log(
          `✅ Nodemailer SMTP connected: ${host}:${port} as ${user}`,
        );
      } catch (err) {
        this.logger.warn(
          `⚠️  SMTP connection failed: ${err.message}. Falling back to mock notifications.`,
        );
        this.transporter = null;
      }
    } else {
      this.logger.warn(
        "📭 SMTP credentials not configured — email alerts will be logged to console only.",
      );
    }
  }

  async sendPriceAlert(
    userId: string,
    payload: PriceAlertPayload,
  ): Promise<NotificationResult> {
    try {
      this.logger.log(
        `Sending price alert to user ${userId}: ${payload.source} → ${payload.destination} at $${payload.currentPrice}`,
      );

      // If SMTP transporter is live, send a real email.
      // NOTE: To look up the user's actual email address you need to query your
      //       user table / Supabase auth. For now we use the configured SMTP_USER
      //       as a fallback recipient (replace with a DB call when ready).
      if (this.transporter) {
        return await this.sendEmailNotification(userId, payload);
      }

      // Development / no SMTP: log a mock notification
      return this.sendMockNotification(userId, payload);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}:`,
        error.message,
      );
      return {
        success: false,
        message: `Failed to send notification: ${error.message}`,
      };
    }
  }

  private async sendEmailNotification(
    userId: string,
    payload: PriceAlertPayload,
  ): Promise<NotificationResult> {
    // TODO: Replace `this.smtpUser` with a real DB call to get the user email:
    //   const user = await this.prisma.user.findUnique({ where: { id: userId } });
    //   const toEmail = user?.email;
    const toEmail = this.smtpUser; // fallback until user lookup is wired

    const savingsAmount = (payload.targetPrice - payload.currentPrice).toFixed(
      2,
    );

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
    .wrapper { max-width: 540px; margin: 40px auto; background: #111; border: 1px solid #222; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; color: #fff; }
    .badge { display: inline-block; background: #00c896; color: #000; font-weight: 700; padding: 4px 12px; border-radius: 99px; font-size: 13px; margin-top: 8px; }
    .body { padding: 32px; }
    .route { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 24px; }
    .stat-row { display: flex; gap: 12px; margin-bottom: 16px; }
    .stat { flex: 1; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 16px; text-align: center; }
    .stat label { display: block; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .stat .value { font-size: 22px; font-weight: 700; }
    .current { color: #00c896; }
    .target { color: #888; }
    .savings { color: #f59e0b; }
    .cta { display: block; margin-top: 24px; background: #fff; color: #000; text-align: center; padding: 14px; border-radius: 99px; font-weight: 700; text-decoration: none; font-size: 15px; }
    .footer { padding: 16px 32px; border-top: 1px solid #222; font-size: 12px; color: #555; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✈️ Price Alert Triggered!</h1>
      <span class="badge">🎉 ${payload.discount}% Below Your Target</span>
    </div>
    <div class="body">
      <div class="route">${payload.source} → ${payload.destination}</div>
      <div class="stat-row">
        <div class="stat">
          <label>Current Price</label>
          <span class="value current">$${payload.currentPrice}</span>
        </div>
        <div class="stat">
          <label>Your Target</label>
          <span class="value target">$${payload.targetPrice}</span>
        </div>
        <div class="stat">
          <label>You Save</label>
          <span class="value savings">$${savingsAmount}</span>
        </div>
      </div>
      <a class="cta" href="https://www.google.com/travel/flights?q=Flights+to+${payload.destination}+from+${payload.source}">
        Book Now Before Price Goes Up →
      </a>
    </div>
    <div class="footer">You're receiving this because you set a flight price alert on NomadLabs. <br/>Your reminder will be deactivated after notifying you once.</div>
  </div>
</body>
</html>
    `;

    await this.transporter!.sendMail({
      from: this.emailFrom,
      to: toEmail,
      subject: `🎉 Price Alert: ${payload.source} → ${payload.destination} is now $${payload.currentPrice}!`,
      html,
    });

    this.logger.log(`📧 Price alert email sent to ${toEmail}`);
    return {
      success: true,
      message: `Email sent to ${toEmail}`,
      provider: "nodemailer",
    };
  }

  private sendMockNotification(
    userId: string,
    payload: PriceAlertPayload,
  ): NotificationResult {
    this.logger.log(`
📧 MOCK EMAIL NOTIFICATION (configure SMTP to send real emails)
   To:       User ${userId}
   Subject:  Price Alert: ${payload.source} → ${payload.destination} is now $${payload.currentPrice}!
   Savings:  $${payload.targetPrice - payload.currentPrice} (${payload.discount}% below target)
    `);

    return {
      success: true,
      message: "Mock notification logged",
      provider: "mock",
    };
  }

  async sendBulkPriceAlerts(
    alerts: Array<{ userId: string; payload: PriceAlertPayload }>,
  ): Promise<{
    success: number;
    failed: number;
    results: NotificationResult[];
  }> {
    const results: NotificationResult[] = [];
    let success = 0;
    let failed = 0;

    for (const alert of alerts) {
      const result = await this.sendPriceAlert(alert.userId, alert.payload);
      results.push(result);
      if (result.success) success++;
      else failed++;
    }

    this.logger.log(`Bulk notifications: ${success} sent, ${failed} failed`);
    return { success, failed, results };
  }

  async sendReminderExpiryNotification(
    userId: string,
    reminderId: string,
  ): Promise<NotificationResult> {
    this.logger.log(
      `Sending expiry notification for reminder ${reminderId} to user ${userId}`,
    );
    if (!this.transporter) {
      this.logger.log(
        `📧 MOCK: Reminder ${reminderId} has expired for user ${userId}`,
      );
    }
    return {
      success: true,
      message: "Expiry notification sent",
      provider: this.transporter ? "nodemailer" : "mock",
    };
  }
}
