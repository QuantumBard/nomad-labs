import { Controller, Get, Post, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@ApiTags('Reminders')
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reminders for a user' })
  async getUserReminders(@Query('userId') userId: string): Promise<{
    success: boolean;
    data: any[];
    stats: {
      total: number;
      active: number;
      triggered: number;
    };
  }> {
    return this.remindersService.getUserReminders(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new flight price reminder' })
  async createReminder(@Body() createDto: CreateReminderDto): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    return this.remindersService.createReminder(createDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  async deleteReminder(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.remindersService.deleteReminder(id, userId);
  }

  @Post(':id/check')
  @ApiOperation({ summary: 'Manually check reminder price' })
  async checkReminderPrice(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{
    success: boolean;
    data: {
      currentPrice: number;
      targetPrice: number;
      isTriggered: boolean;
      discount: number;
    };
  }> {
    return this.remindersService.checkReminderPrice(id);
  }
}
