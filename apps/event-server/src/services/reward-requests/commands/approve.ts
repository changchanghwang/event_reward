import { IsString } from 'class-validator';

export class ApproveCommand {
  @IsString()
  id: string;
}
