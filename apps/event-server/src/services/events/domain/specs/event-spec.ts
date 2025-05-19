import { FindOption } from '@libs/db';
import type { EventRepository } from '@services/events/infrastructure/repository';
import type { Event } from '@services/events/domain/model';

export interface EventSpec {
  findSatisfiedElementsFrom(
    repository: EventRepository,
    options?: FindOption,
  ): Promise<Event[]>;
  countSatisfiedElementsFrom(repository: EventRepository): Promise<number>;
}
