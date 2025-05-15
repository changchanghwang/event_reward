import type { Event } from '../domain/model';

export interface EventRepository {
  save(events: Event[]): Promise<void>;
}
