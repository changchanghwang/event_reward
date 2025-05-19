import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventService } from '@services/events/application/service';
import { ListCommand, RegisterCommand } from '@services/events/commands';

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

  @Get(':id')
  async retrieve(@Param('id') id: string) {
    return this.eventService.retrieve(id);
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    return this.eventService.start(id);
  }
}
