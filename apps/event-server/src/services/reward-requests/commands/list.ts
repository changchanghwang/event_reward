import { RewardRequestStatus } from '@services/reward-requests/domain/model';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListCommand {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsEnum(RewardRequestStatus)
  @IsOptional()
  status?: RewardRequestStatus;

  @IsNumberString()
  page: number;

  @IsNumberString()
  limit: number;
}
