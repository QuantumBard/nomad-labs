import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RemindersService } from "./reminders.service";

@Injectable()
export class RemindersProcessor {
  private readonly logger = new Logger(RemindersProcessor.name);

  constructor(private readonly remindersService: RemindersService) {}

  // Run every 2 hours instead of every hour per user request
  @Cron("0 */2 * * *")
  async processReminders(): Promise<void> {
    this.logger.log("Starting scheduled reminder check (every 2h)...");

    try {
      const result = await this.remindersService.checkAllActiveReminders();
      this.logger.log(
        `Reminder check completed: ${result.checked} checked, ${result.triggered} triggered`,
      );
    } catch (error) {
      this.logger.error("Error processing reminders:", error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOldReminders(): Promise<void> {
    this.logger.log("Checking for expired reminders...");

    try {
      // Expire reminders where start date has passed
      const expiredCount = await this.remindersService[
        "prisma"
      ].flightReminder.updateMany({
        where: {
          status: "ACTIVE",
          startDate: {
            lt: new Date(),
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      this.logger.log(`Expired ${expiredCount.count} old reminders`);
    } catch (error) {
      this.logger.error("Error expiring reminders:", error.message);
    }
  }
}
