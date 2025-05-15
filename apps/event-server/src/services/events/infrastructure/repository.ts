import type { Event, EventStatus, EventType } from '../domain/model';

type FindCondition = {
  type?: EventType;
  status?: EventStatus;
};

export interface EventRepository {
  save(events: Event[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Event[]>;
  count(conditions: FindCondition): Promise<number>;
  findOneOrFail(id: Event['id']): Promise<Event>;
}
