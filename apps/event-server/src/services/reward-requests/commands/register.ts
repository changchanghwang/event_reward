import { IsString } from 'class-validator';

export class RegisterCommand {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsString()
  rewardId: string;
}
