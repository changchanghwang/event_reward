import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { RewardType } from '@services/rewards/domain/model';
import { IsEnum } from 'class-validator';

export class RegisterCommand {
  @IsEnum(RewardType)
  type: RewardType;

  @IsNumber()
  amount: number;

  @IsNumber()
  required: number;

  @IsString()
  eventId: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsBoolean()
  isManual: boolean;
}
