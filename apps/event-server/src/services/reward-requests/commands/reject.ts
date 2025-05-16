import { IsString } from 'class-validator';

export class RejectCommand {
  @IsString()
  id: string;
}
