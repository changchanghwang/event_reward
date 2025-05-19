import { DddEvent } from '@libs/ddd/event';

export class ActivityRegisteredEvent extends DddEvent {
  constructor(
    public readonly activityId: string,
    public readonly eventId: string,
    public readonly userId: string,
    public readonly participatedOn: CalendarDate,
  ) {
    super();
  }
}
