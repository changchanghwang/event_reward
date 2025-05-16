import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListCommand {
  @IsString()
  @IsOptional()
  eventId: string;

  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;
}
