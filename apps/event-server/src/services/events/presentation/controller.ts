import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from '@services/events/application/service';
import { RegisterCommand } from '@services/events/commands/register';

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.eventService.register(registerCommand);
  }
}
