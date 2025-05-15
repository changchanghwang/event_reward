import { EventType } from '@services/events/domain/model';

export class RegisterCommand {
  type: EventType;
  startAt?: Date;
  endAt?: Date;
}
