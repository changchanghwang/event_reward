import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ListCommand, RegisterCommand } from '@services/events/commands';
import { Event, EventStatus } from '@services/events/domain/model';
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

  async list(listCommand: ListCommand): Promise<Paginated<Event>> {
    const [events, count] = await Promise.all([
      this.eventRepository.find(
        {},
        {
          limit: listCommand.limit,
          page: listCommand.page,
        },
      ),
      this.eventRepository.count({}),
    ]);

    return { items: events, count };
  }

  async retrieve(id: string): Promise<Event> {
    return await this.eventRepository.findOneOrFail(id);
  }

  async start(id: string) {
    const event = await this.eventRepository.findOneOrFail(id);
    event.start();
    await this.eventRepository.save([event]);
    return event;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async autoStart() {
    const events = await this.eventRepository.find({
      status: EventStatus.SCHEDULED,
      startAtPeriod: {
        to: new Date(),
      },
    });

    if (!events.length) {
      return;
    }

    for (const event of events) {
      event.start();
    }
    await this.eventRepository.save(events);
  }
}
