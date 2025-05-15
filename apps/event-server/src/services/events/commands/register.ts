import { EventType } from '@services/events/domain/model';
import { IsDateString, IsEnum } from 'class-validator';
export class RegisterCommand {
  @IsEnum(EventType)
  type: EventType;

  @IsDateString()
  startAt?: Date;

  @IsDateString()
  endAt?: Date;
}
