import { IsNumberString } from 'class-validator';

export class ListCommand {
  @IsNumberString()
  page: number;

  @IsNumberString()
  limit: number;
}
