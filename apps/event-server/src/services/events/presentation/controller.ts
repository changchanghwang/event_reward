import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EventService } from '@services/events/application/service';
import { ListCommand } from '@services/events/commands/list';
import { RegisterCommand } from '@services/events/commands/register';

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.eventService.register(registerCommand);
  }

  @Get()
  async list(@Query() listCommand: ListCommand) {
    return this.eventService.list(listCommand);
  }
}
