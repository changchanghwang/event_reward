import { Event, EventStatus, EventType } from '@services/events/domain/model';
import { plainToInstance } from 'class-transformer';

export function eventOf(args: {
  id?: string;
  type?: EventType;
  startAt?: Date;
  endAt?: Date;
  status?: EventStatus;
  transitAt?: Date;
}) {
  return plainToInstance(Event, {
    id: args.id ?? 'test-id',
    type: args.type ?? EventType.ATTENDANCE,
    startAt: args.startAt,
    endAt: args.endAt,
    status: args.status ?? EventStatus.PENDING,
    transitAt: args.transitAt,
  });
}
