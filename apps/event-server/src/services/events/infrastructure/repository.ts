import { FindOption } from '@libs/db';
import type { Event, EventStatus, EventType } from '../domain/model';
import { EventSpec } from '@services/events/domain/specs/event-spec';

export type FindCondition = {
  id?: string;
  type?: EventType;
  status?: EventStatus;
  startAtPeriod?: {
    from?: Date;
    to?: Date;
  };
  endAtPeriod?: {
    from?: Date;
    to?: Date;
  };
};

export interface EventRepository {
  save(events: Event[]): Promise<void>;
  find(conditions: FindCondition, options?: FindOption): Promise<Event[]>;
  count(conditions: FindCondition): Promise<number>;
  findOneOrFail(id: Event['id']): Promise<Event>;
  findSatisfying(spec: EventSpec, options?: FindOption): Promise<Event[]>;
  countSatisfying(spec: EventSpec): Promise<number>;
}
