import { Inject, Injectable } from '@nestjs/common';
import { RegisterCommand } from '@services/events/commands/register';
import { Event } from '@services/events/domain/model';
import { EventRepository } from '@services/events/infrastructure/repository';

@Injectable()
export class EventService {
  constructor(
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<Event> {
    const event = Event.from({
      type: registerCommand.type,
      startAt: registerCommand.startAt,
      endAt: registerCommand.endAt,
    });

    await this.eventRepository.save([event]);

    return event;
  }
}
