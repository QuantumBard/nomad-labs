import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { RemindersProcessor } from './reminders.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { FlightModule } from '../flight/flight.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [PrismaModule, FlightModule, NotificationsModule, QueueModule],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersProcessor],
  exports: [RemindersService],
})
export class RemindersModule {}
